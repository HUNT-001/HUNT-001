import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPost, prettyDate } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  return { title: p ? `${p.title} — Tanush Pavan V` : "Writing" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) return notFound();

  return (
    <main className="page">
      <article className="container" style={{ maxWidth: 740 }}>
        <div className="kick">{p.type} · {prettyDate(p.date)} · {p.read}</div>
        <h1 className="h2" style={{ fontSize: "clamp(30px,5.5vw,46px)" }}>{p.title}</h1>
        <div className="post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.body}</ReactMarkdown>
        </div>
        {p.repo && (
          <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 32 }}>
            <a className="em" href={p.repo}>View on GitHub →</a>
          </div>
        )}
        <div style={{ marginTop: 40 }}>
          <Link href="/writing" className="backlink">← All writing</Link>
        </div>
      </article>
    </main>
  );
}
