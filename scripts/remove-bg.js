import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const files = ["regenmon-green", "regenmon-brown", "regenmon-black"];

async function removeBg(name) {
  const inputPath = path.join(publicDir, `${name}.jpg`);
  const outputPath = path.join(publicDir, `${name}.png`);

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  const raw = await image.ensureAlpha().raw().toBuffer();

  const threshold = 220;
  const edgeFade = 30;

  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i];
    const g = raw[i + 1];
    const b = raw[i + 2];

    if (r > threshold && g > threshold && b > threshold) {
      raw[i + 3] = 0;
    } else if (r > (threshold - edgeFade) && g > (threshold - edgeFade) && b > (threshold - edgeFade)) {
      const avgDist = ((threshold - r) + (threshold - g) + (threshold - b)) / 3;
      const alpha = Math.min(255, Math.round((avgDist / edgeFade) * 255));
      raw[i + 3] = alpha;
    }
  }

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log(`Done: ${name}.jpg -> ${name}.png (${width}x${height})`);
}

async function main() {
  for (const name of files) {
    await removeBg(name);
  }
  console.log("All images processed successfully!");
}

main().catch(console.error);
