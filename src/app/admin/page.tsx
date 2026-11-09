import { session } from "@/lib/admin/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminPanel } from "@/components/admin/panel";
export const dynamic = "force-dynamic";
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ view?: string; passwordChanged?: string }> }) {
  const { view, passwordChanged } = await searchParams;
  let current;
  try { current = await session(); } catch { return <AdminLogin unavailable />; }
  if (!current) return <AdminLogin passwordChanged={passwordChanged === "1"} />;
  return <AdminPanel csrf={current.csrf} initialView={view === "content" || view === "media" || view === "password" || view === "site" ? view : "content"} />;
}
