// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
import sharp from "sharp";
const put = vi.hoisted(() => vi.fn());
vi.mock("server-only", () => ({}));
vi.mock("@vercel/blob", () => ({ put }));
import { uploadImage } from "../../src/lib/admin/image-upload";
beforeEach(() => { put.mockReset(); put.mockImplementation(async path => ({ url: `https://example.test/${path}` })); });
it("creates valid WebP covers without duplicate srcset widths or enlarging small images", async () => {
  const bytes = await sharp({ create: { width: 480, height: 320, channels: 3, background: "orange" } }).png().toBuffer();
  const urls: string[] = [];
  const cover = await uploadImage(new File([new Uint8Array(bytes)], "cover.png", { type: "image/png" }), "Kapak", "test", urls);
  expect(cover).toMatchObject({ width: 480, height: 320, alt: "Kapak" });
  expect(cover.variants).toHaveLength(1); expect(put).toHaveBeenCalledTimes(1);
  expect((await sharp(put.mock.calls[0][1]).metadata()).format).toBe("webp");
  expect(urls).toEqual([cover.url]);
});
it("rejects corrupt files before creating public blobs", async () => {
  await expect(uploadImage(new File(["not an image"], "fake.jpg", { type: "image/jpeg" }), "Kapak", "test", [])).rejects.toMatchObject({ status: 422 });
  expect(put).not.toHaveBeenCalled();
});
it("retains partial upload URLs for cleanup when a later variant fails", async () => {
  const bytes = await sharp({ create: { width: 1600, height: 900, channels: 3, background: "white" } }).png().toBuffer();
  put.mockResolvedValueOnce({ url: "https://example.test/480.webp" }).mockRejectedValueOnce(new Error("Upload interrupted"));
  const urls: string[] = [];
  await expect(uploadImage(new File([new Uint8Array(bytes)], "cover.png", { type: "image/png" }), "Kapak", "test", urls)).rejects.toThrow("Upload interrupted");
  expect(urls).toEqual(["https://example.test/480.webp"]);
});
