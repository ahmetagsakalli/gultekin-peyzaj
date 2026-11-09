// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ authorize: vi.fn(), read: vi.fn(), save: vi.fn(), upload: vi.fn(), cleanup: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("../../src/lib/admin/auth", () => ({ authorize: mocks.authorize }));
vi.mock("../../src/lib/admin/drafts", () => ({ readDraft: mocks.read, saveDraft: mocks.save }));
vi.mock("../../src/lib/admin/image-upload", () => ({ uploadImage: mocks.upload }));
vi.mock("../../src/lib/admin/media-cleanup", () => ({ cleanupUncommittedMedia: mocks.cleanup }));
import { POST, PATCH, DELETE } from "../../src/app/api/admin/blog/route";
import { blogSlug, prepareBlog } from "../../src/lib/admin/blog";
import { blogEntries, blogPost } from "../../src/lib/blog-shared";
import { emptyCms } from "../../src/lib/cms-shared";
import { postIndex } from "../../src/lib/post-index";
import { HttpError } from "../../src/lib/admin/http";
const id = "d8b9988b-ef07-4ac3-88b7-33e6d505a766";
const cover = { url: "https://example.test/cover.webp", alt: "Kapak", width: 960, height: 640, variants: [{ width: 960, url: "https://example.test/cover.webp" }] };
function request(values: Record<string, string> = {}, file = true) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ id, version: "1", title: "Çalışma alanı", body: "Yeni bir blog yazısının içeriği.", ...values })) form.set(key, value);
  if (file) form.set("cover", new File(["image"], "cover.jpg", { type: "image/jpeg" }));
  return new Request("https://example.test/api/admin/blog/", { method: "POST", body: form });
}
beforeEach(() => {
  vi.clearAllMocks(); mocks.authorize.mockResolvedValue({}); mocks.read.mockResolvedValue({ ...emptyCms, pageMedia: {} });
  mocks.save.mockImplementation(async state => ({ ...state, version: 2 }));
  mocks.upload.mockImplementation(async (_file, _alt, _id, urls) => { urls.push(cover.url); return cover; });
});
describe("Blog authoring API", () => {
  it("requires authentication and CSRF before uploads or changes", async () => {
    mocks.authorize.mockRejectedValue(new HttpError(403, "Yetki yok")); const req = request();
    expect((await POST(req)).status).toBe(403); expect(mocks.authorize).toHaveBeenCalledWith(req, true);
    expect(mocks.read).not.toHaveBeenCalled(); expect(mocks.upload).not.toHaveBeenCalled(); expect(mocks.save).not.toHaveBeenCalled();
  });
  it("rejects missing covers, invalid content, stale versions and missing edit targets", async () => {
    expect((await POST(request({}, false))).status).toBe(422);
    expect((await POST(request({ title: " " }))).status).toBe(422);
    expect((await POST(request({ version: "2" }))).status).toBe(409);
    expect((await PATCH(request())).status).toBe(404);
    expect(mocks.save).not.toHaveBeenCalled(); expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("keeps existing page data and registers cover ownership in the draft transaction", async () => {
    mocks.read.mockResolvedValue({ ...emptyCms, pageMedia: { "/": { texts: { heading: "Keep" } } } });
    const res = await POST(request()); expect(res.status).toBe(200);
    const { state, entry } = await res.json(); expect(entry.slug).toBe("calisma-alani");
    expect(state.pageMedia["/"].texts.heading).toBe("Keep");
    expect(blogEntries(state)[0].cover.alt).toBe("Çalışma alanı");
    expect(mocks.save.mock.calls[0][3]).toMatchObject({ source: "/blog/calisma-alani/:cover" });
    expect(mocks.cleanup).not.toHaveBeenCalled();
  });
  it("cleans uncommitted uploads on a save conflict without masking it", async () => {
    mocks.save.mockRejectedValueOnce(new HttpError(409, "Çakışma"));
    expect((await POST(request())).status).toBe(409); expect(mocks.cleanup).toHaveBeenCalledWith(expect.any(String), [cover.url]);
  });
  it("rejects an oversized multipart request", async () => {
    const req = request(); req.headers.set("content-length", "4400001");
    expect((await POST(req)).status).toBe(413); expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("uses Turkish slugs, avoids existing posts and keeps URLs on title edits", () => {
    expect(blogSlug("İş, Çığ, Şölen & Ürün!")).toBe("is-cig-solen-urun");
    const input = { id, version: 1, title: postIndex[0].title, body: "İçerik metni." };
    expect(prepareBlog(emptyCms, input, true).slug).not.toBe(postIndex[0].slug);
    const entry = { id, slug: "sabit-adres", title: "Eski", body: "Eski içerik", cover, createdAt: "2026-10-13T10:00:00Z", updatedAt: "2026-10-13T10:00:00Z" };
    const state = { ...emptyCms, pageMedia: { "/blog/sabit-adres/": { blogPost: entry } } };
    expect(prepareBlog(state, input, false).slug).toBe("sabit-adres");
    expect(() => prepareBlog(state, input, true)).toThrow("daha önce");
    expect(blogPost(entry)).toMatchObject({ cover, title: "Eski", readTime: 1 });
  });
  it("does not allow removal of static or nonexistent articles", async () => {
    const req = new Request("https://example.test/api/admin/blog/", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, version: 1 }) });
    expect((await DELETE(req)).status).toBe(404); expect(mocks.save).not.toHaveBeenCalled();
  });
});
