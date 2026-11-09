import { authorize, cookieName, signOut } from "@/lib/admin/auth";
import { apiError, json } from "@/lib/admin/http";
export async function POST(request: Request) {
  try {
    await authorize(request, true);
    await signOut();
    const response = json({ ok: true });
    response.cookies.set(cookieName, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    return response;
  } catch (error) { return apiError(error); }
}
