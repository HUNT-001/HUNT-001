import Link from "next/link";
import { getAllPosts, prettyDate } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export default function Writing() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <section className="section">
      <div className="dotgrid" />
      <div className="container">
        <Reveal>
          <div className="sechead">
            <div className="kick">Writing</div>
            <h2 className="h2">Dev-to-dev <span className="grad">write-ups.</span></h2>
          </div>
        </Reveal>
        <div className="wr">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link href={`/writing/${p.slug}`} className="wrc">
                <div className="ty">{p.type}</div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="dt">{prettyDate(p.date)} · {p.read}</div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link href="/writing" className="viewall">View all writing →</Link>
        </div>
      </div>
    </section>
  );
}
