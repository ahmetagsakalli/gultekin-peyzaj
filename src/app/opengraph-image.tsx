import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { business } from "@/lib/content";

export const alt = "Gültekin Peyzaj — Doğaya değer katarız. Samsun ve çevresi.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(
    path.join(process.cwd(), "src/fonts/playfair-display-regular.ttf"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#f7faf3",
        color: "#213c2d",
        padding: "60px 75px",
        fontFamily: "Playfair Display",
        border: "18px solid #e5eddd",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
        }}
      >
        <span>GÜLTEKİN PEYZAJ</span>
        <span style={{ color: "#657066" }}>Atakum / Samsun</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          letterSpacing: "-1px",
          lineHeight: 1.12,
        }}
      >
        <span>Doğaya</span>
        <span style={{ color: "#668555" }}>değer katarız.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 21,
        }}
      >
        <span>Peyzaj tasarımı · Bahçe bakımı · Budama</span>
        <span>{business.phone}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Playfair Display", data: font, style: "normal", weight: 400 }],
    },
  );
}
