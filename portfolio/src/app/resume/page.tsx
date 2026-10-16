import Link from "next/link";
import { SITE, PROFILE, EXPERIENCE, EDUCATION, SKILLS, CERTS, PROJECTS, WINS, FINALS, RESUME_PDF } from "@/lib/content";

export const metadata = { title: "Résumé — Tanush Pavan V" };

export default function Page() {
  return (
    <main className="page">
      <div className="container cv">
        <div className="cv-head">
          <div>
            <h1>Tanush Pavan V</h1>
            <div className="cv-contact">
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <a href={SITE.github}>GitHub</a>
              <a href={SITE.linkedin}>LinkedIn</a>
              <span>Amrita EEE × IIT Madras DS · India</span>
            </div>
          </div>
          <div className="cv-dl">
            <a className="pdf" href={RESUME_PDF}>Download PDF ↓</a>
            <a className="ghost" href={SITE.resume}>View</a>
          </div>
        </div>

        <section className="cv-section">
          <h2>Profile</h2>
          <p className="cv-profile">{PROFILE}</p>
        </section>

        <section className="cv-section">
          <h2>Experience &amp; Research</h2>
          {EXPERIENCE.map((e) => (
            <div className="cv-item" key={e.role}>
              <div className="top">
                <div><span className="role">{e.role}</span><div className="org">{e.org} · {e.place}</div></div>
                <span className="when">{e.date}</span>
              </div>
              <p>{e.desc}</p>
              <span className="mi">{e.metric}</span>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Selected Projects</h2>
          {PROJECTS.slice(0, 4).map((p) => (
            <div className="cv-item" key={p.slug}>
              <div className="top">
                <div><span className="role">{p.title}</span>{p.tech && <div className="org">{p.tech}</div>}</div>
                <span className="when">{p.year}</span>
              </div>
              <p>{p.desc}</p>
              {p.metric && <span className="mi">{p.metric.big} · {p.metric.lbl}</span>}
            </div>
          ))}
          <Link href="/work" className="backlink" style={{ marginTop: 4 }}>See all work →</Link>
        </section>

        <section className="cv-section">
          <h2>Education</h2>
          {EDUCATION.map((e) => (
            <div className="cv-item" key={e.school}>
              <div className="top">
                <div><span className="role">{e.degree}</span><div className="org">{e.school}</div></div>
                <span className="when">{e.dates}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Skills</h2>
          {SKILLS.map((g) => (
            <div className="cv-skill" key={g.label}>
              <div className="lbl">{g.label}</div>
              <div className="items">{g.items.map((it) => <span key={it}>{it}</span>)}</div>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Recognition</h2>
          <div className="cv-two">
            {[...WINS, ...FINALS].map((w) => (
              <div className="cv-cert" key={w.title}>
                <strong style={{ color: w.kind === "win" ? "#bc7b3a" : w.kind === "run" ? "#c3cad6" : "#cfe0f7" }}>{w.result.replace("◆ ", "")}</strong>
                {" — "}{w.title} <span className="code">{w.org}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2>Certifications</h2>
          <div className="cv-two">
            {CERTS.map((c) => (
              <div className="cv-cert" key={c.name}>
                {c.name} <span className="code">{c.issuer}{c.code ? ` · ${c.code}` : ""}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 40 }}>
          <Link href="/" className="backlink">← Back home</Link>
        </div>
      </div>
    </main>
  );
}
