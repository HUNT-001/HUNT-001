import Link from "next/link";
import DreamLog from "@/components/DreamLog";

export const metadata = { title: "The Dream Log — Lab — Tanush Pavan V" };

export default function Page() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="kick">Lab · live demo</div>
        <h1 className="h2" style={{ fontSize: "clamp(32px,6vw,48px)" }}>
          The <span className="grad">Dream Log.</span>
        </h1>
        <p className="lead">
          A world model that dreams about the person building it. Every night a GitHub Action reads what I actually
          pushed, compresses it into a small state vector, and performs one imagination rollout from that latent —
          then commits the result. Scrub the timeline below.
        </p>

        <DreamLog />

        <div style={{ marginTop: 40 }}>
          <Link href="/lab" className="backlink">← All demos</Link>
        </div>
      </div>
    </main>
  );
}
