import sharp from "sharp";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(root, "../../work/assets");
const destination = path.join(root, "public/images");
await mkdir(destination, { recursive: true });
const assets = [
  { name: "hero", width: 1920 },
  { name: "garden-poster", width: 1920, extension: "png" },
  { name: "garden-poster-mobile", width: 608, extension: "png" },
  { name: "garden", width: 1200 },
  { name: "lawn", width: 1200 },
  { name: "pruning", width: 1200 },
  { name: "trees", width: 1200 },
  { name: "mowing", width: 1200 },
  { name: "watering", width: 1200 },
  { name: "soil", width: 1200 },
  { name: "autumn", width: 1200 },
  { name: "pruning-action", width: 1200 },
];
const report = [];
for (const { name, width, extension = "jpg" } of assets) {
  const original = path.join(source, `${name}.${extension}`);
  const output = path.join(destination, `${name}.webp`);
  const info = await sharp(original)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);
  report.push({
    file: `${name}.webp`,
    width: info.width,
    height: info.height,
    bytes: info.size,
    originalBytes: (await stat(original)).size,
  });
}
const logoSource = path.join(source, "logo.png");
await sharp(logoSource)
  .trim({ threshold: 12 })
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(destination, "logo.webp"));
await mkdir(path.join(root, "docs"), { recursive: true });
await writeFile(
  path.join(root, "docs/image-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
await writeFile(
  path.join(root, "docs/image-sources.json"),
  await readFile(path.join(source, "sources.json")),
);
console.table(report);
