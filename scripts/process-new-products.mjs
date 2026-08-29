import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const downloads = "C:/Users/leofe/Downloads";
const outDir = path.join(process.cwd(), "public/images/produtos");
fs.mkdirSync(outDir, { recursive: true });

// [source file, output id, whether it has a burned-in text caption to crop out]
const files = [
  ["ChatGPT Image 28 de ago. de 2026, 22_53_44.png", "piso-1", false],
  ["ChatGPT Image 28 de ago. de 2026, 22_53_57.png", "piso-9", true],
  ["ChatGPT Image 28 de ago. de 2026, 22_54_08.png", "piso-4", false],
  ["ChatGPT Image 28 de ago. de 2026, 22_54_19.png", "piso-2", true],
  ["ChatGPT Image 28 de ago. de 2026, 22_54_28.png", "piso-5", true],
  ["ChatGPT Image 28 de ago. de 2026, 22_54_43.png", "piso-7", true],
  ["ChatGPT Image 28 de ago. de 2026, 22_54_53.png", "piso-6", true],
  ["ChatGPT Image 28 de ago. de 2026, 22_56_00.png", "piso-3", true],
];

(async () => {
  for (const [src, id, hasCaption] of files) {
    const input = path.join(downloads, src);
    const meta = await sharp(input).metadata();
    const cropHeight = hasCaption ? Math.round(meta.height * 0.84) : meta.height;
    await sharp(input)
      .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
      .resize(1000, 1000, { fit: "cover", position: "top" })
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `${id}.jpg`));
    console.log("done", id);
  }
})();
