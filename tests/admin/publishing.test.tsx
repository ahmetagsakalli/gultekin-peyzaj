import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PublishingBar } from "../../src/components/admin/publishing-bar";
import { emptyCms } from "../../src/lib/cms-shared";
const draft = { ...emptyCms, version: 4, draft: { hasChanges: true, publishedVersion: 9, outdated: false, updatedAt: "2026-10-13T10:00:00Z" } };
const props = () => ({ state: draft, locked: false, api: vi.fn(), onState: vi.fn(), onBusy: vi.fn(), onNotice: vi.fn() });
beforeEach(() => { HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); }; vi.spyOn(window, "confirm").mockReturnValue(true); });
describe("Draft publishing controls", () => {
 it("publishes only after confirmation and sends the current version", async () => {
  const p = props(); p.api.mockResolvedValue({ state: { ...draft, version: 5 } }); render(<PublishingBar {...p} />);
  fireEvent.click(screen.getByRole("button", { name: "Yayınla" })); expect(p.api).not.toHaveBeenCalled(); fireEvent.click(screen.getByRole("button", { name: "Vazgeç" }));
  fireEvent.click(screen.getByRole("button", { name: "Yayınla" })); fireEvent.click(screen.getByRole("button", { name: "Onayla" })); await waitFor(() => expect(p.onState).toHaveBeenCalled());
  expect(JSON.parse(p.api.mock.calls[0][1].body)).toEqual({ action: "publish", version: 4 }); expect(p.onNotice).toHaveBeenCalledWith("Değişiklikler yayınlandı.");
 });
 it("disables publication while a field is being edited or no draft changes exist", () => {
  const p = props(); const { rerender } = render(<PublishingBar {...p} locked />);
  expect((screen.getByRole("button", {name:"Yayınla"}) as HTMLButtonElement).disabled).toBe(true);
  rerender(<PublishingBar {...p} state={{ ...draft, draft: { ...draft.draft, hasChanges: false } }} />);
  expect((screen.getByRole("button", {name:"Yayınla"}) as HTMLButtonElement).disabled).toBe(true);
 });
 it("restores history into a draft, without publishing it", async () => {
  const p = props(); p.api.mockResolvedValueOnce({ history: [{ id: "3", kind: "published", label: "Yayınlandı", version: 8, createdAt: "2026-10-13T09:00:00Z" }] }).mockResolvedValueOnce({ state: { ...draft, version: 5 } });
  render(<PublishingBar {...p} />); fireEvent.click(screen.getByRole("button",{name:"Geçmiş"}));
  fireEvent.click(await screen.findByRole("button",{name:"Taslağa al"})); fireEvent.click(screen.getByRole("button",{name:"Onayla"})); await waitFor(() => expect(p.onState).toHaveBeenCalled());
  expect(JSON.parse(p.api.mock.calls[1][1].body)).toEqual({action:"restore",version:4,id:"3"});
 });
 it("preserves current state when discard is rejected by a stale version", async () => {
  const p = props(); p.api.mockRejectedValue(new Error("İçerik başka bir pencerede değişti.")); render(<PublishingBar {...p} />);
  fireEvent.click(screen.getByRole("button",{name:"Taslağı kaldır"})); fireEvent.click(screen.getByRole("button",{name:"Onayla"})); expect((await screen.findByRole("alert")).textContent).toContain("başka bir pencerede"); expect(p.onState).not.toHaveBeenCalled(); expect(p.onBusy).toHaveBeenLastCalledWith(false);
 });
});
