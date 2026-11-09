import "server-only";
import { database } from "./db";
import { decorateContent } from "./content";
import { HttpError } from "./http";
import type { CmsState, MediaOverride } from "@/lib/cms-shared";

export type ContentSnapshot = Pick<CmsState, "texts" | "images" | "pageMedia">;
export function snapshot(state: ContentSnapshot): ContentSnapshot { return { texts: state.texts, images: state.images, pageMedia: state.pageMedia || {} }; }
export async function readDraft(): Promise<CmsState> {
  const [row] = await database()`SELECT d.texts, d.images, d.page_media AS "pageMedia", d.version, d.updated_at,
    p.version AS published_version, d.published_version <> p.version AS outdated,
    (d.texts <> p.texts OR d.images <> p.images OR d.page_media <> p.page_media) AS changed
    FROM jp_content_draft d JOIN jp_content p ON p.id = d.id WHERE d.id = 1`;
  if (!row) throw new Error("Draft storage is not initialized");
  return draftState(row);
}
function draftState(row: Record<string, any>): CmsState {
  return decorateContent({ texts: row.texts, images: row.images, pageMedia: row.pageMedia ?? row.page_media, version: row.version,
    draft: { hasChanges: !!row.changed, publishedVersion: row.published_version, updatedAt: String(row.updated_at), outdated: !!row.outdated } });
}
const conflict = () => new HttpError(409, "İçerik başka bir pencerede değişti. Kaydetmediğiniz yazıyı kopyalayıp paneli yenileyin.");
export async function saveDraft(state: ContentSnapshot, version: number, label: string, upload?: { id: string; source: string; media: MediaOverride }) {
  const sql = database();
  const data = snapshot(state);
  // Updating the singleton draft is the compare-and-swap lock for every editor mutation.
  const [row] = await sql`WITH changed AS (
    UPDATE jp_content_draft d SET texts = ${JSON.stringify(data.texts)}::jsonb, images = ${JSON.stringify(data.images)}::jsonb,
      page_media = ${JSON.stringify(data.pageMedia)}::jsonb, version = d.version + 1, updated_at = now()
    WHERE d.id = 1 AND d.version = ${version} AND d.published_version = (SELECT version FROM jp_content WHERE id = 1)
    RETURNING d.*
  ), history AS (
    INSERT INTO jp_content_history (kind, label, snapshot, version)
    SELECT 'draft', ${label}, jsonb_build_object('texts', texts, 'images', images, 'pageMedia', page_media), version FROM changed
  ), media AS (
    INSERT INTO jp_media (id, source, data)
    SELECT ${upload?.id || null}::uuid, ${upload?.source || ""}, ${JSON.stringify(upload?.media || {})}::jsonb FROM changed WHERE ${!!upload}
  ), logged AS (
    INSERT INTO jp_admin_events (event) SELECT 'draft_saved' FROM changed
  ) SELECT c.*, (c.texts <> p.texts OR c.images <> p.images OR c.page_media <> p.page_media) AS changed
    FROM changed c JOIN jp_content p ON p.id = c.id`;
  if (!row) throw conflict();
  return draftState(row);
}
export async function listHistory() {
  return database()`SELECT id::text, kind, label, version, created_at AS "createdAt" FROM jp_content_history ORDER BY id DESC LIMIT 60`;
}
export async function restoreDraft(id: string, version: number) {
  const [row] = await database()`SELECT snapshot FROM jp_content_history WHERE id = ${id}::bigint`;
  if (!row) throw new HttpError(404, "Bu kayıt bulunamadı.");
  return saveDraft(row.snapshot, version, "Geçmiş kaydı taslağa yüklendi");
}
export async function discardDraft(version: number) {
  const [row] = await database()`WITH changed AS (
    UPDATE jp_content_draft d SET texts = p.texts, images = p.images, page_media = p.page_media,
      published_version = p.version, version = d.version + 1, updated_at = now()
    FROM jp_content p WHERE d.id = 1 AND p.id = d.id AND d.version = ${version}
    RETURNING d.*
  ), history AS (
    INSERT INTO jp_content_history (kind, label, snapshot, version)
    SELECT 'draft', 'Taslak kaldırıldı; yayındaki içerik geri alındı', jsonb_build_object('texts', texts, 'images', images, 'pageMedia', page_media), version FROM changed
  ), logged AS (INSERT INTO jp_admin_events (event) SELECT 'draft_discarded' FROM changed)
  SELECT * FROM changed`;
  if (!row) throw conflict();
  return draftState(row);
}
export async function publishDraft(version: number) {
  const [row] = await database()`WITH locked AS (
    SELECT d.*, p.version AS live_version FROM jp_content_draft d JOIN jp_content p ON p.id = d.id
    WHERE d.id = 1 AND d.version = ${version} AND d.published_version = p.version FOR UPDATE OF d, p
  ), published AS (
    UPDATE jp_content p SET texts = d.texts, images = d.images, page_media = d.page_media,
      version = p.version + 1, updated_at = now()
    FROM locked d WHERE p.id = d.id AND p.version = d.live_version RETURNING p.*
  ), synchronized AS (
    UPDATE jp_content_draft d SET published_version = p.version, version = d.version + 1, updated_at = now()
    FROM published p WHERE d.id = p.id RETURNING d.*
  ), history AS (
    INSERT INTO jp_content_history (kind, label, snapshot, version)
    SELECT 'published', 'Yayınlandı', jsonb_build_object('texts', texts, 'images', images, 'pageMedia', page_media), version FROM published
  ), logged AS (INSERT INTO jp_admin_events (event) SELECT 'content_published' FROM published)
  SELECT * FROM synchronized`;
  if (!row) throw conflict();
  return draftState(row);
}
