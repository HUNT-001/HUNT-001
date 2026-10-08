import Link from "next/link";
import { FEATURED } from "@/lib/content";
import Reveal from "@/components/Reveal";

const NODE_MOTIF = (
  <svg className="motif" viewBox="0 0 440 400"><g fill="none" stroke="#38bdf8" strokeWidth="1">
    <circle cx="220" cy="200" r="30" />
    <circle cx="110" cy="110" r="10" /><circle cx="330" cy="110" r="10" /><circle cx="110" cy="290" r="10" /><circle cx="330" cy="290" r="10" />
    <circle cx="70" cy="200" r="10" /><circle cx="370" cy="200" r="10" /><circle cx="220" cy="70" r="10" /><circle cx="220" cy="330" r="10" />
    <line x1="220" y1="200" x2="110" y2="110" /><line x1="220" y1="200" x2="330" y2="110" /><line x1="220" y1="200" x2="110" y2="290" /><line x1="220" y1="200" x2="330" y2="290" />
    <line x1="220" y1="200" x2="70" y2="200" /><line x1="220" y1="200" x2="370" y2="200" /><line x1="220" y1="200" x2="220" y2="70" /><line x1="220" y1="200" x2="220" y2="330" />
  </g></svg>
);
const GRID_MOTIF = (
  <svg className="motif" viewBox="0 0 400 200"><g fill="none" stroke="#38bdf8" strokeWidth="1">
    <path d="M40 40 H360 M40 80 H360 M40 120 H360 M40 160 H360 M40 40 V160 M120 40 V160 M200 40 V160 M280 40 V160 M360 40 V160" /></g></svg>
);
const CURVE_MOTIF = (
  <svg className="motif" viewBox="0 0 400 200"><g fill="none" stroke="#a78bfa" strokeWidth="1.2">
    <path d="M20 170 C 80 60, 140 60, 200 120 S 320 180, 380 40" /><path d="M20 180 C 90 120, 160 140, 230 90 S 340 60, 380 110" opacity=".5" /></g></svg>
);

export default function Featured() {
  const lead = FEATURED.find((p) => p.lead)!;
  const rest = FEATURED.filter((p) => !p.lead);
  return (
    <section className="section featured" style={{ background: "#060a14" }}>
      <div className="dotgrid" />
      <div className="container">
        <Reveal>
          <div className="sechead">
            <div className="kick">Selected work</div>
            <h2 className="h2">Things I&apos;ve <span className="grad">actually built.</span></h2>
          </div>
        </Reveal>

        <Reveal>
          <Link href={`/work/${lead.slug}`} className="card lead" style={{ color: "inherit" }}>
            <div className="pad">
              <div className="idx">{lead.idx}</div>
              <h3>{lead.title}</h3>
              <div className="tags">{lead.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <p>{lead.desc}</p>
              <span className="link">View case study →</span>
            </div>
            <div className="panel">
              {NODE_MOTIF}
              <div className="metric am">{lead.metric!.big}</div>
              <div className="metriclbl">{lead.metric!.lbl}</div>
              <div className="metric cy" style={{ marginTop: 22, fontSize: 20 }}>
                the green result<br />that means nothing — solved
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="cardrow">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link href={`/work/${p.slug}`} className="card sm" style={{ color: "inherit", display: "grid" }}>
                <div className="pad">
                  <div className="idx">{p.idx}</div>
                  <h3>{p.title}</h3>
                  <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <p>{p.desc}</p>
                  <span className="link">View case study →</span>
                </div>
                <div className="panel">
                  {p.slug === "bnn-accelerator" ? GRID_MOTIF : CURVE_MOTIF}
                  <div className={`metric ${p.metric!.color}`}>{p.metric!.big}</div>
                  <div className="metriclbl">{p.metric!.lbl}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
