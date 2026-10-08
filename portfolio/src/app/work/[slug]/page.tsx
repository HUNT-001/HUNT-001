import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/content";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = PROJECTS.find((x) => x.slug === params.slug);
  return { title: p ? `${p.title} — Tanush Pavan V` : "Work" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = PROJECTS.find((x) => x.slug === params.slug);
  if (!p) return notFound();

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="kick">{p.idx} · {p.year}</div>
        <h1 className="h2" style={{ fontSize: "clamp(32px,6vw,50px)" }}>{p.title}</h1>

        <div className="tags" style={{ marginTop: 16 }}>
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>

        {p.metric && (
          <div style={{ marginTop: 22 }}>
            <span className="metric" style={{ color: p.metric.color === "am" ? "#bc7b3a" : "#38bdf8", fontSize: 32 }}>{p.metric.big}</span>
            <div className="metriclbl">{p.metric.lbl}</div>
          </div>
        )}

        {p.tech && <p className="co" style={{ marginTop: 20 }}>{p.tech}</p>}

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 28 }}>
          {(p.study ?? [{ h: "Overview", p: p.desc }]).map((s) => (
            <Reveal key={s.h}>
              <div>
                <h2 style={{ fontSize: 15, fontFamily: "var(--font-mono)", letterSpacing: ".06em", textTransform: "uppercase", color: "#7f98bd", margin: "0 0 8px" }}>{s.h}</h2>
                <p className="tp" style={{ fontSize: 16, maxWidth: "none", marginTop: 0 }}>{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 40 }}>
          {p.repo
            ? <a className="em" href={p.repo}>View on GitHub →</a>
            : <span className="soon">Code private / patent-pending</span>}
          <Link className="gh" href="/work">All work</Link>
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href="/" className="backlink">← Back home</Link>
        </div>
      </div>
    </main>
  );
}
