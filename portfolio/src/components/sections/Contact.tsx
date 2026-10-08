import { SITE } from "@/lib/content";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="glow" />
      <div className="container">
        <h2>Let&apos;s build something<br />at the <span className="grad">seam.</span></h2>
        <p className="cs">
          Open to AI systems, Edge AI and EDA roles — and interesting problems at the hardware/ML boundary.
        </p>
        <div className="clinks">
          <a className="em" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a className="gh" href={SITE.github}>GitHub</a>
          <a className="gh" href={SITE.linkedin}>LinkedIn</a>
          <a className="gh" href={SITE.resume}>Résumé ↓</a>
        </div>
        <div className="foot">© 2026 Tanush Pavan V · Based in India · Amrita EEE × IIT Madras DS</div>
      </div>
    </section>
  );
}
