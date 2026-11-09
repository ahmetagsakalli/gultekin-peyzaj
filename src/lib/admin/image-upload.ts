import "server-only";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { HttpError } from "./http";
import type { MediaOverride } from "@/lib/cms-shared";

export async function uploadImage(file: unknown, alt: string, id: string, uploaded: string[]): Promise<MediaOverride> {
    if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 4_000_000 || file.size < 1) throw new HttpError(422, "JPG, PNG, WebP veya AVIF biçiminde, en fazla 4 MB bir görsel seçin.");
    const bytes = Buffer.from(await file.arrayBuffer());
    let metadata;
    try { metadata = await sharp(bytes, { limitInputPixels: 40_000_000 }).metadata(); } catch { throw new HttpError(422, "Görsel okunamadı. Başka bir dosya seçin."); }
    if (!metadata.width || !metadata.height || !["jpeg", "png", "webp", "avif", "heif"].includes(metadata.format || "") || (metadata.pages || 1) > 1) throw new HttpError(422, "Tek kare bir fotoğraf seçin.");
    const variants: MediaOverride["variants"] = [];
    let dimensions = { width: 0, height: 0 };
    for (const width of [480, 960, 1600, 2400]) {
      const output = await sharp(bytes, { limitInputPixels: 40_000_000 }).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
      if (variants.some(variant => variant.width === output.info.width)) break;
      const blob = await put(`junior-panel/${id}/${width}.webp`, output.data, { access: "public", contentType: "image/webp", addRandomSuffix: false, cacheControlMaxAge: 31536000 });
      uploaded.push(blob.url);
      variants.push({ width: output.info.width, url: blob.url });
      dimensions = { width: output.info.width, height: output.info.height };
      if (output.info.width < width) break;
    }
    return { url: uploaded[uploaded.length - 1], alt, ...dimensions, variants };
}
