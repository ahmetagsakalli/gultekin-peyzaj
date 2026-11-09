"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, FileText, ImageIcon, LoaderCircle, MousePointer2, Plus, Search, X } from "lucide-react";
import { resolveText, type CmsState } from "@/lib/cms-shared";
import { bindPagePreview, type ImageSelection, type TextSelection } from "@/lib/admin/preview-editor";
import type { CmsRegistry, ContentDocument } from "@/lib/admin/types";
import { ImageEditor, PageMediaEditor, type MediaApi } from "./page-media-editor";

import { BlogEditor } from "./blog-editor";
import { blogEntries } from "@/lib/blog-shared";

type Props = { state: CmsState; registry: CmsRegistry; api: MediaApi; onState: (state: CmsState) => void; onDirty: (value: boolean) => void; onNotice: (text: string) => void };
export function PageEditor(props: Props) {
  const { registry } = props;
  const [page, setPage] = useState<ContentDocument>();
  const [blogId, setBlogId] = useState<string>();
  const entries = blogEntries(props.state);
  const entry = entries.find(item => item.id === blogId);
  const [search, setSearch] = useState("");
  if (blogId === "new" || entry) return <BlogEditor key={`${blogId}-${props.state.version}`} {...props} entry={entry} onSaved={setBlogId} onBack={() => setBlogId(undefined)} />;
  if (page) return <SelectedPage key={page.id} {...props} page={page} onBack={() => setPage(undefined)} />;
  const documents = [...registry.documents, ...entries.map(post => ({ id: post.id, title: post.title, group: "Yazılar", path: `/blog/${post.slug}/`, fields: [], images: [] }))].filter(doc => doc.title.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr")));
  return <div className="ka-page ka-page-picker"><div className="ka-page-heading"><div><h1>Sayfalar</h1><p>Düzenlemek istediğiniz sayfayı seçin.</p></div><button className="ka-primary" onClick={() => setBlogId("new")}><Plus size={18} />Yeni yazı</button></div><div className="ka-search ka-page-search"><Search size={18} /><input aria-label="Sayfa ara" placeholder="Sayfa veya yazı ara…" value={search} onChange={event => setSearch(event.target.value)} /></div>{[...new Set(documents.map(doc => doc.group))].map(group => <section className="ka-page-group" key={group}><h2>{group}</h2><div className="ka-page-choices">{documents.filter(doc => doc.group === group).map(doc => <button key={doc.id} onClick={() => entries.some(post => post.id === doc.id) ? setBlogId(doc.id) : setPage(doc)}><FileText size={20} /><span>{doc.title}</span><ChevronRight size={18} /></button>)}</div></section>)}{!documents.length && <p className="ka-empty">Bu isimde bir sayfa bulunamadı.</p>}</div>;
}
function SelectedPage({ page, state, registry, api, onState, onDirty, onNotice, onBack }: Props & { page: ContentDocument; onBack: () => void }) {
  const [mode, setMode] = useState<"page" | "images">("page");
  const [text, setText] = useState<TextSelection>(), [image, setImage] = useState<ImageSelection>();
  const [mediaDirty, setMediaDirty] = useState(false), [loading, setLoading] = useState(true), [failed, setFailed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null), cleanup = useRef<() => void>(undefined), scroll = useRef(0);
  const current = useRef({ page, registry, state }); current.current = { page, registry, state };
  const locked = !!text || !!image || mediaDirty;
  useEffect(() => { onDirty(locked); }, [locked, onDirty]);
  useEffect(() => () => cleanup.current?.(), []);
  useEffect(() => { if (mode === "page") { setLoading(true); setFailed(false); } }, [mode, state.version]);
  const loaded = useCallback(() => {
    cleanup.current?.();
    try {
      const doc = frame.current?.contentDocument;
      if (!doc?.body || doc.documentElement.dataset.cmsPreviewError === "true" || !doc.querySelector("main,footer")) throw new Error("Önizleme açılamadı.");
      const attach = () => {
        const { page, registry, state } = current.current;
        cleanup.current = bindPagePreview(doc, page, registry, state, setText, setImage);
        frame.current?.contentWindow?.scrollTo(0, scroll.current);
        setLoading(false); setFailed(false);
      };
      if (doc.documentElement.dataset.cmsPreviewReady === "true") attach();
      else { const failed = () => { setLoading(false); setFailed(true); }; doc.addEventListener("jp-cms-ready", attach, { once: true }); doc.addEventListener("jp-cms-error", failed, { once: true }); cleanup.current = () => { doc.removeEventListener("jp-cms-ready", attach); doc.removeEventListener("jp-cms-error", failed); }; }
    } catch { setLoading(false); setFailed(true); }
  }, []);
  function update(next: CmsState) { scroll.current = frame.current?.contentWindow?.scrollY || scroll.current; onState(next); }
  return <div className="ka-page ka-visual-page"><button className="ka-back" onClick={onBack} disabled={locked}><ArrowLeft size={17} />Tüm sayfalar</button><div className="ka-page-heading"><div><h1>{page.title}</h1></div><a className="ka-secondary" href={page.path} target="_blank" rel="noopener noreferrer">Sitede aç<ArrowUpRight size={17} /></a></div><div className="ka-editor-tabs" role="tablist" aria-label="Sayfayı düzenle"><button role="tab" id="page-edit-tab" aria-controls="page-edit-panel" aria-selected={mode === "page"} disabled={locked} onClick={() => setMode("page")}><MousePointer2 size={17} />Sayfayı düzenle</button><button role="tab" id="page-images-tab" aria-controls="page-images-panel" aria-selected={mode === "images"} disabled={locked} onClick={() => { scroll.current = frame.current?.contentWindow?.scrollY || 0; cleanup.current?.(); setMode("images"); }}><ImageIcon size={17} />Görseller</button></div>
    {mode === "page" ? <div role="tabpanel" id="page-edit-panel" aria-labelledby="page-edit-tab"><p className="ka-preview-tip">Değiştirmek istediğiniz yazıya veya görsele tıklayın.</p><div className="ka-preview-frame">{loading && <div className="ka-preview-loading" role="status"><LoaderCircle className="ka-spin" size={22} />Sayfa açılıyor…</div>}<iframe key={`${page.id}-${state.version}`} ref={frame} src={`${page.path}?editorPreview=${state.version}`} title={`${page.title} düzenleme önizlemesi`} onLoad={loaded} onError={() => { setLoading(false); setFailed(true); }} sandbox="allow-scripts allow-same-origin" />{failed && <div className="ka-preview-loading"><p>Önizleme açılamadı.</p><button className="ka-secondary" onClick={() => { setLoading(true); setFailed(false); frame.current?.contentWindow?.location.reload(); }}>Tekrar dene</button></div>}</div></div> : <div role="tabpanel" id="page-images-panel" aria-labelledby="page-images-tab"><PageMediaEditor document={page} state={state} registry={registry} api={api} onState={update} onDirty={setMediaDirty} onNotice={onNotice} /></div>}
    {text && <TextEditor selection={text} page={page} state={state} api={api} onClose={() => setText(undefined)} onSaved={next => { update(next); setText(undefined); onNotice("Yazı taslağa kaydedildi."); }} />}
    {image && <ImageEditor selected={image} document={page} state={state} api={api} onClose={() => setImage(undefined)} onSaved={next => { update(next); setImage(undefined); onNotice("Görsel taslağa kaydedildi."); }} />}
  </div>;
}
export function TextEditor({ selection, page, state, api, onClose, onSaved }: { selection: TextSelection; page: ContentDocument; state: CmsState; api: MediaApi; onClose: () => void; onSaved: (state: CmsState) => void }) {
  const original = Object.fromEntries(selection.fields.map(field => [field.id, resolveText(state, page.id, field.text)]));
  const [values, setValues] = useState(original), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const dirty = selection.fields.some(field => values[field.id] !== original[field.id]);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; dialog.current?.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = overflow; previous?.focus(); }; }, []);
  function close() { if (!busy && (!dirty || window.confirm("Yazı henüz kaydedilmedi. Değişiklikten vazgeçilsin mi?"))) onClose(); }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!dirty || busy) return; setBusy(true); setError("");
    try { const changes = Object.fromEntries(Object.entries(values).filter(([id, value]) => value !== original[id])); const result = await api<{ state: CmsState }>("/api/admin/content/", { method: "PATCH", body: JSON.stringify({ document: page.id, changes, version: state.version }) }); onSaved(result.state); }
    catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  return <dialog ref={dialog} className="ka-media-dialog ka-text-dialog" aria-labelledby="edit-text-title" onCancel={event => { event.preventDefault(); close(); }}><div className="ka-detail-top"><h2 id="edit-text-title">{selection.heading ? "Başlığı düzenle" : "Yazıyı düzenle"}</h2><button className="ka-icon" aria-label="Yazı düzenlemeyi kapat" disabled={busy} onClick={close}><X size={22} /></button></div><form onSubmit={save}>{selection.fields.map((field, index) => <div className="ka-selected-text" key={field.id}><label className="ka-sr-only" htmlFor={`edit-${field.id}`}>Yazı {index + 1}</label><textarea id={`edit-${field.id}`} rows={Math.min(10, Math.max(2, Math.ceil(values[field.id].length / 65)))} value={values[field.id]} required maxLength={12000} disabled={busy} onChange={event => setValues({ ...values, [field.id]: event.target.value })} /></div>)}{error && <p className="ka-error" role="alert">{error}</p>}<div className="ka-dialog-actions"><button className="ka-secondary" type="button" disabled={busy} onClick={close}>Vazgeç</button><button className="ka-primary" type="submit" disabled={!dirty || busy || Object.values(values).some(value => !value.trim())}>{busy ? <LoaderCircle className="ka-spin" size={17} /> : <Check size={17} />}{busy ? "Kaydediliyor…" : "Taslağa kaydet"}</button></div></form></dialog>;
}
