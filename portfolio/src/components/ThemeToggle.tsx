"use client";
import { useCallback } from "react";

type Theme = "dark" | "light";

/* Flips data-theme on <html>, remembers it, and — where the browser supports
   View Transitions — reveals the new theme as a circle growing from the button. */
export default function ThemeToggle() {
  const toggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch { /* private mode */ }
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f6f7f9" : "#05070d");
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

    if (!doc.startViewTransition || reduced) {
      root.classList.add("theme-fade");
      apply();
      window.setTimeout(() => root.classList.remove("theme-fade"), 500);
      return;
    }

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(apply);
    t.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  }, []);

  return (
    <button className="theme-btn" onClick={toggle} aria-label="Toggle light / dark theme" title="Toggle theme">
      <svg className="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      <svg className="sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
      </svg>
    </button>
  );
}
