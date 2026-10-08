import Link from "next/link";
import type { ReactNode } from "react";

export default function PageShell({
  kick, title, grad, lead, soon = true, children,
}: { kick: string; title: string; grad?: string; lead?: string; soon?: boolean; children?: ReactNode }) {
  return (
    <main className="page">
      <div className="container">
        <div className="kick">{kick}</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)" }}>
          {title} {grad && <span className="grad">{grad}</span>}
        </h1>
        {lead && <p className="lead">{lead}</p>}
        {soon && <div className="soon">In progress</div>}
        {children}
        <div><Link href="/" className="backlink">← Back home</Link></div>
      </div>
    </main>
  );
}
