import PageShell from "@/components/PageShell";
import { WINS, FINALS } from "@/lib/content";
export const metadata = { title: "Recognition — Tanush Pavan V" };
export default function Page() {
  return (
    <PageShell kick="Recognition" title="Two wins," grad="three national finals." soon={false}
      lead="Shipped under a clock, judged by people who build for a living.">
      <div className="wr" style={{ marginTop: 28 }}>
        {[...WINS, ...FINALS].map((w) => (
          <div key={w.title} className="wrc">
            <div className="ty">{w.result.replace("◆ ", "")}</div>
            <h3>{w.title}</h3>
            <p>{w.org}</p>
            <div className="dt">{w.tech}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
