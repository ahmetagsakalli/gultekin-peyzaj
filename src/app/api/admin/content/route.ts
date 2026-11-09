import { authorize } from "@/lib/admin/auth";
import { readDraft, saveDraft } from "@/lib/admin/drafts";
import registry from "@/lib/admin/cms-registry.json";
import { apiError, HttpError, json, readJson } from "@/lib/admin/http";
import { z } from "zod";
const schema = z.object({ document: z.string().min(1).optional(), version: z.number().int().positive(), changes: z.record(z.string(), z.string().trim().min(1).max(12000)) }).strict();
export async function GET() {
  try { await authorize(); return json({ state: await readDraft(), registry }); } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    await authorize(request, true);
    const parsed = schema.safeParse(await readJson(request, 350000));
    if (!parsed.success) throw new HttpError(422, "Metin alanlarını kontrol edin; alanlar boş bırakılamaz.");
    const originals: Record<string, string> = registry.texts;
    if (Object.keys(parsed.data.changes).some(key => !Object.hasOwn(originals, key))) throw new HttpError(400, "Geçersiz içerik alanı.");
    const page = parsed.data.document ? registry.documents.find(item => item.id === parsed.data.document) : undefined;
    if (parsed.data.document && (!page || Object.keys(parsed.data.changes).some(key => !page.fields.some(field => field.id === key)))) throw new HttpError(400, "Bu yazı seçili sayfaya ait değil.");
    for (const [key, value] of Object.entries(parsed.data.changes)) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(originals[key]) && !z.email().safeParse(value).success) throw new HttpError(422, "Geçerli bir e-posta adresi yazın.");
      if (/^\+?[\d ()-]{10,}$/.test(originals[key]) && !/^\+?[\d ()-]{10,}$/.test(value)) throw new HttpError(422, "Geçerli bir telefon numarası yazın.");
    }
    const current = await readDraft();
    if (current.version !== parsed.data.version) throw new HttpError(409, "İçerik başka bir pencerede değişti. Paneli yenileyin.");
    const next = { ...current, texts: { ...current.texts }, pageMedia: { ...current.pageMedia } };
    if (page && page.id !== "shared") {
      const media = next.pageMedia[page.id] || {};
      next.pageMedia[page.id] = { ...media, texts: { ...media.texts, ...parsed.data.changes } };
    } else {
      Object.assign(next.texts, parsed.data.changes);
      for (const [id, value] of Object.entries(parsed.data.changes)) if (value === originals[id]) delete next.texts[id];
    }
    return json({ state: await saveDraft(next, parsed.data.version, `${page?.title || "Ortak içerik"} · Yazı değişikliği`) });
  } catch (error) { return apiError(error); }
}
