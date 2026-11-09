import "server-only";
import { NextResponse } from "next/server";
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store, max-age=0", ...headers } });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !URL.canParse(origin) || new URL(origin).host !== host || request.headers.get("sec-fetch-site") === "cross-site") throw new HttpError(403, "Bu işlem için sayfayı yeniden açın.");
}
export async function readJson(request: Request, maxBytes = 200_000) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "Geçersiz istek biçimi.");
  if (Number(request.headers.get("content-length")) > maxBytes) throw new HttpError(413, "İstek çok büyük.");
  const text = await request.text();
  if (Buffer.byteLength(text) > maxBytes) throw new HttpError(413, "İstek çok büyük.");
  try { return JSON.parse(text); } catch { throw new HttpError(400, "İstek okunamadı."); }
}
export function apiError(error: unknown) {
  if (error instanceof HttpError) return json({ error: error.message }, error.status, error.status === 429 ? { "Retry-After": "900" } : {});
  // Never log request bodies, contact information, credentials or database URLs.
  console.error("Junior Panel API operation failed", error instanceof Error ? error.name : "UnknownError");
  return json({ error: "İşlem tamamlanamadı. Lütfen biraz sonra tekrar deneyin." }, 503);
}
