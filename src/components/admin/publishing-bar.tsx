"use client";
import { useEffect, useRef, useState } from "react";
import { History, LoaderCircle, RotateCcw, Send, X } from "lucide-react";
import type { CmsState } from "@/lib/cms-shared";
import type { MediaApi } from "./page-media-editor";
type Entry = { id: string; kind: "draft" | "published"; label: string; version: number; createdAt: string };
type Change = { action: "publish" | "discard" | "restore"; id?: string };
type Props = { state: CmsState; api: MediaApi; locked: boolean; onState: (state: CmsState) => void; onBusy: (busy: boolean) => void; onNotice: (message: string) => void };
export function PublishingBar({ state, api, locked, onState, onBusy, onNotice }: Props) {
  const [confirmation, setConfirmation] = useState<Change>();
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [history, setHistory] = useState<Entry[]>(), [loadingHistory, setLoadingHistory] = useState(false);
  const disabled = busy || locked || loadingHistory;
  async function change(action: "publish" | "discard" | "restore", id?: string) {
    if (disabled) return;
    setBusy(true); onBusy(true); setError("");
    try {
      const result = await api<{ state: CmsState }>("/api/admin/publishing/", { method: "POST", body: JSON.stringify({ action, version: state.version, ...(id ? { id } : {}) }) });
      onState(result.state); setHistory(undefined); setConfirmation(undefined);
      onNotice(action === "publish" ? "Değişiklikler yayınlandı." : action === "discard" ? "Taslak kaldırıldı. Yayındaki içerik geri alındı." : "Kayıt taslağa yüklendi. Hazır olduğunuzda yayınlayabilirsiniz.");
    } catch (error) { setError((error as Error).message); } finally { setBusy(false); onBusy(false); }
  }
  function confirm(action: Change["action"], id?: string) { if (disabled) return; setError(""); setHistory(undefined); setConfirmation({ action, id }); }
  async function openHistory() {
    setLoadingHistory(true); setError("");
    try { const result = await api<{ history: Entry[] }>("/api/admin/publishing/"); setHistory(result.history); }
    catch (error) { setError((error as Error).message); } finally { setLoadingHistory(false); }
  }
  return <section className="ka-publishing" aria-label="Taslak ve yayın">
    <div className="ka-publishing-row"><div><strong>{state.draft?.outdated ? "Yayındaki içerik değişmiş." : state.draft?.hasChanges ? "Yayınlanmamış değişiklikleriniz var." : "Tüm değişiklikler yayında."}</strong><p>Yazılar ve görseller taslağa kaydedilir. Yayınla dediğinizde tüm sayfalara uygulanır.</p></div><div className="ka-publishing-actions"><button className="ka-secondary" disabled={disabled} onClick={() => void openHistory()}>{loadingHistory ? <LoaderCircle className="ka-spin" size={16} /> : <History size={16} />}Geçmiş</button><button className="ka-secondary" disabled={disabled || (!state.draft?.hasChanges && !state.draft?.outdated)} onClick={() => confirm("discard")}><RotateCcw size={16} />Taslağı kaldır</button><button className="ka-primary" disabled={disabled || !state.draft?.hasChanges || state.draft?.outdated} onClick={() => confirm("publish")}>{busy ? <LoaderCircle className="ka-spin" size={16} /> : <Send size={16} />}Yayınla</button></div></div>
    {error && history === undefined && !confirmation && <p className="ka-error" role="alert">{error}</p>}
    {history && <HistoryDialog entries={history} state={state} busy={busy} error={error} onClose={() => { if (!busy) { setHistory(undefined); setError(""); } }} onRestore={id => confirm("restore", id)} />}
    {confirmation && <PublishConfirmation change={confirmation} busy={busy} error={error} onClose={() => { if (!busy) setConfirmation(undefined); }} onConfirm={() => void change(confirmation.action, confirmation.id)} />}
  </section>;
}
function HistoryDialog({ entries, state, busy, error, onClose, onRestore }: { entries: Entry[]; state: CmsState; busy: boolean; error: string; onClose: () => void; onRestore: (id: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; dialog.current?.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = overflow; previous?.focus(); }; }, []);
  return <dialog ref={dialog} className="ka-media-dialog ka-history-dialog" aria-labelledby="history-title" onCancel={event => { event.preventDefault(); onClose(); }}><div className="ka-detail-top"><h2 id="history-title">Değişiklik geçmişi</h2><button className="ka-icon" aria-label="Geçmişi kapat" onClick={onClose} disabled={busy}><X size={22} /></button></div><div className="ka-history-body"><p>Önceki bir kaydı taslağa alın, kontrol edip yayınlayın. Yayındaki site bu işlemle değişmez.</p>{error && <p className="ka-error" role="alert">{error}</p>}<ol>{entries.map(entry => { const current = entry.kind === "draft" && entry.version === state.version; return <li key={entry.id}><div><strong>{entry.label}</strong><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time></div><button className="ka-secondary" disabled={busy || current} onClick={() => onRestore(entry.id)}>{current ? "Şu anki taslak" : "Taslağa al"}</button></li>; })}</ol>{!entries.length && <p>Henüz bir kayıt yok.</p>}</div></dialog>;
}

function PublishConfirmation({ change, busy, error, onClose, onConfirm }: { change: Change; busy: boolean; error: string; onClose: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; dialog.current?.showModal(); return () => { previous?.focus(); }; }, []);
  const title = change.action === "publish" ? "Değişiklikleri yayınla" : change.action === "discard" ? "Taslağı kaldır" : "Geçmiş kaydını geri al";
  const message = change.action === "publish" ? "Tüm sayfalardaki taslak değişiklikleri canlı sitede görünecek." : change.action === "discard" ? "Yayındaki içerik geri alınacak. Bu taslağı geçmişten yeniden açabilirsiniz." : "Seçtiğiniz kayıt taslağa yüklenecek. Canlı site siz yayınlayana kadar değişmez.";
  return <dialog ref={dialog} className="ka-media-dialog ka-publish-confirm" aria-labelledby="publish-confirm-title" onCancel={event => { event.preventDefault(); onClose(); }}><div className="ka-detail-top"><h2 id="publish-confirm-title">{title}</h2><button className="ka-icon" aria-label="İşlemi kapat" disabled={busy} onClick={onClose}><X size={22} /></button></div><div className="ka-history-body"><p>{message}</p>{error && <p className="ka-error" role="alert">{error}</p>}<div className="ka-dialog-actions"><button className="ka-secondary" disabled={busy} onClick={onClose}>Vazgeç</button><button className="ka-primary" disabled={busy} onClick={onConfirm}>{busy ? "İşleniyor…" : "Onayla"}</button></div></div></dialog>;
}
