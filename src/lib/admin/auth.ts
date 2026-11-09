import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { compare, hash as passwordHash } from "bcryptjs";
import { database } from "./db";
import { HttpError, sameOrigin } from "./http";
export const cookieName = "jp_admin_session";
export const sessionSeconds = 60 * 60 * 12;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
function secret() { if (!process.env.ADMIN_SESSION_SECRET) throw new Error("Session secret is missing"); return process.env.ADMIN_SESSION_SECRET; }
export async function rateLimit(request: Request, scope: string, maximum: number, seconds = 900) {
  const address = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const bucket = Math.floor(Date.now() / (seconds * 1000));
  const key = `${scope}:${createHmac("sha256", secret()).update(address).digest("hex")}:${bucket}`;
  const expires = new Date((bucket + 1) * seconds * 1000).toISOString();
  const sql = database();
  const rows = await sql`INSERT INTO jp_rate_limits (key, expires_at) VALUES (${key}, ${expires}) ON CONFLICT (key) DO UPDATE SET attempts = jp_rate_limits.attempts + 1 RETURNING attempts`;
  if (rows[0].attempts > maximum) throw new HttpError(429, "Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.");
}
export async function signIn(password: string) {
  const sql = database();
  const [credential] = await sql`SELECT password_hash, version FROM jp_admin_credentials WHERE id = 1`;
  if (!credential) throw new Error("Admin password is missing");
  if (!await compare(password, credential.password_hash)) {
    await sql`INSERT INTO jp_admin_events (event) VALUES ('login_failed')`;
    throw new HttpError(401, "Şifre doğru değil. Lütfen tekrar deneyin.");
  }
  const token = randomBytes(32).toString("hex");
  const csrf = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + sessionSeconds * 1000);
  const created = await sql`INSERT INTO jp_admin_sessions (token_hash, csrf, expires_at, credential_version) SELECT ${hash(token)}, ${csrf}, ${expires.toISOString()}, version FROM jp_admin_credentials WHERE id = 1 AND version = ${credential.version} RETURNING token_hash`;
  if (!created.length) throw new HttpError(409, "Şifre değiştirildi. Güncel şifrenizle tekrar giriş yapın.");
  await sql`DELETE FROM jp_admin_sessions WHERE expires_at < now()`;
  await sql`DELETE FROM jp_rate_limits WHERE expires_at < now()`;
  await sql`INSERT INTO jp_admin_events (event) VALUES ('login')`;
  return { token, expires };
}
export async function session() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const rows = await database()`SELECT s.csrf, s.expires_at FROM jp_admin_sessions s JOIN jp_admin_credentials c ON c.id = 1 AND c.version = s.credential_version WHERE s.token_hash = ${hash(token)} AND s.expires_at > now() LIMIT 1`;
  return rows[0] ? { csrf: rows[0].csrf as string, expiresAt: String(rows[0].expires_at) } : null;
}
export async function authorize(request?: Request, mutation = false) {
  const current = await session();
  if (!current) throw new HttpError(401, "Oturumunuz sona erdi. Yeniden giriş yapın.");
  if (request && mutation) {
    sameOrigin(request);
    const supplied = request.headers.get("x-csrf-token") || "";
    if (!/^[a-f0-9]{64}$/.test(supplied) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(current.csrf))) throw new HttpError(403, "Güvenlik doğrulaması yenilenmeli. Sayfayı yenileyin.");
  }
  return current;
}
export async function signOut() {
  const token = (await cookies()).get(cookieName)?.value;
  if (token) await database()`DELETE FROM jp_admin_sessions WHERE token_hash = ${hash(token)}`;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const sql = database();
  const [credential] = await sql`SELECT password_hash, version FROM jp_admin_credentials WHERE id = 1`;
  if (!credential || !await compare(currentPassword, credential.password_hash)) {
    await sql`INSERT INTO jp_admin_events (event) VALUES ('password_change_failed')`;
    throw new HttpError(422, "Mevcut şifreniz doğru değil.");
  }
  const nextHash = await passwordHash(newPassword, 12);
  // One atomic statement updates the credential and revokes every previous session.
  // The credential version also rejects a login racing with this change.
  const rows = await sql`WITH changed AS (
    UPDATE jp_admin_credentials SET password_hash = ${nextHash}, version = version + 1, updated_at = now()
    WHERE id = 1 AND version = ${credential.version} RETURNING version
  ), revoked AS (
    DELETE FROM jp_admin_sessions WHERE EXISTS (SELECT 1 FROM changed) RETURNING token_hash
  ), logged AS (
    INSERT INTO jp_admin_events (event) SELECT 'password_changed' FROM changed
  ) SELECT version FROM changed`;
  if (!rows.length) throw new HttpError(409, "Şifre başka bir pencerede değiştirildi. Yeniden giriş yapın.");
}
