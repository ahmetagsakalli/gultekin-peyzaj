import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ authorize:vi.fn(), publish:vi.fn(), discard:vi.fn(), restore:vi.fn(), history:vi.fn(), path:vi.fn(), tag:vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("../../src/lib/admin/auth", () => ({ authorize: mocks.authorize }));
vi.mock("../../src/lib/admin/drafts", () => ({ publishDraft:mocks.publish, discardDraft:mocks.discard, restoreDraft:mocks.restore, listHistory:mocks.history }));
vi.mock("next/cache", () => ({ revalidatePath:mocks.path, revalidateTag:mocks.tag }));
import { GET, POST } from "../../src/app/api/admin/publishing/route";
import { HttpError } from "../../src/lib/admin/http";
const request = (body: object) => new Request("https://example.com/api/admin/publishing/", { method: "POST", headers: { "content-type":"application/json" }, body: JSON.stringify(body) });
beforeEach(() => { vi.clearAllMocks(); mocks.authorize.mockResolvedValue({}); mocks.publish.mockResolvedValue({version:2}); mocks.discard.mockResolvedValue({version:2}); mocks.restore.mockResolvedValue({version:2}); mocks.history.mockResolvedValue([]); });
describe("Publishing API", () => {
 it("requires authorization for private history and CSRF authorization for changes", async () => {
  mocks.authorize.mockRejectedValue(new HttpError(401,"Giriş yapın.")); expect((await GET()).status).toBe(401); expect(mocks.history).not.toHaveBeenCalled();
  const req=request({action:"publish",version:1}); expect((await POST(req)).status).toBe(401); expect(mocks.authorize).toHaveBeenLastCalledWith(req,true); expect(mocks.publish).not.toHaveBeenCalled();
 });
 it("only invalidates the public site after publishing", async () => {
  expect((await POST(request({action:"restore",version:1,id:"3"}))).status).toBe(200); expect(mocks.tag).not.toHaveBeenCalled();
  expect((await POST(request({action:"discard",version:2}))).status).toBe(200); expect(mocks.tag).not.toHaveBeenCalled();
  expect((await POST(request({action:"publish",version:3}))).status).toBe(200); expect(mocks.publish).toHaveBeenCalledWith(3); expect(mocks.tag).toHaveBeenCalledWith("junior-panel-content",{expire:0});
 });
 it("rejects arbitrary snapshots and invalid history IDs", async () => {
  expect((await POST(request({action:"restore",version:1,id:"-1"}))).status).toBe(422);
  expect((await POST(request({action:"publish",version:1,snapshot:{}}))).status).toBe(422); expect(mocks.publish).not.toHaveBeenCalled();
 });
 it("does not invalidate or replace content on conflict", async () => {
  mocks.publish.mockRejectedValue(new HttpError(409,"Paneli yenileyin.")); expect((await POST(request({action:"publish",version:1}))).status).toBe(409); expect(mocks.tag).not.toHaveBeenCalled();
 });
});
