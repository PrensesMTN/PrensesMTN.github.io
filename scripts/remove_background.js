import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function removeBackground() {
  const inputPath = path.resolve('public/mothership_concept.jpg');
  const outputPath = path.resolve('public/mothership_concept_nobg.png');

  console.log('Loading image:', inputPath);
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 3 (RGB)

  // Output will be RGBA (4 channels)
  const outputData = Buffer.alloc(width * height * 4);

  // We want to detect the space background.
  // The background starts from all 4 borders of the image.
  // Space background is dark cosmic space (mostly deep space navy/black).
  // Let's identify the background using a multi-pass flood fill from the borders,
  // plus color distance to background samples.

  // 1. Visited array for BFS flood fill
  const isBackground = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  // Helper to get RGB
  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  // Check if a pixel qualifies as outer space background
  // Cosmic background has very low brightness and no high saturation cyan/amber/green
  function isSpaceColor(r, g, b) {
    const maxVal = Math.max(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // Dark background pixels: lum < 42 and maxVal < 55
    if (lum < 40 && maxVal < 55) return true;
    // Also dark navy/gray background with maxVal < 65 if lum < 45
    if (lum < 32) return true;
    return false;
  }

  // Seed BFS queue from all border pixels that are dark/space
  for (let x = 0; x < width; x++) {
    // Top border
    let [r, g, b] = getPixel(x, 0);
    if (isSpaceColor(r, g, b)) {
      isBackground[0 * width + x] = 1;
      queue[qTail++] = 0 * width + x;
    }
    // Bottom border
    [r, g, b] = getPixel(x, height - 1);
    if (isSpaceColor(r, g, b)) {
      isBackground[(height - 1) * width + x] = 1;
      queue[qTail++] = (height - 1) * width + x;
    }
  }

  for (let y = 0; y < height; y++) {
    // Left border
    let [r, g, b] = getPixel(0, y);
    if (isSpaceColor(r, g, b) && !isBackground[y * width + 0]) {
      isBackground[y * width + 0] = 1;
      queue[qTail++] = y * width + 0;
    }
    // Right border
    [r, g, b] = getPixel(width - 1, y);
    if (isSpaceColor(r, g, b) && !isBackground[y * width + (width - 1)]) {
      isBackground[y * width + (width - 1)] = 1;
      queue[qTail++] = y * width + (width - 1);
    }
  }

  console.log('Seeded border pixels in queue:', qTail);

  // BFS expansion
  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // 4 neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isBackground[nIdx]) {
          const [nr, ng, nb] = getPixel(nx, ny);
          if (isSpaceColor(nr, ng, nb)) {
            isBackground[nIdx] = 1;
            queue[qTail++] = nIdx;
          }
        }
      }
    }
  }

  console.log('Total background pixels detected by BFS:', qTail, 'out of', width * height);

  // 2. Also check any isolated outer margin corners or edge stars that might have slight glow:
  // For pixels in top 80px or bottom 80px or left 60px or right 60px:
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!isBackground[idx]) {
        // If it's very far out near the image boundary and dark (lum < 50):
        if ((x < 50 || x > width - 50 || y < 60 || y > height - 60)) {
          const [r, g, b] = getPixel(x, y);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 48) {
            isBackground[idx] = 1;
          }
        }
      }
    }
  }

  // 3. Feathering / Anti-aliasing at the transition edge:
  // For each pixel, compute alpha:
  // If isBackground -> alpha = 0.
  // If not background, check distance to nearest background pixel to provide smooth edge (no harsh pixelation or dark fringe).
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const inIdx = pIdx * channels;
      const outIdx = pIdx * 4;

      const r = data[inIdx];
      const g = data[inIdx + 1];
      const b = data[inIdx + 2];

      if (isBackground[pIdx]) {
        outputData[outIdx] = 0;
        outputData[outIdx + 1] = 0;
        outputData[outIdx + 2] = 0;
        outputData[outIdx + 3] = 0; // Completely transparent!
      } else {
        // Check if on the border of background (within 1 pixel of background)
        let hasBgNeighbor = false;
        let bgCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBackground[ny * width + nx]) {
                hasBgNeighbor = true;
                bgCount++;
              }
            }
          }
        }

        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        let alpha = 255;

        if (hasBgNeighbor) {
          // Soft edge blending
          const factor = (8 - bgCount) / 8;
          alpha = Math.max(40, Math.min(255, Math.round(factor * 255 * (lum / 50))));
        }

        // Color defringing: remove dark background tint from semi-transparent edge pixels
        outputData[outIdx] = r;
        outputData[outIdx + 1] = g;
        outputData[outIdx + 2] = b;
        outputData[outIdx + 3] = alpha;
      }
    }
  }

  // Save the transparent PNG
  await sharp(outputData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log('Successfully saved transparent image to:', outputPath);

  // Also create a cropped/trimmed version if helpful
  const trimmed = await sharp(outputPath).trim().png().toBuffer();
  fs.writeFileSync(path.resolve('public/mothership_concept_trimmed.png'), trimmed);
  console.log('Successfully saved trimmed transparent image to public/mothership_concept_trimmed.png');
}

removeBackground().catch(err => {
  console.error(err);
  process.exit(1);
});
