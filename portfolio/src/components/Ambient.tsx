"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/*
 * Site-wide ambient layer, fixed behind every page:
 *   1. aurora   — three slow colour fields (pure CSS, GPU-composited), tinted per route
 *   2. network  — a canvas "neural mesh / circuit" of drifting nodes; edges light up near
 *                 the cursor and signal pulses travel along them
 *   3. grain + vignette — keeps gradients from banding and frames the content
 * Pauses when the tab is hidden; renders one still frame for reduced-motion users.
 */

type Theme = { a: string; b: string; c: string; node: [number, number, number] };
const THEMES: Record<string, Theme> = {
  home:    { a: "#38bdf8", b: "#a78bfa", c: "#bc7b3a", node: [120, 190, 255] },
  work:    { a: "#38bdf8", b: "#22d3ee", c: "#a78bfa", node: [110, 200, 255] },
  lab:     { a: "#a78bfa", b: "#c084fc", c: "#38bdf8", node: [190, 160, 255] },
  wins:    { a: "#bc7b3a", b: "#38bdf8", c: "#c3cad6", node: [230, 180, 130] },
  writing: { a: "#60a5fa", b: "#a78bfa", c: "#22d3ee", node: [150, 180, 255] },
  about:   { a: "#bc7b3a", b: "#a78bfa", c: "#38bdf8", node: [210, 175, 150] },
  contact: { a: "#a78bfa", b: "#bc7b3a", c: "#38bdf8", node: [190, 160, 255] },
};
function themeFor(path: string): Theme {
  const seg = path.split("/")[1] || "home";
  if (seg === "resume" || seg === "uses" || seg === "now") return THEMES.about;
  return THEMES[seg] ?? THEMES.home;
}

interface Node { x: number; y: number; vx: number; vy: number; r: number; }
interface Pulse { a: number; b: number; t: number; speed: number; }

export default function Ambient() {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef<[number, number, number]>([...THEMES.home.node]);
  const targetRef = useRef<[number, number, number]>(THEMES.home.node);

  // route → palette (CSS vars animate via @property; node colour lerps in the loop)
  useEffect(() => {
    const t = themeFor(pathname);
    const el = wrapRef.current;
    if (el) {
      el.style.setProperty("--au-a", t.a);
      el.style.setProperty("--au-b", t.b);
      el.style.setProperty("--au-c", t.c);
    }
    targetRef.current = t.node;
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let w = 0, h = 0, dpr = 1;
    let nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0, running = true, last = performance.now();

    const LINK = 150, LINK2 = LINK * LINK, BUCKETS = 10;
    const buckets: number[][] = Array.from({ length: BUCKETS }, () => []);
    const sprite = document.createElement("canvas"); sprite.width = sprite.height = 40;
    let spriteKey = "";
    const paintSprite = (r: number, g: number, b: number) => {
      const sc = sprite.getContext("2d"); if (!sc) return;
      sc.clearRect(0, 0, 40, 40);
      const gr = sc.createRadialGradient(20, 20, 0, 20, 20, 20);
      gr.addColorStop(0, `rgba(${r},${g},${b},.95)`); gr.addColorStop(.35, `rgba(${r},${g},${b},.35)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      sc.fillStyle = gr; sc.fillRect(0, 0, 40, 40);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(90, Math.max(28, (w * h) / 17000)));
      if (nodes.length > target) nodes = nodes.slice(0, target);
      while (nodes.length < target) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.3 + 0.6,
        });
      }
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const onLeave = () => { mouse.active = false; mouse.x = mouse.y = -9999; };

    const frame = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67; last = now;

      // ease node colour toward the route's palette
      const c = colorRef.current, tg = targetRef.current;
      for (let i = 0; i < 3; i++) c[i] += (tg[i] - c[i]) * 0.04;
      // light theme: deepen the mesh so it reads on paper instead of glowing on ink
      const light = document.documentElement.dataset.theme === "light";
      const k = light ? 0.42 : 1, boost = light ? 1.5 : 1;
      const R = Math.round(c[0] * k), G = Math.round(c[1] * k), B = Math.round(c[2] * k);

      ctx.clearRect(0, 0, w, h);

      // move
      for (const n of nodes) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (mouse.active) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d2 = dx * dx + dy * dy;
          if (d2 < 220 * 220 && d2 > 1) { const f = 0.012 / Math.sqrt(d2); n.vx += dx * f * 0.02; n.vy += dy * f * 0.02; }
        }
        n.vx *= 0.995; n.vy *= 0.995;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp < 0.05) { n.vx += (Math.random() - 0.5) * 0.02; n.vy += (Math.random() - 0.5) * 0.02; }
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }

      // edges — bucketed by alpha so the whole mesh is ~10 stroke calls instead of hundreds
      ctx.lineWidth = 1;
      for (let q = 0; q < BUCKETS; q++) buckets[q].length = 0;
      const amax = 0.48 * boost;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          const d = Math.sqrt(d2);
          let alpha = (1 - d / LINK) * 0.16 * boost;
          if (mouse.active) {
            const mx = (a.x + b.x) / 2 - mouse.x, my = (a.y + b.y) / 2 - mouse.y;
            const md2 = mx * mx + my * my;
            if (md2 < 40000) alpha += (1 - Math.sqrt(md2) / 200) * 0.32;
          }
          const q = Math.min(BUCKETS - 1, Math.floor((alpha / amax) * BUCKETS));
          buckets[q].push(a.x, a.y, b.x, b.y);
          if (!reduced && pulses.length < 7 && Math.random() < 0.00018 * dt) pulses.push({ a: i, b: j, t: 0, speed: 0.012 + Math.random() * 0.012 });
        }
      }
      for (let q = 0; q < BUCKETS; q++) {
        const L = buckets[q]; if (!L.length) continue;
        ctx.strokeStyle = `rgba(${R},${G},${B},${(((q + 0.5) / BUCKETS) * amax).toFixed(3)})`;
        ctx.beginPath();
        for (let k = 0; k < L.length; k += 4) { ctx.moveTo(L[k], L[k + 1]); ctx.lineTo(L[k + 2], L[k + 3]); }
        ctx.stroke();
      }

      // pulses — one pre-rendered glow sprite, tinted once per colour change
      if (pulses.length) {
        if (spriteKey !== `${R},${G},${B}`) { spriteKey = `${R},${G},${B}`; paintSprite(R, G, B); }
        for (let k = pulses.length - 1; k >= 0; k--) {
          const p = pulses[k];
          p.t += p.speed * dt;
          const a = nodes[p.a], b = nodes[p.b];
          if (!a || !b || p.t >= 1 || Math.hypot(a.x - b.x, a.y - b.y) > LINK * 1.05) { pulses.splice(k, 1); continue; }
          ctx.drawImage(sprite, a.x + (b.x - a.x) * p.t - 10, a.y + (b.y - a.y) * p.t - 10, 20, 20);
        }
      }

      // nodes — two passes: resting nodes in one path, cursor-lit nodes individually
      const base = 0.45 * (light ? 1.3 : 1);
      ctx.fillStyle = `rgba(${R},${G},${B},${base.toFixed(3)})`;
      ctx.beginPath();
      for (const n of nodes) { ctx.moveTo(n.x + n.r, n.y); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); }
      ctx.fill();
      if (mouse.active) {
        for (const n of nodes) {
          const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (md >= 180) continue;
          ctx.fillStyle = `rgba(${R},${G},${B},${((1 - md / 180) * 0.5).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 0.6, 0, Math.PI * 2); ctx.fill();
        }
      }

      if (running && !reduced) raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduced) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    };

    resize();
    window.addEventListener("resize", resize);
    if (fine) { window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave); }
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="ambient" ref={wrapRef} aria-hidden>
      <div className="aurora">
        <i className="au au1" /><i className="au au2" /><i className="au au3" />
      </div>
      <canvas ref={canvasRef} className="mesh" />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
