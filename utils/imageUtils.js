const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
// Function to compare images (after resizing them)
async function compareImages(baseImagePath, compareImagePath, width = 500, height = 500) {
  // Resize both images to the same size
  const baseImage = await sharp(baseImagePath)
    .resize(width, height)
    .raw()
    .toBuffer();

  const compareImage = await sharp(compareImagePath)
    .resize(width, height)
    .raw()
    .toBuffer();

  // Compare the images (simple pixel-wise comparison)
  const diff = await sharp(baseImage)
    .composite([{ input: compareImage, blend: 'difference' }])
    .raw()
    .toBuffer();

  // Calculate the number of differing pixels
  const diffPixels = diff.readUInt32BE(0);
  const threshold = 0.05; // 5% difference threshold
  const totalPixels = diffPixels.length;
  const diffCount = diffPixels.filter(pixel => pixel > threshold).length;

  return diffCount / totalPixels > threshold ? { match: true, boundingBox: diffPixels } : { match: false };
}

// Function to resize the canvas image (if needed) and save it
async function resizeCanvasImage(inputPath, outputPath, width, height) {
  // Ensure the directory exists for saving the resized image
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await sharp(inputPath)
    .resize(width, height)
    .toFile(outputPath, (err, info) => {
      if (err) throw err;
      console.log(`Resized image saved to ${outputPath}`);
    });
}

module.exports = { compareImages, resizeCanvasImage };
