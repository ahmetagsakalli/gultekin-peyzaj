import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { database } from "./db";
import registry from "./cms-registry.json";
import type { CmsState } from "@/lib/cms-shared";
export async function readContent(): Promise<CmsState> {
  const rows = await database()`SELECT texts, images, page_media, version FROM jp_content WHERE id = 1`;
  if (!rows[0]) throw new Error("CMS has not been initialized");
  return decorateContent({ texts: rows[0].texts, images: rows[0].images, pageMedia: rows[0].page_media, version: rows[0].version });
}
export function decorateContent(row: CmsState): CmsState {
  function contactLinks(texts: Record<string, string>) {
  const links: Record<string, string> = {};
  const originals: Record<string, string> = registry.texts;
  for (const [key, value] of Object.entries(texts)) {
    const original = originals[key] || "";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(original)) links[`mailto:${original}`] = `mailto:${value}`;
    if (/^\+?[\d ()-]{10,}$/.test(original)) {
      const normalizePhone = (text: string) => { const digits = text.replace(/\D/g, ""); return `+${digits.startsWith("0") ? `9${digits}` : digits.length === 10 ? `90${digits}` : digits}`; };
      const from = normalizePhone(original), to = normalizePhone(value);
      links[`tel:${from}`] = `tel:${to}`;
      links[`https://wa.me/${from.replace("+", "")}`] = `https://wa.me/${to.replace("+", "")}`;
    }
  }
  return links;
  }
  const links = contactLinks(row.texts);
  const pageLinks = Object.fromEntries(Object.entries(row.pageMedia || {}).map(([page, media]) => [page, contactLinks(media.texts || {})]));
  return { ...row, pageLinks, texts: row.texts, images: row.images, pageMedia: row.pageMedia, links, version: row.version };
}
// Build caches may survive a database/environment switch. Keep snapshots isolated.
const databaseCacheKey = createHash("sha256").update(process.env.DATABASE_URL || "unconfigured").digest("hex");
export const publicContent = unstable_cache(readContent, ["junior-panel-content-v2", databaseCacheKey], { tags: ["junior-panel-content"], revalidate: 300 });
