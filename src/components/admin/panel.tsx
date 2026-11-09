"use client";
import { panelConfig } from "@/lib/panel-config";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronRight, FileText, Globe2, KeyRound, LoaderCircle, LogOut, X } from "lucide-react";
import type { CmsState } from "@/lib/cms-shared";
import type { CmsRegistry } from "@/lib/admin/types";
import { PublishingBar } from "./publishing-bar";
import { PageEditor } from "./page-editor";
import { PasswordSettings } from "./password-settings";
import { SiteStatus } from "./site-status";
type View = "content" | "media" | "password" | "site";
type Api = <T>(path: string, options?: RequestInit) => Promise<T>;
export function AdminPanel({ csrf, initialView }: { csrf: string; initialView: View }) {
  const [view, setView] = useState<View>(initialView === "media" ? "content" : initialView);
  const [cms, setCms] = useState<{ state: CmsState; registry: CmsRegistry }>();
  const [publishing, setPublishing] = useState(false);
  const [cmsError, setCmsError] = useState("");
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  const markDirty = useCallback((value: boolean) => { dirtyRef.current = value; setDirty(value); }, []);
  const [leaving, setLeaving] = useState(false);
  const [notice, setNotice] = useState("");
  const api = useCallback<Api>(async (path, options = {}) => {
    const response = await fetch(path, { ...options, signal: AbortSignal.timeout(options.body instanceof FormData ? 60000 : 25000), cache: "no-store", headers: { "X-CSRF-Token": csrf, ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...options.headers } }).catch(() => { throw new Error("Bağlantı kurulamadı. Lütfen tekrar deneyin."); });
    const data = await response.json();
    if (response.status === 401) { window.location.assign("/admin/"); throw new Error("Oturumunuz sona erdi."); }
    if (!response.ok) throw new Error(data.error || "İşlem tamamlanamadı.");
    return data;
  }, [csrf]);
  const loadCms = useCallback(async () => {
    setCmsError("");
    try { setCms(await api("/api/admin/content/")); } catch (error) { setCmsError((error as Error).message); }
  }, [api]);
  useEffect(() => { if ((view === "content" || view === "media") && !cms) void loadCms(); }, [view, cms, loadCms]);
  useEffect(() => {
    if (!dirty && !publishing) return;
    const guard = (event: BeforeUnloadEvent) => { if (dirtyRef.current || publishing) event.preventDefault(); };
    window.addEventListener("beforeunload", guard); return () => window.removeEventListener("beforeunload", guard);
  }, [dirty, publishing]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 5000); return () => clearTimeout(timer); }, [notice]);
  function navigate(next: View) {
    if (next === view || publishing) return;
    if (dirty && !window.confirm("Kaydedilmemiş değişiklikler var. Bu sayfadan ayrılmak istiyor musunuz?")) return;
    markDirty(false); setView(next); window.history.replaceState(null, "", `/admin/${next === "content" ? "" : `?view=${next}`}`);
  }
  async function logout() {
    if (publishing) return;
    if (dirty && !window.confirm("Kaydedilmemiş değişiklikler var. Çıkış yapılsın mı?")) return;
    setLeaving(true);
    try { await api("/api/admin/logout/", { method: "POST" }); markDirty(false); window.location.assign("/admin/"); } catch (error) { setNotice((error as Error).message); setLeaving(false); }
  }
  const items = [{ id: "content" as const, label: "Sayfalar", icon: FileText }, { id: "site" as const, label: "Site durumu", icon: Globe2 }];
  return <div className="ka-shell"><aside className="ka-sidebar"><a className="ka-brand" href="/" target="_blank" rel="noopener noreferrer"><img src={panelConfig.logo} alt={panelConfig.name} /></a><nav aria-label="Yönetim menüsü">{items.map(item => <button type="button" key={item.id} className={view === item.id ? "is-active" : ""} onClick={() => navigate(item.id)} aria-current={view === item.id ? "page" : undefined}><item.icon size={20} /><span>{item.label}</span><ChevronRight size={16} /></button>)}</nav><div className="ka-sidebar-bottom"><button className={view === "password" ? "is-active" : ""} onClick={() => navigate("password")} aria-current={view === "password" ? "page" : undefined}><KeyRound size={18} />Şifre değiştir</button><a href="/" target="_blank" rel="noopener noreferrer">Siteyi görüntüle<ArrowUpRight size={17} /></a><button onClick={logout} disabled={leaving}><LogOut size={18} />{leaving ? "Çıkış yapılıyor…" : "Çıkış yap"}</button></div></aside><main className="ka-workspace" id="admin-main"><header className="ka-topbar"><span>Yönetim paneli</span><span>{new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span></header>
    {view === "password" ? <PasswordSettings api={api} onDirty={markDirty} /> : view === "site" ? <SiteStatus /> : !cms ? <div className="ka-loading">{cmsError ? <><p className="ka-error" role="alert">{cmsError}</p><button className="ka-secondary" onClick={loadCms}>Tekrar dene</button></> : <><LoaderCircle className="ka-spin" /><p>İçerikler yükleniyor…</p></>}</div> : <><PublishingBar state={cms.state} api={api} locked={dirty} onState={state => setCms({ ...cms, state })} onBusy={setPublishing} onNotice={setNotice} /><div inert={publishing}><PageEditor key="content" {...cms} api={api} onState={state => setCms({ ...cms, state })} onDirty={markDirty} onNotice={setNotice} /></div></>}
  </main>{notice && <div className="ka-toast" role="status"><Check size={18} />{notice}<button onClick={() => setNotice("")} aria-label="Bildirimi kapat"><X size={16} /></button></div>}</div>;
}
