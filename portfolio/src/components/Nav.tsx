"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar-portrait.png" alt="Tanush Pavan" />
          <span>
            {SITE.name}
            <small>Silicon · AI · the seam</small>
          </span>
        </Link>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((v) => !v)}>≡</button>
        <div className={`nav-links${open ? " open" : ""}`}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
          <Link href="/resume" className="resume" onClick={() => setOpen(false)}>Résumé</Link>
        </div>
      </div>
    </nav>
  );
}
