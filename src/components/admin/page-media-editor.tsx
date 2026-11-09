"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, LoaderCircle, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { pageGallery } from "@/lib/page-galleries";
import { resolveImage, type CmsState } from "@/lib/cms-shared";
import type { CmsRegistry, ContentDocument } from "@/lib/admin/types";
export type MediaApi = <T>(path: string, options?: RequestInit) => Promise<T>;
import type { ImageSelection as Selection } from "@/lib/admin/preview-editor";
export function PageMediaEditor({ document, state, registry, api, onState, onDirty, onNotice }: {
  document: ContentDocument; state: CmsState; registry: CmsRegistry; api: MediaApi;
  onState: (state: CmsState) => void; onDirty: (value: boolean) => void; onNotice: (text: string) => void;
}) {
  const [selected, setSelected] = useState<Selection>();
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const gallery = pageGallery(state, document.id);
  const slots = registry.images.filter(image => document.images.includes(image.src));
  useEffect(() => { onDirty(busy || !!selected); }, [busy, selected, onDirty]);
  async function change(item: Selection, action: "remove" | "reset" | "left" | "right") {
    if (action === "remove" && !window.confirm("Bu görsel seçili sayfadan kaldırılsın mı?")) return;
    setBusy(true); setError("");
    try {
      const result = await api<{ state: CmsState }>("/api/admin/media/", { method: action === "remove" ? "DELETE" : "PATCH", body: JSON.stringify({ document: document.id, target: item.target, source: item.source, version: state.version, action }) });
      onState(result.state); onNotice(action === "remove" ? "Görsel taslaktan kaldırıldı." : "Görseller taslağa kaydedildi.");
    } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  const visibleSlots = slots.filter(item => resolveImage(state, document.id, item.src) !== null);
  const removedSlots = slots.filter(item => resolveImage(state, document.id, item.src) === null);
  return <div className="ka-page-images">
    {error && <p className="ka-error" role="alert">{error}</p>}
    <div className="ka-image-section-heading"><p>Bu sayfada kullanılacak görselleri buradan düzenleyin.</p>{document.id !== "shared" && <button className="ka-primary" disabled={busy || gallery.length >= 30} onClick={() => setSelected({ target: "gallery", source: "", alt: "", url: "" })}><ImagePlus size={18} />Görsel ekle</button>}</div>
    <div className="ka-page-image-grid">{gallery.map((item, index) => { const selection: Selection = { target: "gallery", source: item.id, alt: item.alt, url: item.url }; return <article className="ka-page-image-card" key={item.id}>
      <button className="ka-page-image-preview" aria-label={`${item.alt} görselini değiştir`} disabled={busy} onClick={() => setSelected(selection)}><img src={item.variants[0]?.url || item.url} alt={item.alt} loading="lazy" /></button><div className="ka-image-actions"><button className="ka-text-button" disabled={busy} onClick={() => setSelected(selection)}>Düzenle</button><button className="ka-icon" title="Sola taşı" aria-label={`${item.alt} sola taşı`} disabled={busy || index === 0} onClick={() => void change(selection, "left")}><ArrowLeft size={16} /></button><button className="ka-icon" title="Sağa taşı" aria-label={`${item.alt} sağa taşı`} disabled={busy || index === gallery.length - 1} onClick={() => void change(selection, "right")}><ArrowRight size={16} /></button><button className="ka-icon" title="Kaldır" aria-label={`${item.alt} kaldır`} disabled={busy} onClick={() => void change(selection, "remove")}><Trash2 size={16} /></button></div>
    </article>; })}{visibleSlots.map(item => {
      const replacement = resolveImage(state, document.id, item.src);
      const selection: Selection = { target: "slot", source: item.src, alt: replacement?.alt || item.alt, url: replacement?.url || item.src };
      const customized = Object.hasOwn(state.pageMedia?.[document.id]?.images || {}, item.src);
      return <article className="ka-page-image-card" key={item.src}><button className="ka-page-image-preview" aria-label={`${item.alt} görselini değiştir`} onClick={() => setSelected(selection)} disabled={busy}><img src={replacement?.variants[0]?.url || item.src} alt={selection.alt} loading="lazy" /></button><div className="ka-image-actions"><button className="ka-text-button" onClick={() => setSelected(selection)} disabled={busy}>Düzenle</button>{customized && <button className="ka-icon" title="İlk görsele dön" aria-label={`${item.alt} ilk görsele dön`} disabled={busy} onClick={() => void change(selection, "reset")}><RotateCcw size={16} /></button>}<button className="ka-icon" title="Kaldır" aria-label={`${item.alt} kaldır`} disabled={busy} onClick={() => void change(selection, "remove")}><Trash2 size={16} /></button></div></article>;
    })}</div>
    {!gallery.length && !visibleSlots.length && <div className="ka-gallery-empty"><ImagePlus size={28} /><p>Bu sayfaya henüz görsel eklenmedi.</p></div>}
    {!!removedSlots.length && <details className="ka-removed-images"><summary>Kaldırılan görseller</summary><div className="ka-page-image-grid">{removedSlots.map(item => <article className="ka-page-image-card" key={item.src}><img src={item.src} alt={item.alt} loading="lazy" /><button className="ka-secondary" disabled={busy} aria-label={`${item.alt} geri getir`} onClick={() => void change({ target: "slot", source: item.src, alt: item.alt, url: item.src }, "reset")}><RotateCcw size={16} />Geri getir</button></article>)}</div></details>}
    {selected && <ImageEditor key={selected.source || "new"} selected={selected} document={document} state={state} api={api} onClose={() => setSelected(undefined)} onSaved={next => { onState(next); setSelected(undefined); onNotice("Görseller taslağa kaydedildi."); }} />}
  </div>;
}

export function ImageEditor({ selected, document: page, state, api, onClose, onSaved }: { selected: Selection; document: ContentDocument; state: CmsState; api: MediaApi; onClose: () => void; onSaved: (state: CmsState) => void }) {
  const [file, setFile] = useState<File>(), [preview, setPreview] = useState("");
  const alt = (selected.alt.trim() || `${page.title} görseli`).slice(0, 250);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null), dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; dialog.current?.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = overflow; previous?.focus(); }; }, []);
  useEffect(() => { if (!file) return; const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  function choose(next?: File) {
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(next.type) || next.size > 4_000_000 || !next.size) { setError("JPG, PNG, WebP veya AVIF biçiminde, en fazla 4 MB bir görsel seçin."); return; }
    setFile(next); setError("");
  }
  function close() { if (!busy && (!file || window.confirm("Seçtiğiniz görsel henüz kaydedilmedi. Kapatılsın mı?"))) onClose(); }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!file || busy) return; setBusy(true); setError("");
    const body = new FormData(); body.set("file", file); body.set("document", page.id); body.set("target", selected.target); body.set("source", selected.source); body.set("alt", alt.trim()); body.set("version", String(state.version));
    try { const result = await api<{ state: CmsState }>("/api/admin/media/", { method: "POST", body }); onSaved(result.state); } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  async function remove() {
    if (!selected.source || !window.confirm("Bu görsel sayfadan kaldırılsın mı?")) return;
    setBusy(true); setError("");
    try { const result = await api<{ state: CmsState }>("/api/admin/media/", { method: "DELETE", body: JSON.stringify({ document: page.id, target: selected.target, source: selected.source, version: state.version, action: "remove" }) }); onSaved(result.state); }
    catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  return <dialog className="ka-media-dialog" ref={dialog} onCancel={event => { event.preventDefault(); close(); }} aria-labelledby="page-image-title"><div className="ka-detail-top"><h2 id="page-image-title">{selected.source ? "Görseli değiştir" : "Görsel ekle"}</h2><button className="ka-icon" aria-label="Görsel düzenlemeyi kapat" onClick={close} disabled={busy}><X size={22} /></button></div><form onSubmit={save}><div className="ka-upload-preview" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (!busy) choose(event.dataTransfer.files[0]); }}>{(preview || selected.url) && <img src={preview || selected.url} alt="Görsel önizlemesi" />}<button className="ka-secondary" type="button" onClick={() => input.current?.click()} disabled={busy}><Upload size={17} />{file ? "Başka görsel seç" : "Dosya seç"}</button><input aria-label="Görsel dosyası" ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={event => choose(event.target.files?.[0])} disabled={busy} /></div><p className="ka-help">JPG, PNG, WebP veya AVIF · En fazla 4 MB<br />Yeni görseller sayfanın görseller bölümüne eklenir.</p><p className="ka-help">{page.title} sayfasının taslağına kaydedilir. Yayınla dediğinizde sitede görünür.</p>{error && <p className="ka-error" role="alert">{error}</p>}<div className="ka-dialog-actions">{selected.source && <button type="button" className="ka-remove-image" onClick={() => void remove()} disabled={busy}><Trash2 size={16} />Kaldır</button>}<button type="button" className="ka-secondary" onClick={close} disabled={busy}>Vazgeç</button><button className="ka-primary" type="submit" disabled={!file || busy}>{busy ? <LoaderCircle className="ka-spin" size={17} /> : <Check size={17} />}{busy ? "Yükleniyor…" : "Taslağa kaydet"}</button></div></form></dialog>;
}
