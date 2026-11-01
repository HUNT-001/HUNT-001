import Link from "next/link";
import Roofline from "@/components/Roofline";

export const metadata = { title: "Quantization Explorer — Lab — Tanush Pavan V" };

export default function Page() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="kick">Lab · live demo</div>
        <h1 className="h2" style={{ fontSize: "clamp(32px,6vw,48px)" }}>
          The <span className="grad">roofline.</span>
        </h1>
        <p className="lead">
          Everyone quantizes models to &quot;make them smaller.&quot; The real reason is subtler: LLM decode is
          <b> memory-bound</b>, not compute-bound. Slide the precision, model size and bandwidth below and watch the
          operating point move along the roofline — and feel why fewer bits per weight buys throughput almost for free.
        </p>

        <Roofline />

        <div style={{ marginTop: 40 }}>
          <Link href="/lab" className="backlink">← All demos</Link>
        </div>
      </div>
    </main>
  );
}
