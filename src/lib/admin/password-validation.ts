import { z } from "zod";

const password = z.string().max(72).refine(value => new TextEncoder().encode(value).length <= 72, "Şifre en fazla 72 bayt olabilir.");
export const passwordChangeSchema = z.object({
  currentPassword: password.min(1, "Mevcut şifrenizi yazın."),
  newPassword: password.min(10, "Yeni şifreniz en az 10 karakter olmalı."),
  confirmPassword: password.min(1, "Yeni şifrenizi tekrar yazın."),
}).strict().refine(data => data.newPassword === data.confirmPassword, { path: ["confirmPassword"], message: "Yeni şifreler eşleşmiyor." })
  .refine(data => data.newPassword !== data.currentPassword, { path: ["newPassword"], message: "Yeni şifre mevcut şifrenizden farklı olmalı." });
