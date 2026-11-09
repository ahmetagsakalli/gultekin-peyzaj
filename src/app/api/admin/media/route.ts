import { randomUUID } from "node:crypto";
import { uploadImage } from "@/lib/admin/image-upload";
import { cleanupUncommittedMedia } from "@/lib/admin/media-cleanup";
import { authorize } from "@/lib/admin/auth";
import { readDraft, saveDraft } from "@/lib/admin/drafts";
import { apiError, HttpError, json, readJson } from "@/lib/admin/http";
import { validateMediaTarget, updatePageMedia, type MediaTarget } from "@/lib/admin/page-media";
import type { CmsState, MediaOverride, PageMedia } from "@/lib/cms-shared";
import registry from "@/lib/admin/cms-registry.json";
export const runtime = "nodejs";
export const maxDuration = 60;
async function persist(state: CmsState, target: MediaTarget, page: PageMedia, upload?: { id: string; media: MediaOverride }) {
  const title = registry.documents.find(item => item.id === target.document)?.title || "Sayfa";
  return saveDraft({ ...state, pageMedia: { ...state.pageMedia, [target.document]: page } }, target.version,
    `${title} · Görsel değişikliği`, upload && { ...upload, source: target.document + ':' + (target.source || upload.id) });
}
export async function POST(request: Request) {
  const uploaded: string[] = [];
  let persisted = false;
  let uploadId: string | undefined;
  try {
    await authorize(request, true);
    if (Number(request.headers.get("content-length")) > 4_400_000) throw new HttpError(413, "En fazla 4 MB büyüklüğünde bir görsel seçin.");
    const form = await request.formData();
    const state = await readDraft();
    const target = validateMediaTarget({ document: form.get("document"), target: form.get("target"), source: form.get("source"), version: Number(form.get("version")) }, state, registry, true);
    const file = form.get("file");
    const alt = String(form.get("alt") || "").trim();
    if (!alt || alt.length > 250) throw new HttpError(422, "Görsel için en fazla 250 karakterlik bir isim yazın.");
    const id = randomUUID(); uploadId = id;
    const media = await uploadImage(file, alt, id, uploaded);
    const result = await persist(state, target, updatePageMedia(state, target, "save", media, id), { id, media });
    persisted = true;
    return json({ state: result });
  } catch (error) {
    if (!persisted && uploaded.length && uploadId) await cleanupUncommittedMedia(uploadId, uploaded);
    return apiError(error);
  }
}
async function change(request: Request, removing: boolean) {
  try {
    await authorize(request, true);
    const input = await readJson(request, 2048);
    const state = await readDraft();
    const target = validateMediaTarget(input, state, registry);
    const action = removing ? "remove" : input.action;
    if (!["remove", "reset", "left", "right"].includes(action)) throw new HttpError(400, "Geçersiz işlem.");
    const result = await persist(state, target, updatePageMedia(state, target, action));
    return json({ state: result });
  } catch (error) { return apiError(error); }
}
export const DELETE = (request: Request) => change(request, true);
export const PATCH = (request: Request) => change(request, false);
