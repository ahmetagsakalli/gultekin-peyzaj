import type { BlogEntry, CmsState } from "./cms-shared";
import type { Post } from "./posts";

export function blogEntries(state: CmsState): BlogEntry[] {
  return Object.entries(state.pageMedia || {}).flatMap(([path, page]) =>
    page.blogPost && path === `/blog/${page.blogPost.slug}/` ? [page.blogPost] : []
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function blogSummary(body: string) {
  const text = body.replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}
export function blogPost(entry: BlogEntry): Post {
  return { slug: entry.slug, title: entry.title, body: entry.body, sections: [], sources: [],
    readTime: Math.max(1, Math.ceil(entry.body.trim().split(/\s+/).length / 200)), image: entry.cover.url, alt: entry.cover.alt, cover: entry.cover, description: blogSummary(entry.body), intro: "",
    datePublished: entry.createdAt, dateModified: entry.updatedAt };
}
