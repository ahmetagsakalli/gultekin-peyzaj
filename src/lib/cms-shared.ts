export type MediaOverride = { url: string; alt: string; width: number; height: number; variants: { width: number; url: string }[] };
export type GalleryImage = MediaOverride & { id: string; href?: string };
export type BlogEntry = { id: string; slug: string; title: string; body: string; cover: MediaOverride; createdAt: string; updatedAt: string };
export type PageMedia = { blogPost?: BlogEntry; images?: Record<string, MediaOverride | null>; gallery?: GalleryImage[]; texts?: Record<string, string> };
export type CmsState = { texts: Record<string, string>; images: Record<string, MediaOverride>; pageMedia?: Record<string, PageMedia>; links?: Record<string, string>; pageLinks?: Record<string, Record<string, string>>; version: number; draft?: { hasChanges: boolean; publishedVersion: number; updatedAt: string; outdated: boolean } };
export const emptyCms: CmsState = { texts: {}, images: {}, version: 1 };
export function normalizePage(path: string) {
  if (path === "shared") return path;
  const segments = path.split("/").filter(Boolean);
  // Vercel's ISR regeneration can expose the home route as /index.
  if (!segments.length || (segments.length === 1 && segments[0] === "index")) return "/";
  return `/${segments.join("/")}/`;
}
export function resolveImage(state: CmsState, page: string, source: string) {
  const local = state.pageMedia?.[normalizePage(page)]?.images;
  return local && Object.hasOwn(local, source) ? local[source] : state.images[source];
}
export function normalizeText(value: string) { return value.replace(/\s+/g, " ").trim(); }
export function resolveText(state: CmsState, page: string, original: string) {
  const key = textKey(original);
  return state.pageMedia?.[normalizePage(page)]?.texts?.[key] ?? state.texts[key] ?? original;
}
export function textKey(value: string) {
  const text = normalizeText(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619) >>> 0;
  return `t${hash.toString(36)}_${text.length}`;
}
