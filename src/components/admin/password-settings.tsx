"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";
import { passwordChangeSchema } from "@/lib/admin/password-validation";

export function PasswordSettings({ api, onDirty }: {
  api: <T>(path: string, options?: RequestInit) => Promise<T>;
  onDirty: (value: boolean) => void;
}) {
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dirty = Object.values(values).some(Boolean);
  useEffect(() => { onDirty(dirty); }, [dirty, onDirty]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = passwordChangeSchema.safeParse(values);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setBusy(true); setError("");
    try {
      await api("/api/admin/password/", { method: "POST", body: JSON.stringify(parsed.data) });
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onDirty(false);
      window.location.replace("/admin/?passwordChanged=1");
    } catch (error) { setError((error as Error).message); setBusy(false); }
  }
  const fields = [
    { key: "currentPassword" as const, label: "Mevcut şifreniz", autoComplete: "current-password" },
    { key: "newPassword" as const, label: "Yeni şifreniz", autoComplete: "new-password" },
    { key: "confirmPassword" as const, label: "Yeni şifreniz tekrar", autoComplete: "new-password" },
  ];
  return <div className="ka-page">
    <div className="ka-page-heading"><div><h1>Şifre değiştir</h1><p>Panele erişiminizi güvenle güncelleyin.</p></div></div>
    <form className="ka-security-card" onSubmit={submit}>
      <div className="ka-security-icon"><KeyRound size={24} /></div>
      <h2>Yeni bir şifre belirleyin.</h2>
      <p className="ka-help" id="password-help">En az 10 karakter kullanın. Değişiklikten sonra tüm oturumlar kapanır; yeni şifrenizle tekrar giriş yaparsınız.</p>
      {fields.map(field => <div className="ka-security-field" key={field.key}>
        <label htmlFor={field.key}>{field.label}</label>
        <div className="ka-password"><input id={field.key} name={field.key} type={visible[field.key] ? "text" : "password"} autoComplete={field.autoComplete} maxLength={72} required disabled={busy} value={values[field.key]} aria-describedby="password-help" onChange={event => setValues({ ...values, [field.key]: event.target.value })} />
          <button type="button" aria-label={`${field.label} ${visible[field.key] ? "gizle" : "göster"}`} aria-pressed={!!visible[field.key]} disabled={busy} onClick={() => setVisible({ ...visible, [field.key]: !visible[field.key] })}>{visible[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
      </div>)}
      {error && <p className="ka-error" role="alert">{error}</p>}
      <button type="submit" className="ka-primary ka-wide" disabled={busy || !dirty}>{busy ? <LoaderCircle size={18} className="ka-spin" /> : <KeyRound size={18} />}{busy ? "Güncelleniyor…" : "Şifreyi güncelle"}</button>
    </form>
  </div>;
}
