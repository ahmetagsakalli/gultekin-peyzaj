import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authorize } from "@/lib/admin/auth";
import { discardDraft, listHistory, publishDraft, restoreDraft } from "@/lib/admin/drafts";
import { apiError, HttpError, json, readJson } from "@/lib/admin/http";
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("publish"), version: z.number().int().positive() }).strict(),
  z.object({ action: z.literal("discard"), version: z.number().int().positive() }).strict(),
  z.object({ action: z.literal("restore"), version: z.number().int().positive(), id: z.string().regex(/^[1-9][0-9]{0,17}$/) }).strict(),
]);
export async function GET() {
  try { await authorize(); return json({ history: await listHistory() }); } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    await authorize(request, true);
    const parsed = schema.safeParse(await readJson(request, 2048));
    if (!parsed.success) throw new HttpError(422, "İşlem bilgilerini kontrol edin.");
    const data = parsed.data;
    const state = data.action === "publish" ? await publishDraft(data.version) : data.action === "discard" ? await discardDraft(data.version) : await restoreDraft(data.id, data.version);
    if (data.action === "publish") { revalidateTag("junior-panel-content", { expire: 0 }); revalidatePath("/", "layout"); revalidatePath("/blog/[slug]", "page"); revalidatePath("/sitemap.xml"); }
    return json({ state });
  } catch (error) { return apiError(error); }
}
