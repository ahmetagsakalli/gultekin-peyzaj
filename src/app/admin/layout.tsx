import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./admin.css";
export const metadata: Metadata = { title: "Yönetim paneli", robots: { index: false, follow: false, nocache: true }, alternates: { canonical: null } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="jp-admin">{children}</div>; }
