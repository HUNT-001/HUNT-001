import Link from "next/link";
import RLRollout from "@/components/RLRollout";

export const metadata = { title: "RL Rollout Visualiser — Lab — Tanush Pavan V" };

export default function Page() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="kick">Lab · live demo</div>
        <h1 className="h2" style={{ fontSize: "clamp(32px,6vw,48px)" }}>
          Imagination vs <span className="grad">reality.</span>
        </h1>
        <p className="lead">
          A model-based RL agent plans by dreaming trajectories inside a learned world model rather than acting in the
          real environment. The catch: the model is never perfect, and error compounds every imagined step. Step the
          rollout forward and watch the plan peel away from reality.
        </p>

        <RLRollout />

        <div style={{ marginTop: 40 }}>
          <Link href="/lab" className="backlink">← All demos</Link>
        </div>
      </div>
    </main>
  );
}
