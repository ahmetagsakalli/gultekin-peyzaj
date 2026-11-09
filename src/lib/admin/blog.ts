import { z } from "zod";
import { blogEntries } from "@/lib/blog-shared";
import type { BlogEntry, CmsState, MediaOverride } from "@/lib/cms-shared";
import { postIndex } from "@/lib/post-index";
import legacyRoutes from "@/lib/legacy-routes.json";
import { HttpError } from "./http";

export const blogInput = z.object({
  id: z.uuid(), version: z.number().int().positive(),
  title: z.string().trim().min(2).max(160),
  body: z.string().trim().min(10).max(60000),
}).strict();
export function blogSlug(title: string) {
  return title.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100).replace(/-$/g, "") || "yazi";
}
export function prepareBlog(state: CmsState, input: z.infer<typeof blogInput>, creating: boolean) {
  if (state.version !== input.version) throw new HttpError(409, "İçerik başka bir pencerede değişti. Yazınızı kopyalayıp paneli yenileyin.");
  const entries = blogEntries(state);
  const existing = entries.find(post => post.id === input.id);
  if (creating && existing) throw new HttpError(409, "Bu yazı daha önce kaydedilmiş. Sayfalar listesinden açabilirsiniz.");
  if (!creating && !existing) throw new HttpError(404, "Yazı bulunamadı. Sayfalar listesini yeniden açın.");
  if (existing) return { existing, slug: existing.slug };
  const root = blogSlug(input.title);
  const used = new Set([...postIndex.map(p => p.slug), ...entries.map(p => p.slug)]);
  let slug = root, suffix = 2;
  while (used.has(slug) || Object.hasOwn(legacyRoutes, `/blog/${slug}/`) || Object.hasOwn(state.pageMedia || {}, `/blog/${slug}/`)) slug = `${root}-${suffix++}`;
  return { existing, slug };
}
export function withBlog(state: CmsState, input: z.infer<typeof blogInput>, prepared: ReturnType<typeof prepareBlog>, cover: MediaOverride, now = new Date().toISOString()) {
  const entry: BlogEntry = { id: input.id, slug: prepared.slug, title: input.title, body: input.body,
    cover: { ...cover, alt: input.title }, createdAt: prepared.existing?.createdAt || now, updatedAt: now };
  const path = `/blog/${entry.slug}/`;
  return { state: { ...state, pageMedia: { ...state.pageMedia, [path]: { ...state.pageMedia?.[path], blogPost: entry } } }, entry };
}
