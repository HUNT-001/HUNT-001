import Link from "next/link";
import { SKILLS, EDUCATION, CERTS } from "@/lib/content";
import Reveal from "@/components/Reveal";

export const metadata = { title: "About — Tanush Pavan V" };

export default function Page() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="kick">About</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)", marginBottom: 32 }}>
          The human <span className="grad">behind it.</span>
        </h1>

        <Reveal>
          <div className="about-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="portrait" src="/avatar-portrait.png" alt="Tanush Pavan" />
            <div>
              <p className="lead2">
                I&apos;m a dual-degree student building <b>efficient intelligent systems</b> at the seam of model and
                machine — <b>B.Tech EEE</b> at Amrita and <b>B.S. Data Science</b> at IIT Madras, deliberately both.
                One taught me to reason about data and uncertainty; the other taught me what actually happens when
                electrons have to carry the answer.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="about-philo">
            Efficiency is not an optimization pass you run at the end. It&apos;s a decision you make in the first
            hour, and <span className="grad">defend in every one after.</span>
          </p>
        </Reveal>

        <Reveal>
          <div className="about-grid">
            <div className="about-box">
              <h3>Above the line</h3>
              <p>World models, model-based RL, graph neural networks, agentic systems, and quantum-inspired ML — the
                algorithms that decide.</p>
            </div>
            <div className="about-box">
              <h3>Below the line</h3>
              <p>RTL design, functional verification, AI accelerators, quantized and edge inference — the silicon they
                decide on.</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="about-candid" src="/photo-candid.jpg" alt="Tanush Pavan" />
        </Reveal>

        <section style={{ marginTop: 44 }}>
          <Reveal>
            <div className="kick" style={{ marginBottom: 16 }}>Education</div>
            {EDUCATION.map((e) => (
              <div key={e.school} className="cv-item">
                <div className="top">
                  <div><span className="role">{e.degree}</span><div className="org">{e.school}</div></div>
                  <span className="when">{e.dates}</span>
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <section style={{ marginTop: 32 }}>
          <Reveal>
            <div className="kick" style={{ marginBottom: 16 }}>What I build with</div>
            {SKILLS.map((g) => (
              <div className="cv-skill" key={g.label}>
                <div className="lbl">{g.label}</div>
                <div className="items">{g.items.map((it) => <span key={it}>{it}</span>)}</div>
              </div>
            ))}
          </Reveal>
        </section>

        <section style={{ marginTop: 32 }}>
          <Reveal>
            <div className="kick" style={{ marginBottom: 16 }}>Certifications</div>
            <div className="cv-two">
              {CERTS.map((c) => (
                <div className="cv-cert" key={c.name}>{c.name} <span className="code">{c.issuer}{c.code ? ` · ${c.code}` : ""}</span></div>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 40 }}>
          <Link className="em" href="/resume">Résumé</Link>
          <Link className="gh" href="/contact">Get in touch</Link>
        </div>
        <div style={{ marginTop: 36 }}>
          <Link href="/" className="backlink">← Back home</Link>
        </div>
      </div>
    </main>
  );
}
