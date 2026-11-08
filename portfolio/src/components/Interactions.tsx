"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/*
 * All pointer polish runs from ONE requestAnimationFrame loop. The pointermove handler only
 * records coordinates; every DOM read (getBoundingClientRect) and write (transform) happens
 * once per frame, reads first, writes after — no layout thrashing, no stacked CSS transitions.
 *
 *   cursor     : a precise dot + a trailing ring that grows over links, turns into a label
 *                ("Open", "Drag") over cards and sliders, and squeezes on press
 *   glow       : soft light trailing the pointer
 *   spotlight  : --mx/--my on the hovered card for the radial highlight + edge glow
 *   tilt       : spring-smoothed 3-D lean on project / lab / win cards
 *   magnetic   : primary buttons ease toward the pointer and spring back
 *
 * Touch devices and reduced-motion users get none of it.
 */

const SPOT = ".tile, .card, .ach, .wrc, .labcard, .about-box, .demo, .qa, .dream, .hire-num";
const TILT = ".labcard, .wrc, .ach, .hire-num";
const MAGNET = ".clinks a, .nav-links .resume, .play, .viewall, .cv-dl a, .theme-btn";
const LINKY = "a, button, [role='button'], [role='slider'], summary, label, select, .node";
const TEXTY = "input:not([type='range']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Spring { el: HTMLElement; rx: number; ry: number; lift: number; trx: number; try: number; tlift: number; }
interface Mag { el: HTMLElement; x: number; y: number; tx: number; ty: number; }

export default function Interactions() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});

  // a route change unmounts whatever was hovered — clear cursor state
  useEffect(() => { resetRef.current(); }, [pathname]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const root = document.documentElement;
    root.classList.add("fx");

    const dot = dotRef.current!, ring = ringRef.current!, label = labelRef.current!, glow = glowRef.current!;
    const p = { x: innerWidth / 2, y: innerHeight / 2, seen: false, down: false, target: null as Element | null, dirty: false };
    const d = { x: p.x, y: p.y }, r = { x: p.x, y: p.y, s: 1 }, g = { x: p.x, y: p.y };
    let ringMode = "", ringScaleTarget = 1;
    const tilts = new Map<HTMLElement, Spring>();
    const mags = new Map<HTMLElement, Mag>();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      p.x = e.clientX; p.y = e.clientY; p.target = e.target as Element; p.dirty = true;
      if (!p.seen) { p.seen = true; d.x = r.x = g.x = p.x; d.y = r.y = g.y = p.y; root.classList.add("cur-on", "fx-cursor"); }
    };
    const onDown = () => { p.down = true; };
    const onUp = () => { p.down = false; };
    const onLeave = () => { root.classList.remove("cur-on"); p.seen = false; p.target = null; p.dirty = true; };
    const onScroll = () => { p.dirty = true; };

    const setMode = (mode: string, text = "") => {
      if (mode === ringMode && label.textContent === text) return;
      ringMode = mode;
      ring.dataset.mode = mode;
      label.textContent = text;
      ringScaleTarget = mode === "label" ? 2.3 : mode === "link" ? 1.55 : mode === "text" ? 0.4 : 1;
    };

    const frame = () => {
      // ---------- READ phase (once per frame) ----------
      const t = p.target && p.target.isConnected ? p.target : null;
      let spotEl: HTMLElement | null = null, spotRect: DOMRect | null = null;
      let tiltEl: HTMLElement | null = null, tiltRect: DOMRect | null = null;
      let magEl: HTMLElement | null = null, magRect: DOMRect | null = null;
      if (t && p.dirty) {
        spotEl = t.closest<HTMLElement>(SPOT); if (spotEl) spotRect = spotEl.getBoundingClientRect();
        tiltEl = t.closest<HTMLElement>(TILT); if (tiltEl) tiltRect = tiltEl.getBoundingClientRect();
        magEl = t.closest<HTMLElement>(MAGNET); if (magEl) magRect = magEl.getBoundingClientRect();

        // cursor mode
        if (t.closest(TEXTY)) setMode("text");
        else if (t.closest("input[type='range'], .dream-scrub")) setMode("label", "Drag");
        else if (t.closest("a.labcard, a.wrc, a.hire-num, .card a, a.ach")) setMode("label", t.closest("a.labcard") ? "Try" : "Open");
        else if (t.closest(LINKY)) setMode("link");
        else setMode("");
      }

      // ---------- targets ----------
      if (p.dirty) {
        if (spotEl && spotRect) { spotEl.style.setProperty("--mx", `${p.x - spotRect.left}px`); spotEl.style.setProperty("--my", `${p.y - spotRect.top}px`); }

        for (const s of tilts.values()) { s.trx = 0; s.try = 0; s.tlift = 0; }
        if (tiltEl && tiltRect) {
          let s = tilts.get(tiltEl);
          if (!s) { s = { el: tiltEl, rx: 0, ry: 0, lift: 0, trx: 0, try: 0, tlift: 0 }; tilts.set(tiltEl, s); tiltEl.style.willChange = "transform"; }
          const px = (p.x - tiltRect.left) / tiltRect.width - 0.5, py = (p.y - tiltRect.top) / tiltRect.height - 0.5;
          s.trx = -py * 6; s.try = px * 7; s.tlift = -5;
        }

        for (const m of mags.values()) { m.tx = 0; m.ty = 0; }
        if (magEl && magRect) {
          let m = mags.get(magEl);
          if (!m) { m = { el: magEl, x: 0, y: 0, tx: 0, ty: 0 }; mags.set(magEl, m); }
          m.tx = (p.x - (magRect.left + magRect.width / 2)) * 0.22;
          m.ty = (p.y - (magRect.top + magRect.height / 2)) * 0.32;
        }
        p.dirty = false;
      }

      // ---------- WRITE phase ----------
      d.x = lerp(d.x, p.x, 0.55); d.y = lerp(d.y, p.y, 0.55);
      r.x = lerp(r.x, p.x, 0.2); r.y = lerp(r.y, p.y, 0.2);
      g.x = lerp(g.x, p.x, 0.09); g.y = lerp(g.y, p.y, 0.09);
      r.s = lerp(r.s, ringScaleTarget * (p.down ? 0.8 : 1), 0.2);
      dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) scale(${ringMode === "label" || ringMode === "text" ? 0 : p.down ? 0.6 : 1})`;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) scale(${r.s.toFixed(3)})`;
      label.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      glow.style.transform = `translate3d(${g.x - 300}px, ${g.y - 300}px, 0)`;

      for (const [el, s] of tilts) {
        s.rx = lerp(s.rx, s.trx, 0.14); s.ry = lerp(s.ry, s.try, 0.14); s.lift = lerp(s.lift, s.tlift, 0.14);
        const settled = Math.abs(s.rx) + Math.abs(s.ry) + Math.abs(s.lift) < 0.02 && s.tlift === 0;
        if (settled || !el.isConnected) { el.style.transform = ""; el.style.willChange = ""; tilts.delete(el); continue; }
        el.style.transform = `perspective(900px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) translate3d(0, ${s.lift.toFixed(2)}px, 0)`;
      }
      for (const [el, m] of mags) {
        m.x = lerp(m.x, m.tx, 0.18); m.y = lerp(m.y, m.ty, 0.18);
        if ((Math.abs(m.x) + Math.abs(m.y) < 0.05 && m.tx === 0 && m.ty === 0) || !el.isConnected) { el.style.transform = ""; mags.delete(el); continue; }
        el.style.transform = `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`;
      }

      raf = requestAnimationFrame(frame);
    };

    resetRef.current = () => {
      for (const [el] of tilts) { el.style.transform = ""; el.style.willChange = ""; }
      for (const [el] of mags) el.style.transform = "";
      tilts.clear(); mags.clear(); setMode(""); p.dirty = true;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame); };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resetRef.current();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      root.classList.remove("fx", "fx-cursor", "cur-on");
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={ringRef} className="cur-ring" aria-hidden />
      <span ref={labelRef} className="cur-label" aria-hidden />
      <div ref={dotRef} className="cur-dot" aria-hidden />
    </>
  );
}
