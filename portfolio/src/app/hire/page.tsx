import Link from "next/link";
import FitCheck from "@/components/FitCheck";
import Reveal from "@/components/Reveal";
import { RESUME_PDF, SITE } from "@/lib/content";

export const metadata = {
  title: "Hire — Tanush Pavan V",
  description: "The 30-second version for recruiters: roles, headline results, résumé — plus an AI job-fit check.",
};

const NUMBERS = [
  { n: "374.5 GOP/s", l: "patent-pending BNN accelerator · 92.8 GOP/s/W", c: "cy", href: "/work/bnn-accelerator" },
  { n: "sub-100 ms", l: "INT8 ViT on AMD Versal · ADRIN / ISRO", c: "am", href: "/resume" },
  { n: "12 agents", l: "agentic RISC-V verification platform", c: "vi", href: "/work/agentic-riscv-verification" },
];

const FACTS = [
  ["Looking for", "AI systems · Edge AI · EDA / verification roles"],
  ["Education", "B.Tech EEE (Amrita) + B.S. Data Science (IIT Madras) · 2024 – 2028"],
  ["Based in", "India · open to remote"],
  ["Recognition", "2 hackathon wins · 1 runner-up · 3 national finals"],
];

export default function Page() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 940 }}>
        <div className="kick">For recruiters</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)" }}>
          The <span className="grad">30-second version.</span>
        </h1>
        <p className="lead">
          I build at the seam of model and machine — RTL and verification on one side, edge AI and agents on the
          other. Here&apos;s what matters, and a tool to check me against your role.
        </p>

        <Reveal>
          <div className="hire-nums">
            {NUMBERS.map((x) => (
              <Link key={x.n} href={x.href} className={`hire-num ${x.c}`}>
                <div className="n">{x.n}</div>
                <div className="l">{x.l}</div>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <dl className="hire-facts">
            {FACTS.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </Reveal>

        <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="em" href={RESUME_PDF}>Download résumé (PDF)</a>
          <a className="gh" href={`mailto:${SITE.email}?subject=Opportunity%20for%20Tanush`}>Email me</a>
          <a className="gh" href={SITE.linkedin}>LinkedIn</a>
        </div>

        <Reveal><FitCheck /></Reveal>

        <div style={{ marginTop: 40 }}>
          <Link href="/" className="backlink">← Back home</Link>
        </div>
      </div>
    </main>
  );
}
