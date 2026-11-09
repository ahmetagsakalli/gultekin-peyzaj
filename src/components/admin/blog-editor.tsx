"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Eye, ImagePlus, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import type { BlogEntry, CmsState } from "@/lib/cms-shared";
import type { MediaApi } from "./page-media-editor";

type Props = { entry?: BlogEntry; state: CmsState; api: MediaApi; onState: (state: CmsState) => void;
  onDirty: (dirty: boolean) => void; onNotice: (notice: string) => void; onBack: () => void; onSaved: (id: string) => void };

export function BlogEditor({ entry, state, api, onState, onDirty, onNotice, onBack, onSaved }: Props) {
  const [id] = useState(() => entry?.id || crypto.randomUUID());
  const [title, setTitle] = useState(entry?.title || "");
  const [body, setBody] = useState(entry?.body || "");
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState(entry?.cover.url || "");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const dirty = title !== (entry?.title || "") || body !== (entry?.body || "") || !!file;
  useEffect(() => { onDirty(dirty || busy); return () => onDirty(false); }, [dirty, busy, onDirty]);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file); setImage(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function back() {
    if (!busy && (!dirty || window.confirm("Kaydedilmemiş yazınız var. Değişikliklerden vazgeçilsin mi?"))) onBack();
  }
  function choose(next?: File) {
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(next.type) || next.size > 4_000_000 || !next.size) {
      setError("JPG, PNG, WebP veya AVIF biçiminde, en fazla 4 MB bir görsel seçin."); return;
    }
    setFile(next); setError("");
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (busy) return;
    if (!file && !entry?.cover) { setError("Bir kapak görseli seçin."); return; }
    setBusy(true); setError("");
    const form = new FormData();
    form.set("id", id); form.set("version", String(state.version)); form.set("title", title); form.set("body", body);
    if (file) form.set("cover", file);
    try {
      const result = await api<{ state: CmsState; entry: BlogEntry }>("/api/admin/blog/", { method: entry ? "PATCH" : "POST", body: form });
      onDirty(false); onState(result.state); onSaved(result.entry.id);
      onNotice("Yazı taslağa kaydedildi. Hazır olduğunuzda Yayınla’ya basın.");
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!entry || busy || !window.confirm("Yazı taslaktan kaldırılsın mı? Yayınladığınızda siteden de kaldırılır. Geçmişten geri alabilirsiniz.")) return;
    setBusy(true); setError("");
    try {
      const result = await api<{ state: CmsState }>("/api/admin/blog/", { method: "DELETE", body: JSON.stringify({ id: entry.id, version: state.version }) });
      onDirty(false); onState(result.state); onBack(); onNotice("Yazı taslaktan kaldırıldı. Canlı site henüz değişmedi.");
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="ka-page ka-blog-editor">
    <button className="ka-back" onClick={back} disabled={busy}><ArrowLeft size={17} />Tüm sayfalar</button>
    <div className="ka-page-heading"><div><h1>{entry ? "Yazıyı düzenle" : "Yeni yazı"}</h1><p>Önce taslağa kaydedin, hazır olduğunuzda yayınlayın.</p></div>
      <button type="button" className="ka-secondary" disabled={busy} onClick={() => setPreview(!preview)}>{preview ? <Pencil size={17} /> : <Eye size={17} />}{preview ? "Düzenlemeye dön" : "Önizle"}</button>
    </div>
    <form onSubmit={save}>
      {preview ? <article className="ka-blog-preview"><h2>{title || "Yazı başlığı"}</h2>{image && <img src={image} alt={title || "Kapak görseli"} />}<div>{(body || "Yazınız burada görünecek.").split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></article> :
      <div className="ka-blog-fields"><div className="ka-blog-copy">
        <label htmlFor="blog-title">Başlık</label><input id="blog-title" value={title} onChange={event => setTitle(event.target.value)} minLength={2} maxLength={160} required disabled={busy} placeholder="Yazınıza bir başlık verin" />
        <label htmlFor="blog-body">Yazı içeriği</label><textarea id="blog-body" value={body} onChange={event => setBody(event.target.value)} minLength={10} maxLength={60000} rows={16} required disabled={busy} placeholder="Yazınızı buraya yazın veya yapıştırın…" />
        <p className="ka-help">Paragrafları boş satırla ayırabilirsiniz.</p>
      </div><div className="ka-blog-cover"><label htmlFor="blog-cover">Kapak görseli</label>
        <button type="button" className="ka-blog-image" disabled={busy} onClick={() => input.current?.click()} aria-label={image ? "Kapak görselini değiştir" : "Kapak görseli seç"}>{image ? <img src={image} alt="Kapak önizlemesi" /> : <span><ImagePlus size={30} />Görsel seç</span>}</button>
        <input id="blog-cover" ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden disabled={busy} onChange={event => choose(event.target.files?.[0])} />
        {image && <button type="button" className="ka-text-button" disabled={busy} onClick={() => input.current?.click()}>Görseli değiştir</button>}
        <p className="ka-help">JPG, PNG, WebP veya AVIF · En fazla 4 MB<br />Yatay bir görsel seçmeniz önerilir.</p>
      </div></div>}
      {error && <p className="ka-error" role="alert">{error}</p>}
      <div className="ka-blog-actions">{entry && <button type="button" className="ka-remove-image" disabled={busy} onClick={() => void remove()}><Trash2 size={16} />Yazıyı kaldır</button>}<button type="button" className="ka-secondary" disabled={busy} onClick={back}>Vazgeç</button><button type="submit" className="ka-primary" disabled={busy || !dirty || title.trim().length < 2 || body.trim().length < 10}>{busy ? <LoaderCircle className="ka-spin" size={17} /> : <Check size={17} />}{busy ? "Kaydediliyor…" : "Taslağa kaydet"}</button></div>
    </form>
  </div>;
}
