import Link from "next/link";
import { SITE } from "@/lib/content";
import QAWidget from "@/components/QAWidget";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Contact — Tanush Pavan V" };

const DISCUSSIONS = "https://github.com/HUNT-001/HUNT-001/discussions/categories/q-a";

export default function Page() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="kick">Contact</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)" }}>
          Ask me <span className="grad">anything.</span>
        </h1>
        <p className="lead">
          Open to AI systems, Edge AI and EDA roles — and interesting problems at the hardware/ML boundary.
          Ask the widget below, open a thread in public, or just email me.
        </p>

        <Reveal><QAWidget /></Reveal>

        <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 34 }}>
          <a className="em" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a className="gh" href={DISCUSSIONS}>Ask on GitHub Discussions →</a>
        </div>
        <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 12 }}>
          <a className="gh" href={SITE.github}>GitHub</a>
          <a className="gh" href={SITE.linkedin}>LinkedIn</a>
          <Link className="gh" href="/resume">Résumé</Link>
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href="/" className="backlink">← Back home</Link>
        </div>
      </div>
    </main>
  );
}
