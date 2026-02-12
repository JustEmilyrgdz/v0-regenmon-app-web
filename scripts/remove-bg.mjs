import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const PUBLIC_DIR = join(process.cwd(), "public");

const files = ["regenmon-green.jpg", "regenmon-brown.jpg", "regenmon-black.jpg"];

for (const file of files) {
  const inputPath = join(PUBLIC_DIR, file);
  const outputPath = join(PUBLIC_DIR, file.replace(".jpg", ".png"));

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  // Get raw pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 4 (RGBA)

  // Process each pixel: if it's close to white/light gray, make it transparent
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate brightness
    const brightness = (r + g + b) / 3;

    // Check if pixel is near-white or very light (background)
    // Also check for low saturation (gray-ish tones that are part of background)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (brightness > 200 && saturation < 0.15) {
      // Make fully transparent
      data[i + 3] = 0;
    } else if (brightness > 180 && saturation < 0.1) {
      // Semi-transparent for edge blending
      data[i + 3] = Math.round(((200 - brightness) / 20) * 255);
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toFile(outputPath);

  console.log(`Processed: ${file} -> ${file.replace(".jpg", ".png")}`);
}

console.log("Done! All backgrounds removed.");
