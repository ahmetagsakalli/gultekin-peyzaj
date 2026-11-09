import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../assets/source/favicon-source.png", import.meta.url));
const app = new URL("../src/app/", import.meta.url);
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((size) => sharp(source).resize(size, size).ensureAlpha().png({ compressionLevel: 9 }).toBuffer()),
);

// ICO directory entries point to the individual PNG images at native tab sizes.
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  directory.writeUInt8(size, entry);
  directory.writeUInt8(size, entry + 1);
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(images[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
}

await writeFile(new URL("favicon.ico", app), Buffer.concat([directory, ...images]));
await sharp(source).resize(192, 192).png({ palette: true, colours: 128 }).toFile(fileURLToPath(new URL("icon.png", app)));
await sharp(source).resize(180, 180).png({ palette: true, colours: 128 }).toFile(fileURLToPath(new URL("apple-icon.png", app)));
console.log("Favicon: 16/32/48 px ICO, 192 px PNG, 180 px Apple icon.");
