import { beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BlogEditor } from "../../src/components/admin/blog-editor";
import { emptyCms } from "../../src/lib/cms-shared";
beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:test-cover"); URL.revokeObjectURL = vi.fn();
  vi.spyOn(window, "confirm").mockReturnValue(false);
});
it("previews safely, retains edits after errors, and saves only to the draft API", async () => {
  const api = vi.fn().mockRejectedValueOnce(new Error("Bağlantı kurulamadı.")).mockResolvedValueOnce({ state: { ...emptyCms, version: 2 }, entry: { id: "saved-id" } });
  const onState = vi.fn(), onSaved = vi.fn(), onBack = vi.fn(), onDirty = vi.fn();
  render(<BlogEditor state={emptyCms} api={api} onState={onState} onSaved={onSaved} onBack={onBack} onDirty={onDirty} onNotice={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("Başlık"), { target: { value: "Yeni yazı" } });
  fireEvent.change(screen.getByLabelText("Yazı içeriği"), { target: { value: "İlk paragraf.\n\n<script>alert('test')</script>" } });
  fireEvent.change(screen.getByLabelText("Kapak görseli", { selector: "input" }), { target: { files: [new File(["image"], "cover.jpg", { type: "image/jpeg" })] } });
  fireEvent.click(screen.getByRole("button", { name: "Önizle" }));
  expect(screen.getByText("<script>alert('test')</script>")).toBeTruthy(); expect(document.querySelector("script")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Düzenlemeye dön" }));
  fireEvent.click(screen.getByRole("button", { name: "Taslağa kaydet" }));
  expect((await screen.findByRole("alert")).textContent).toContain("Bağlantı");
  expect((screen.getByLabelText("Başlık") as HTMLInputElement).value).toBe("Yeni yazı");
  fireEvent.click(screen.getByRole("button", { name: "Tüm sayfalar" })); expect(onBack).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Taslağa kaydet" }));
  await waitFor(() => expect(onSaved).toHaveBeenCalledWith("saved-id"));
  expect(api.mock.calls.every(call => call[0] === "/api/admin/blog/" && call[1].method === "POST")).toBe(true);
  expect(api.mock.calls[1][1].body.get("title")).toBe("Yeni yazı");
  expect(api.mock.calls[1][1].body.get("cover").name).toBe("cover.jpg");
  expect(onState).toHaveBeenCalledWith({ ...emptyCms, version: 2 });
});
it("requires a cover and rejects oversized files without saving", async () => {
  const api = vi.fn(); render(<BlogEditor state={emptyCms} api={api} onState={vi.fn()} onSaved={vi.fn()} onBack={vi.fn()} onDirty={vi.fn()} onNotice={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("Başlık"), { target: { value: "Yeni yazı" } });
  fireEvent.change(screen.getByLabelText("Yazı içeriği"), { target: { value: "Yazının ayrıntılı içeriği." } });
  fireEvent.click(screen.getByRole("button", { name: "Taslağa kaydet" }));
  expect((await screen.findByRole("alert")).textContent).toContain("kapak görseli");
  const file = new File(["x"], "large.jpg", { type: "image/jpeg" }); Object.defineProperty(file, "size", { value: 4_000_001 });
  fireEvent.change(screen.getByLabelText("Kapak görseli", { selector: "input" }), { target: { files: [file] } });
  expect(screen.getByRole("alert").textContent).toContain("4 MB"); expect(api).not.toHaveBeenCalled();
});
