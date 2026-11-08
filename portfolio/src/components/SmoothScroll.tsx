"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Inertial scrolling tuned to feel weighted but never laggy. Native scrolling is kept for
// touch (it's already smooth there), nested scrollers (chat, textareas) scroll on their own,
// and in-page #anchor links glide with an offset for the fixed nav.
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      syncTouch: false,
      allowNestedScroll: true,
      anchors: { offset: -88 },
      prevent: (node: HTMLElement) => !!node.closest?.(".qa-stream, textarea, [data-lenis-prevent]"),
    });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
