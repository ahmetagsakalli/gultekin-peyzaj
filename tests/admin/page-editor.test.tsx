import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { bindPagePreview } from "../../src/lib/admin/preview-editor";
import { CmsAnchor, CmsProvider, CmsScope, CmsText } from "../../src/components/cms";
import { TextEditor, PageEditor } from "../../src/components/admin/page-editor";
import { emptyCms, resolveText, textKey } from "../../src/lib/cms-shared";
import type { ContentDocument, CmsRegistry } from "../../src/lib/admin/types";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
const title = { id: textKey("Merhaba"), text: "Merhaba", label: "Başlık" };
const body = { id: textKey("Örnek yazı"), text: "Örnek yazı", label: "Metin" };
const page: ContentDocument = { id: "/", path: "/", title: "Ana sayfa", group: "Sayfalar", fields: [title, body], images: ["/images/example.webp"] };
const registry: CmsRegistry = { documents: [page], texts: { [title.id]: title.text, [body.id]: body.text }, images: [{ src: page.images[0], alt: "Ofis", pages: [page.id] }] };
beforeEach(() => { HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); }; vi.spyOn(window, "confirm").mockReturnValue(false); });
describe("Page preview editor", () => {
 it("selects the actual paragraph and picture, prevents navigation and form submissions", () => {
  const iframe = document.createElement("iframe"); document.body.append(iframe);
  const doc = iframe.contentDocument!;
  doc.body.innerHTML = '<header class="site-header"><p>Örnek yazı</p></header><main><h1>Merhaba</h1><p>Örnek yazı</p><img data-cms-image="/images/example.webp" src="/images/example-640.webp"><a href="/iletisim/">Git</a><form><input></form></main><footer><p>Örnek yazı</p></footer>';
  const onText = vi.fn(), onImage = vi.fn();
  const clean = bindPagePreview(doc, page, registry, emptyCms, onText, onImage);
  fireEvent.click(doc.querySelector("main p")!); expect(onText).toHaveBeenCalledWith({ fields: [body], heading: false });
  fireEvent.click(doc.querySelector("img")!); expect(onImage).toHaveBeenCalledWith(expect.objectContaining({ source: page.images[0], target: "slot" }));
  expect(doc.querySelector("header p")?.hasAttribute("data-page-edit-text")).toBe(false);
  expect(doc.querySelector("footer p")?.hasAttribute("data-page-edit-text")).toBe(false);
  expect(fireEvent.click(doc.querySelector("a")!)).toBe(false);
  expect(fireEvent.submit(doc.querySelector("form")!)).toBe(false);
  clean(); expect(doc.querySelector("[data-page-edit-text]")).toBeNull(); expect(doc.querySelector("h1")?.hasAttribute("tabindex")).toBe(false); iframe.remove();
 });
 it("matches updated page copy and groups only one heading's text fragments", () => {
  const iframe = document.createElement("iframe"); document.body.append(iframe); const doc = iframe.contentDocument!;
  doc.body.innerHTML = '<main><h1>Yeni başlık<span>Örnek yazı</span></h1><p>Örnek yazı</p></main>';
  const onText = vi.fn(); const state = { ...emptyCms, pageMedia: { "/": { texts: { [title.id]: "Yeni başlık" } } } };
  const clean = bindPagePreview(doc, page, registry, state, onText, vi.fn());
  fireEvent.click(doc.querySelector("h1")!); expect(onText.mock.calls[0][0].fields).toEqual([title, body]);
  clean(); iframe.remove();
 });
 it("keeps same-word changes on the chosen page and resolves its contact links", () => {
  const state = { ...emptyCms, texts: { [title.id]: "Genel" }, pageMedia: { "/": { texts: { [title.id]: "Ana sayfa başlığı" } } }, links: { "tel:+905001112233": "tel:+905002223344" }, pageLinks: { "/": { "tel:+905001112233": "tel:+905003334455" } } };
  expect(resolveText(state, "/", title.text)).toBe("Ana sayfa başlığı"); expect(resolveText(state, "/iletisim/", title.text)).toBe("Genel");
  render(<CmsProvider state={state}><CmsScope page="/"><CmsText>Merhaba</CmsText><CmsAnchor href="tel:+905001112233">Ara</CmsAnchor></CmsScope></CmsProvider>);
  expect(screen.getByText("Ana sayfa başlığı")).toBeTruthy(); expect(screen.getByRole("link", { name: "Ara" }).getAttribute("href")).toBe("tel:+905003334455");
 });
 it("uses stable field markers when two edited fields have the same words", () => {
  const iframe = document.createElement("iframe"); document.body.append(iframe); const doc = iframe.contentDocument!;
  doc.body.innerHTML = `<main><h1><span data-cms-text="${title.id}" data-cms-page="/">Aynı metin</span></h1><p><span data-cms-text="${body.id}" data-cms-page="/">Aynı metin</span></p></main>`;
  const onText = vi.fn(); const state = { ...emptyCms, pageMedia: { "/": { texts: { [title.id]: "Aynı metin", [body.id]: "Aynı metin" } } } };
  const clean = bindPagePreview(doc, page, registry, state, onText, vi.fn());
  fireEvent.click(doc.querySelector("p span")!); expect(onText).toHaveBeenCalledWith({ fields: [body], heading: false });
  clean(); iframe.remove();
 });
 it("starts with page names instead of a long field list", () => {
  render(<PageEditor state={emptyCms} registry={registry} api={vi.fn()} onState={vi.fn()} onDirty={vi.fn()} onNotice={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Ana sayfa" })).toBeTruthy(); expect(screen.queryByRole("textbox", {name:"Yazı 1"})).toBeNull();
  fireEvent.change(screen.getByRole("textbox", { name: "Sayfa ara" }), { target: { value: "bulunmayan" } }); expect(screen.queryByRole("button", { name: "Ana sayfa" })).toBeNull();
 });
 it("saves only edited fields to their page and preserves edits on conflicts", async () => {
  const api = vi.fn().mockRejectedValueOnce(new Error("İçerik başka bir pencerede değişti." )).mockResolvedValueOnce({ state: { ...emptyCms, version: 2 } }); const saved = vi.fn(), close = vi.fn();
  render(<TextEditor selection={{ fields: [title], heading: true }} page={page} state={emptyCms} api={api} onClose={close} onSaved={saved} />);
  fireEvent.change(screen.getByRole("textbox", { name: "Yazı 1" }), { target: { value: "Yeni başlık" } });
  fireEvent.click(screen.getByRole("button", { name: "Taslağa kaydet" })); expect((await screen.findByRole("alert")).textContent).toContain("başka bir pencerede");
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Yeni başlık"); expect(saved).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Vazgeç" })); expect(close).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Taslağa kaydet" })); await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(JSON.parse(api.mock.calls[1][1].body)).toEqual({ document: "/", changes: { [title.id]: "Yeni başlık" }, version: 1 });
 });
});
