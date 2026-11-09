import { authorize, changePassword, cookieName, rateLimit } from "@/lib/admin/auth";
import { apiError, HttpError, json, readJson } from "@/lib/admin/http";
import { passwordChangeSchema } from "@/lib/admin/password-validation";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await authorize(request, true);
    await rateLimit(request, "password-change", 5);
    const parsed = passwordChangeSchema.safeParse(await readJson(request, 2048));
    if (!parsed.success) throw new HttpError(422, parsed.error.issues[0].message);
    await changePassword(parsed.data.currentPassword, parsed.data.newPassword);
    const response = json({ ok: true });
    response.cookies.set(cookieName, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    return response;
  } catch (error) { return apiError(error); }
}
