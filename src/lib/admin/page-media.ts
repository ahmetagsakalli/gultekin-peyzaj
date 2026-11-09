import type { CmsRegistry } from "./types";
import type { CmsState, GalleryImage, MediaOverride, PageMedia } from "../cms-shared";
import { pageGallery } from "../page-galleries";
import { HttpError } from "./http";

export type MediaTarget = { document: string; target: "slot" | "gallery"; source: string; version: number };
export function validateMediaTarget(input: Record<string, unknown>, state: CmsState, registry: CmsRegistry, adding = false): MediaTarget {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new HttpError(400, "Geçersiz görsel isteği.");
  const { document, target, version } = input;
  const source = typeof input.source === "string" ? input.source : "";
  const page = registry.documents.find(page => page.id === document);
  if (!page || (target !== "slot" && target !== "gallery") || !Number.isInteger(version) || Number(version) < 1 || source.length > 500)
    throw new HttpError(400, "Geçersiz sayfa veya görsel alanı.");
  if (state.version !== version) throw new HttpError(409, "Sayfa başka bir pencerede değişti. Sayfayı yeniden açıp tekrar deneyin.");
  if (target === "slot" && !page.images.includes(source)) throw new HttpError(400, "Bu görsel seçili sayfaya ait değil.");
  if (target === "gallery") {
    if (document === "shared") throw new HttpError(400, "Bu alana galeri eklenemez.");
    const gallery = pageGallery(state, page.id);
    if (source ? !gallery.some(item => item.id === source) : !adding) throw new HttpError(400, "Galeri görseli bulunamadı.");
    if (!source && gallery.length >= 30) throw new HttpError(422, "Bir sayfaya en fazla 30 galeri görseli eklenebilir.");
  }
  return { document: page.id, target, source, version: Number(version) };
}
export function updatePageMedia(state: CmsState, request: MediaTarget, action: "save" | "remove" | "reset" | "left" | "right", media?: MediaOverride, id?: string): PageMedia {
  const current = state.pageMedia?.[request.document] || {};
  if (request.target === "slot") {
    const images = { ...current.images };
    if (action === "save" && media) images[request.source] = media;
    else if (action === "remove") images[request.source] = null;
    else if (action === "reset") delete images[request.source];
    else throw new HttpError(400, "Geçersiz görsel işlemi.");
    return { ...current, images };
  }
  const gallery: GalleryImage[] = [...pageGallery(state, request.document)];
  const index = gallery.findIndex(item => item.id === request.source);
  if (action === "save" && media) {
    if (index >= 0) gallery[index] = { ...gallery[index], ...media };
    else if (id) gallery.push({ ...media, id });
    else throw new HttpError(400, "Görsel kimliği eksik.");
  } else if (action === "remove" && index >= 0) gallery.splice(index, 1);
  else if ((action === "left" || action === "right") && index >= 0) {
    const to = index + (action === "left" ? -1 : 1);
    if (to < 0 || to >= gallery.length) throw new HttpError(400, "Görsel bu yönde taşınamaz.");
    [gallery[index], gallery[to]] = [gallery[to], gallery[index]];
  } else throw new HttpError(400, "Geçersiz galeri işlemi.");
  return { ...current, gallery };
}
