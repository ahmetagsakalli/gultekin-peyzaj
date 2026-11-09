import { randomUUID } from "node:crypto";
import { z } from "zod";
import { authorize } from "@/lib/admin/auth";
import { readDraft, saveDraft } from "@/lib/admin/drafts";
import { blogInput, prepareBlog, withBlog } from "@/lib/admin/blog";
import { blogEntries } from "@/lib/blog-shared";
import { uploadImage } from "@/lib/admin/image-upload";
import { cleanupUncommittedMedia } from "@/lib/admin/media-cleanup";
import { apiError, HttpError, json, readJson } from "@/lib/admin/http";

export const runtime = "nodejs";
export const maxDuration = 60;
async function formData(request: Request) {
  const limit = 4_400_000;
  if (Number(request.headers.get("content-length")) > limit) throw new HttpError(413, "Görsel en fazla 4 MB olabilir.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Yazı bilgileri eksik.");
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > limit) { await reader.cancel(); throw new HttpError(413, "Görsel en fazla 4 MB olabilir."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return await new Response(Buffer.concat(chunks), { headers: { "content-type": request.headers.get("content-type") || "" } }).formData(); }
  catch { throw new HttpError(400, "Yazı bilgileri okunamadı."); }
}
async function save(request: Request, creating: boolean) {
  const uploaded: string[] = []; const uploadId = randomUUID(); let persisted = false;
  try {
    await authorize(request, true);
    const form = await formData(request);
    const parsed = blogInput.safeParse({ id: form.get("id"), version: Number(form.get("version")), title: form.get("title"), body: form.get("body") });
    if (!parsed.success) throw new HttpError(422, "Başlık 2–160, içerik 10–60.000 karakter olmalı.");
    const current = await readDraft();
    const prepared = prepareBlog(current, parsed.data, creating);
    const file = form.get("cover");
    const cover = file ? await uploadImage(file, parsed.data.title, uploadId, uploaded) : prepared.existing?.cover;
    if (!cover) throw new HttpError(422, "Bir kapak görseli seçin.");
    const next = withBlog(current, parsed.data, prepared, cover);
    const state = await saveDraft(next.state, current.version, `${next.entry.title} · ${creating ? "Yeni blog yazısı" : "Blog düzenlemesi"}`,
      uploaded.length ? { id: uploadId, source: `/blog/${next.entry.slug}/:cover`, media: cover } : undefined);
    persisted = true;
    return json({ state, entry: next.entry });
  } catch (error) {
    if (!persisted && uploaded.length) await cleanupUncommittedMedia(uploadId, uploaded);
    return apiError(error);
  }
}
export const POST = (request: Request) => save(request, true);
export const PATCH = (request: Request) => save(request, false);
export async function DELETE(request: Request) {
  try {
    await authorize(request, true);
    const parsed = z.object({ id: z.uuid(), version: z.number().int().positive() }).strict().safeParse(await readJson(request, 2048));
    if (!parsed.success) throw new HttpError(422, "Yazı bilgilerini kontrol edin.");
    const current = await readDraft();
    const entry = blogEntries(current).find(post => post.id === parsed.data.id);
    if (!entry) throw new HttpError(404, "Yazı bulunamadı.");
    const pageMedia = { ...current.pageMedia };
    delete pageMedia[`/blog/${entry.slug}/`];
    return json({ state: await saveDraft({ ...current, pageMedia }, parsed.data.version, `${entry.title} · Yazı taslaktan kaldırıldı`) });
  } catch (error) { return apiError(error); }
}
