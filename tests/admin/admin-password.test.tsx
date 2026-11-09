import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { passwordChangeSchema } from "../../src/lib/admin/password-validation";
import { PasswordSettings } from "../../src/components/admin/password-settings";

describe("Password settings", () => {
  it("rejects a short password, mismatch, reuse and bcrypt byte truncation", () => {
    const valid = { currentPassword: "Old-test-secret", newPassword: "New-test-secret", confirmPassword: "New-test-secret" };
    expect(passwordChangeSchema.safeParse(valid).success).toBe(true);
    for (const change of [{newPassword:"short",confirmPassword:"short"},{confirmPassword:"different-secret"},{newPassword:valid.currentPassword,confirmPassword:valid.currentPassword},{newPassword:"ğ".repeat(37),confirmPassword:"ğ".repeat(37)}]) expect(passwordChangeSchema.safeParse({...valid,...change}).success).toBe(false);
  });
  it("does not call the server for mismatched passwords", () => {
    const api = vi.fn();render(<PasswordSettings api={api} onDirty={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Mevcut şifreniz", {exact:true}), {target:{value:"Old-test-secret"}});
    fireEvent.change(screen.getByLabelText("Yeni şifreniz", {exact:true}), {target:{value:"New-test-secret"}});
    fireEvent.change(screen.getByLabelText("Yeni şifreniz tekrar", {exact:true}), {target:{value:"Different-secret"}});
    fireEvent.click(screen.getByRole("button",{name:"Şifreyi güncelle"}));
    expect(screen.getByRole("alert").textContent).toBe("Yeni şifreler eşleşmiyor.");expect(api).not.toHaveBeenCalled();
  });
  it("shows a server rejection and allows correcting the inputs", async () => {
    const api=vi.fn().mockRejectedValue(new Error("Mevcut şifreniz doğru değil."));render(<PasswordSettings api={api} onDirty={vi.fn()} />);
    for(const [label,value] of [["Mevcut şifreniz","Old-test-secret"],["Yeni şifreniz","New-test-secret"],["Yeni şifreniz tekrar","New-test-secret"]]) fireEvent.change(screen.getByLabelText(label,{exact:true}),{target:{value}});
    fireEvent.click(screen.getByRole("button",{name:"Şifreyi güncelle"}));
    expect((await screen.findByRole("alert")).textContent).toBe("Mevcut şifreniz doğru değil.");
    expect((screen.getByLabelText("Yeni şifreniz",{exact:true}) as HTMLInputElement).disabled).toBe(false);
  });
});
