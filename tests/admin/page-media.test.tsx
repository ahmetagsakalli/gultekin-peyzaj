import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { resolveImage, type CmsState, type MediaOverride } from "../../src/lib/cms-shared";
import { pageGallery } from "../../src/lib/page-galleries";
import { updatePageMedia, validateMediaTarget } from "../../src/lib/admin/page-media";
import { PageMediaEditor } from "../../src/components/admin/page-media-editor";
import registry from "../../src/lib/admin/cms-registry.json";
vi.mock("server-only", () => ({}));
const media: MediaOverride = { url: "https://example.com/image.webp", alt: "Yeni görsel", width: 960, height: 640, variants: [{width:960,url:"https://example.com/image.webp"}] };
const base: CmsState = { texts: {}, images: {}, version: 1, pageMedia: { "/hakkimizda/": { gallery: [{ ...media, id: "about-test", alt: "Bahçe fotoğrafı" }] }, "/": { gallery: [{ ...media, id: "home-test" }] } } };
const document = "/hakkimizda/";
const source = "/images/lawn.webp";
const target = { document, source, target: "slot" as const, version: 1 };
const page = registry.documents.find(item => item.id === document)!;
beforeEach(() => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  URL.createObjectURL = vi.fn(() => "blob:test"); URL.revokeObjectURL = vi.fn();
});
describe("Page-scoped media", () => {
  it("preserves global overrides while isolating replacements and removals", () => {
    const state: CmsState = { ...base, images: { [source]: media }, pageMedia: { [document]: { images: { [source]: null } } } };
    expect(resolveImage(state, document, source)).toBeNull();
    expect(resolveImage(state, "/", source)).toEqual(media);
    const reset = updatePageMedia(state, target, "reset");
    expect(resolveImage({ ...state, pageMedia: { [document]: reset } }, document, source)).toEqual(media);
    expect(state.pageMedia![document].images![source]).toBeNull();
  });
  it("rejects wrong page/slot relationships, unknown pages and stale versions", () => {
    expect(validateMediaTarget(target, base, registry)).toEqual(target);
    for (const input of [{ ...target, document: "/iletisim/" }, { ...target, document: "invalid" }, { ...target, version: 0 }, { ...target, version: 2 }, { ...target, source: "/images/not-real.webp" }]) expect(() => validateMediaTarget(input, base, registry)).toThrow();
  });
  it("adds, reorders and removes gallery images without reviving an empty gallery", () => {
    const add = { ...target, target: "gallery" as const, source: "" };
    const added = updatePageMedia(base, add, "save", media, "uploaded");
    let state: CmsState = { ...base, pageMedia: { ...base.pageMedia, [document]: added } };
    expect(pageGallery(state, document).at(-1)?.id).toBe("uploaded");
    const moved = updatePageMedia(state, { ...add, source: "uploaded" }, "left");
    expect(moved.gallery?.at(-2)?.id).toBe("uploaded");
    for (const item of [...pageGallery(state, document)]) state = { ...state, pageMedia: { ...state.pageMedia, [document]: updatePageMedia(state, {...add,source:item.id}, "remove") } };
    expect(pageGallery(state, document)).toEqual([]);
    expect(pageGallery(state, "/")).toHaveLength(1);
  });
  it("validates gallery limits and existing item IDs", () => {
    expect(() => validateMediaTarget({...target,target:"gallery",source:"missing"},base,registry)).toThrow();
    const state: CmsState={...base,pageMedia:{[document]:{gallery:Array.from({length:30},(_,id)=>({...media,id:String(id)}))}}};
    expect(() => validateMediaTarget({...target,target:"gallery",source:""},state,registry,true)).toThrow();
  });
});
describe("Page media editor", () => {
  it("only shows current page images and scopes removal to that page", async () => {
    const api=vi.fn().mockResolvedValue({state:base}), saved=vi.fn();
    render(<PageMediaEditor document={page} state={base} registry={registry} api={api} onState={saved} onDirty={vi.fn()} onNotice={vi.fn()} />);
    const name=pageGallery(base,document)[0].alt;
    fireEvent.click(screen.getByRole("button",{name:`${name} kaldır`}));
    await waitFor(()=>expect(saved).toHaveBeenCalled());
    const request=JSON.parse(api.mock.calls[0][1].body);
    expect(request).toMatchObject({document,target:"gallery",source:pageGallery(base,document)[0].id,version:1});
    expect(screen.queryByText("Ana sayfa")).toBeNull();
  });
  it("uploads a new image to the selected page and keeps failures editable", async () => {
    const api=vi.fn().mockRejectedValue(new Error("Sayfa başka bir pencerede değişti.")), saved=vi.fn();
    render(<PageMediaEditor document={page} state={base} registry={registry} api={api} onState={saved} onDirty={vi.fn()} onNotice={vi.fn()} />);
    fireEvent.click(screen.getByRole("button",{name:"Görsel ekle"}));
    fireEvent.change(screen.getByLabelText("Görsel dosyası"),{target:{files:[new File(["test"],"new.webp",{type:"image/webp"})]}});
    expect(screen.queryByLabelText("Görsel açıklaması")).toBeNull();
    fireEvent.click(screen.getByRole("button",{name:"Taslağa kaydet"}));
    expect((await screen.findByRole("alert")).textContent).toContain("başka bir pencerede");
    const form=api.mock.calls[0][1].body as FormData;
    expect(form.get("document")).toBe(document);expect(form.get("target")).toBe("gallery");expect(form.get("source")).toBe("");
    expect(form.get("alt")).toBe(`${page.title} görseli`);
    expect(saved).not.toHaveBeenCalled();expect((screen.getByLabelText("Görsel dosyası") as HTMLInputElement).disabled).toBe(false);
    expect((screen.getByRole("button",{name:"Taslağa kaydet"}) as HTMLButtonElement).disabled).toBe(false);
  });
  it("preserves an existing image description when replacing its file", async () => {
    const api=vi.fn().mockResolvedValue({state:base}), saved=vi.fn();
    render(<PageMediaEditor document={page} state={base} registry={registry} api={api} onState={saved} onDirty={vi.fn()} onNotice={vi.fn()} />);
    fireEvent.click(screen.getByRole("button",{name:"Bahçe fotoğrafı görselini değiştir"}));
    fireEvent.change(screen.getByLabelText("Görsel dosyası"),{target:{files:[new File(["test"],"IMG_1234.webp",{type:"image/webp"})]}});
    fireEvent.click(screen.getByRole("button",{name:"Taslağa kaydet"}));
    await waitFor(()=>expect(saved).toHaveBeenCalled());
    const form=api.mock.calls[0][1].body as FormData;
    expect(form.get("alt")).toBe("Bahçe fotoğrafı");
    expect(form.get("source")).toBe("about-test");
  });
  it("rejects unsupported files before upload", () => {
    const api=vi.fn();render(<PageMediaEditor document={page} state={base} registry={registry} api={api} onState={vi.fn()} onDirty={vi.fn()} onNotice={vi.fn()} />);
    fireEvent.click(screen.getByRole("button",{name:"Görsel ekle"}));
    fireEvent.change(screen.getByLabelText("Görsel dosyası"),{target:{files:[new File(["<svg/>"],"x.svg",{type:"image/svg+xml"})]}});
    expect(screen.getByRole("alert").textContent).toContain("en fazla 4 MB");expect(api).not.toHaveBeenCalled();
  });
});
