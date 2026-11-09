import { normalizeText, resolveImage, resolveText, type CmsState } from "@/lib/cms-shared";
import { pageGallery } from "@/lib/page-galleries";
import type { ContentDocument, ContentField, CmsRegistry } from "./types";
export type ImageSelection = { target: "slot" | "gallery"; source: string; alt: string; url: string };
export type TextSelection = { fields: ContentField[]; heading: boolean };

// This runs only inside the authenticated editor's same-origin preview.
export function bindPagePreview(doc: Document, page: ContentDocument, registry: CmsRegistry, state: CmsState, onText: (selection: TextSelection) => void, onImage: (selection: ImageSelection) => void) {
  const style = doc.createElement("style");
  style.textContent = `html{scroll-behavior:auto!important}body{padding-top:0!important}.floating-contact,.skip-link,video{display:none!important}[data-page-edit-text],[data-page-edit-image]{cursor:pointer!important}[data-page-edit-text]:hover,[data-page-edit-image]:hover,[data-page-edit-text]:focus-visible,[data-page-edit-image]:focus-visible{outline:2px solid #dc4309!important;outline-offset:5px;border-radius:3px} ${page.id === "shared" ? 'main#icerik{display:none!important}.header-wrap{position:relative!important;background:#203e30!important}.site-footer{margin:0!important}' : '.header-wrap,.site-footer{display:none!important}.faq-answer[hidden]{display:block!important}'}`;
  doc.head.append(style);
  doc.querySelectorAll("details").forEach(item => { item.open = true; });
  const texts = new Map<Element, TextSelection>(), images = new Map<Element, ImageSelection>();
  const originalTabIndex = new Map<Element, string | null>();
  function index() {
    texts.clear(); images.clear();
    doc.querySelectorAll("[data-page-edit-text],[data-page-edit-image]").forEach(el => { el.removeAttribute("data-page-edit-text"); el.removeAttribute("data-page-edit-image"); });
    const byId = new Map(page.fields.map(field => [field.id, field]));
    const byValue = new Map<string, ContentField[]>();
    for (const field of page.fields) { const value = normalizeText(resolveText(state, page.id, field.text)); byValue.set(value, [...(byValue.get(value) || []), field]); }
    const root = doc.body;
    if (!root) return;
    const walker = doc.createTreeWalker(root, 4);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,textarea,input,select,dialog') || (page.id !== "shared" && parent.closest('.header-wrap,.site-header')) || (page.id !== "shared" && parent.closest("footer"))) continue;
      const marker = parent.closest<HTMLElement>("[data-cms-text]");
      const candidates = byValue.get(normalizeText(node.textContent || "")) || [];
      const field = marker ? (marker.dataset.cmsPage === page.id ? byId.get(marker.dataset.cmsText || "") : undefined) : candidates.length === 1 ? candidates[0] : undefined;
      if (!field) continue;
      const element = parent.closest("h1,h2,h3,h4,h5,h6,p,li,dt,dd,th,td,summary,button,a,label") || parent;
      if (element.contains(doc.querySelector("main"))) continue;
      const selection = texts.get(element) || { fields: [], heading: /^H[1-6]$/.test(element.tagName) };
      if (!selection.fields.some(item => item.id === field.id)) selection.fields.push(field);
      texts.set(element, selection);
      element.setAttribute("data-page-edit-text", "");
      if (!originalTabIndex.has(element)) originalTabIndex.set(element, element.getAttribute("tabindex"));
      element.setAttribute("tabindex", "0");
    }
    const gallery = pageGallery(state, page.id);
    root.querySelectorAll("img").forEach(img => {
      if (page.id !== "shared" && img.closest(".header-wrap,.site-header,.site-footer")) return;
      const galleryItem = gallery.find(item => item.id === img.dataset.galleryId);
      if (galleryItem) { images.set(img, { target: "gallery", source: galleryItem.id, alt: galleryItem.alt, url: galleryItem.url }); }
      else {
        const source = img.dataset.cmsImage;
        const slot = registry.images.find(item => page.images.includes(item.src) && (item.src === source || img.getAttribute("src") === (resolveImage(state, page.id, item.src)?.url || item.src)));
        if (slot) { const value = resolveImage(state, page.id, slot.src); if (value !== null) images.set(img, { target: "slot", source: slot.src, alt: value?.alt || slot.alt, url: value?.url || slot.src }); }
      }
      if (images.has(img)) { img.setAttribute("data-page-edit-image", ""); if (!originalTabIndex.has(img)) originalTabIndex.set(img, img.getAttribute("tabindex")); img.setAttribute("tabindex", "0"); }
    });
  }
  index();
  let timer: ReturnType<typeof setTimeout>;
  const Observer = doc.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(() => { clearTimeout(timer); timer = setTimeout(index, 80); }) : undefined;
  observer?.observe(doc.body, { childList: true, subtree: true, characterData: true });
  function select(event: Event) {
    const target = event.target as Element;
    if (!target?.closest) return;
    const imageElement = target.closest("[data-page-edit-image]");
    const image = imageElement && images.get(imageElement);
    const textElement = target.closest("[data-page-edit-text]");
    const text = textElement && texts.get(textElement);
    // FAQ disclosure icons still open their answers; clicking the words edits them.
    if (!image && target.closest('svg') && target.closest('[aria-expanded]')) return;
    if (image || text) { event.preventDefault(); event.stopImmediatePropagation(); if (image) onImage(image); else if (text) onText(text); }
    else if (target.closest("a")) { event.preventDefault(); event.stopImmediatePropagation(); }
  }
  const submit = (event: Event) => { event.preventDefault(); event.stopImmediatePropagation(); };
  const keydown = (event: KeyboardEvent) => { if (event.key === "Enter" && (event.target as Element)?.matches?.("[data-page-edit-text],[data-page-edit-image]")) select(event); };
  doc.addEventListener("click", select, true); doc.addEventListener("submit", submit, true); doc.addEventListener("keydown", keydown, true);
  return () => {
    observer?.disconnect(); clearTimeout(timer); style.remove();
    doc.removeEventListener("click", select, true); doc.removeEventListener("submit", submit, true); doc.removeEventListener("keydown", keydown, true);
    doc.querySelectorAll("[data-page-edit-text],[data-page-edit-image]").forEach(el => { el.removeAttribute("data-page-edit-text"); el.removeAttribute("data-page-edit-image"); });
    originalTabIndex.forEach((value, el) => { if (value === null) el.removeAttribute("tabindex"); else el.setAttribute("tabindex", value); });
  };
}
