import Link from "next/link";
import { getAllPosts, prettyDate } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Writing — Tanush Pavan V" };

export default function Page() {
  const posts = getAllPosts();
  return (
    <main className="page">
      <div className="container">
        <div className="kick">Writing</div>
        <h1 className="h2" style={{ fontSize: "clamp(34px,6vw,52px)" }}>
          Dev-to-dev <span className="grad">write-ups.</span>
        </h1>
        <p className="lead">Case studies, project write-ups, technical blogs and data stories.</p>

        <div className="wr" style={{ marginTop: 40 }}>
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link href={`/writing/${p.slug}`} className="wrc">
                <div className="ty">{p.type}</div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="dt">{prettyDate(p.date)} · {p.read}</div>
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
