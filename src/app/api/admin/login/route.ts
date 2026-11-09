import { cookieName, rateLimit, sessionSeconds, signIn } from "@/lib/admin/auth";
import { apiError, HttpError, json, readJson, sameOrigin } from "@/lib/admin/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit(request, "login", 8);
    const body = await readJson(request, 1024);
    if (typeof body.password !== "string" || !body.password || Buffer.byteLength(body.password) > 72) throw new HttpError(400, "Şifrenizi yazın.");
    const result = await signIn(body.password);
    const response = json({ ok: true });
    response.cookies.set(cookieName, result.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: sessionSeconds, expires: result.expires });
    return response;
  } catch (error) { return apiError(error); }
}
