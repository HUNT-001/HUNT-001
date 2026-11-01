"use client";
import { useEffect, useRef } from "react";

/*
 * One delegated pointer listener drives every hover nicety on the site:
 *   - cursor glow     : a soft light that trails the pointer (lerped, so it feels weighty)
 *   - card spotlight  : sets --mx/--my on the hovered card so a radial highlight follows the cursor
 *   - card tilt       : a gentle 3-D lean on project / lab cards
 *   - magnetic CTAs   : primary buttons drift a few px toward the cursor
 * Touch devices and reduced-motion users get none of it — nothing breaks without it.
 */

const SPOT = ".tile, .card, .ach, .wrc, .labcard, .about-box, .demo, .qa, .dream, .cv-item, .mk";
const TILT = ".labcard, .wrc, .ach";
const MAGNET = ".clinks a, .nav-links .resume, .play, .viewall, .cv-dl a";

export default function Interactions() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    document.documentElement.classList.add("fx");

    const glow = glowRef.current;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 3, gx = tx, gy = ty;
    let raf = 0;
    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;

    const loop = () => {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      if (glow) glow.style.transform = `translate3d(${gx - 300}px, ${gy - 300}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const reset = (el: HTMLElement | null) => { if (el) el.style.transform = ""; };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      const target = e.target as Element | null;
      if (!target || !(target instanceof Element)) return;

      const spot = target.closest<HTMLElement>(SPOT);
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const tilt = target.closest<HTMLElement>(TILT);
      if (tilt !== tiltEl) { reset(tiltEl); tiltEl = tilt; }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      }

      const mag = target.closest<HTMLElement>(MAGNET);
      if (mag !== magEl) { reset(magEl); magEl = mag; }
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.28).toFixed(1)}px)`;
      }
    };
    const onLeaveDoc = () => { reset(tiltEl); reset(magEl); tiltEl = magEl = null; };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveDoc);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveDoc);
      document.documentElement.classList.remove("fx");
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden />;
}
