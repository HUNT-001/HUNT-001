import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "blog");

export interface Post {
  slug: string;
  title: string;
  type: string;
  date: string;
  read: string;
  summary: string;
  tags: string[];
  repo?: string;
  body: string;
}

function read(slug: string): Post {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    type: data.type ?? "Post",
    date: data.date ?? "",
    read: data.read ?? "",
    summary: data.summary ?? "",
    tags: data.tags ?? [],
    repo: data.repo,
    body: content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => read(f.replace(/\.md$/, "")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  try {
    return read(slug);
  } catch {
    return undefined;
  }
}

export function prettyDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
