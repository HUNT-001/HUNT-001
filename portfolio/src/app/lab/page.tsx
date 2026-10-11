import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Lab — Tanush Pavan V" };

const DEMOS = [
  { href: "/lab/dream-log", live: true, title: "The Dream Log", tag: "live",
    desc: "A world model that dreams. Scrub through nightly latent rollouts composed from real repo activity." },
  { href: "/lab", live: false, title: "Quantization Explorer", tag: "soon",
    desc: "Slide bit-width, model size and bandwidth and watch arithmetic intensity hit the roofline. Feel why models are memory-bound, not compute-bound." },
  { href: "/lab", live: false, title: "RL Rollout Visualiser", tag: "soon",
    desc: "Plan inside a learned latent — watch imagined trajectories diverge from reality step by step." },
];

export default function Page() {
  return (
    <main className="page">
      <div className="container">
        <div className="kick">Lab / Playground</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)" }}>
          Interactive <span className="grad">demos.</span>
        </h1>
        <p className="lead">
          Small working toys, not screenshots. The things a static portfolio can&apos;t do — built one at a time.
        </p>

        <div className="lab-grid">
          {DEMOS.map((demo, i) => (
            <Reveal key={demo.title} delay={i * 0.06}>
              <Link href={demo.href} className={`labcard${demo.live ? " live" : ""}`}>
                <span className={`badge ${demo.live ? "on" : "off"}`}>{demo.tag}</span>
                <h3>{demo.title}</h3>
                <p>{demo.desc}</p>
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
