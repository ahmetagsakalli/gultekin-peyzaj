"use client";
import { panelConfig } from "@/lib/panel-config";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
export function AdminLogin({ unavailable = false, passwordChanged = false }: { unavailable?: boolean; passwordChanged?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(unavailable ? "Bağlantı şu anda kurulamadı. Lütfen tekrar deneyin." : "");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") || "");
    if (!password) { setError("Şifrenizi yazın."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login/", { method: "POST", signal: AbortSignal.timeout(25000), headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Giriş yapılamadı.");
      window.location.assign("/admin/");
    } catch (error) { setError(error instanceof Error && !["AbortError", "TimeoutError", "TypeError"].includes(error.name) ? error.message : "Bağlantı kurulamadı. Lütfen tekrar deneyin."); setBusy(false); }
  }
  return <main className="ka-login">
    <div className="ka-login-visual"><img className="ka-login-photo" src={panelConfig.loginImage} alt="" /><div className="ka-login-shade" /><a href="/" className="ka-login-brand"><img src={panelConfig.logo} alt={panelConfig.name} /></a><div className="ka-login-caption"><p>{panelConfig.loginCaption}</p><span>Alanınıza hoş geldiniz.</span></div></div>
    <div className="ka-login-side"><a href="/" className="ka-mobile-brand"><img src={panelConfig.logo} alt={panelConfig.name} /></a><form className="ka-login-form" onSubmit={submit}>
      <h1>Yönetim paneli</h1><p className="ka-login-description">Sitenizi tek bir yerden yönetin.</p>
      {passwordChanged && <p className="ka-success" role="status">Şifreniz güncellendi. Yeni şifrenizle giriş yapın.</p>}
      <label htmlFor="admin-password">Şifreniz</label><div className="ka-password"><input id="admin-password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" maxLength={128} autoFocus required aria-invalid={!!error} aria-describedby={error ? "login-error" : undefined} disabled={busy} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"} aria-pressed={visible}>{visible ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
      {error && <p className="ka-error" id="login-error" role="alert">{error}</p>}
      <button className="ka-primary ka-login-submit" type="submit" disabled={busy}>{busy ? "Giriş yapılıyor…" : "Panele giriş yapın"}{busy ? <LoaderCircle className="ka-spin" size={19} /> : <ArrowRight size={19} />}</button>
      <a href="/" className="ka-back-site">Siteye dönün<ArrowUpRight size={15} /></a>
    </form><span className="ka-login-footer">{panelConfig.name} © {new Date().getFullYear()}</span></div>
  </main>;
}
