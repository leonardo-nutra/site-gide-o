import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "public", "images", "ofertas");
const outDir = path.join(srcDir, "crop");
fs.mkdirSync(outDir, { recursive: true });

const files = ["piso-1", "piso-2", "piso-3", "piso-4", "piso-5", "piso-6", "piso-7", "piso-9"];

const region = { left: 650, top: 820, width: 1000, height: 1000 };

for (const file of files) {
  const input = path.join(srcDir, `${file}.jpeg`);
  const output = path.join(outDir, `${file}.jpg`);
  await sharp(input)
    .extract(region)
    .resize(800, 800)
    .jpeg({ quality: 88 })
    .toFile(output);
  console.log("cropped", file);
}
