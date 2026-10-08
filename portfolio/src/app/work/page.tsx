import Link from "next/link";
import { PROJECTS } from "@/lib/content";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Work — Tanush Pavan V" };

export default function Page() {
  return (
    <main className="page">
      <div className="container">
        <div className="kick">Selected work</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)" }}>
          Things I&apos;ve <span className="grad">actually built.</span>
        </h1>
        <p className="lead">
          Agentic verification, silicon accelerators, edge-AI deployment and a few things built under a clock.
          Each opens a short case study.
        </p>

        <div className="wr" style={{ marginTop: 40 }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link href={`/work/${p.slug}`} className="wrc">
                <div className="ty">{p.domain} · {p.year}</div>
                <h3>{p.title}</h3>
                <p>{p.desc.length > 130 ? p.desc.slice(0, 130) + "…" : p.desc}</p>
                {p.metric && <div className="dt" style={{ color: p.metric.color === "am" ? "#bc7b3a" : "#38bdf8" }}>{p.metric.big} · {p.metric.lbl}</div>}
              </Link>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 44 }}>
          <Link href="/" className="backlink">← Back home</Link>
        </div>
      </div>
    </main>
  );
}
