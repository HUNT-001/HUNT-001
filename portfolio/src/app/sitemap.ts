import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";
import { getAllPosts } from "@/lib/posts";

const BASE = "https://tanushpavan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "", "/work", "/writing", "/lab", "/lab/dream-log", "/about",
    "/contact", "/resume", "/uses", "/now", "/wins",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const work = PROJECTS.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const writing = getAllPosts().map((p) => ({
    url: `${BASE}/writing/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...work, ...writing];
}
