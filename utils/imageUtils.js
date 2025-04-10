const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
async function compareImages(baseImagePath, compareImagePath, width = 500, height = 500) {
  const baseImage = await sharp(baseImagePath)
    .resize(width, height)
    .raw()
    .toBuffer();
  const compareImage = await sharp(compareImagePath)
    .resize(width, height)
    .raw()
    .toBuffer();
  const diff = await sharp(baseImage)
    .composite([{ input: compareImage, blend: 'difference' }])
    .raw()
    .toBuffer();
  const diffPixels = diff.readUInt32BE(0);
  const threshold = 0.05;
  const totalPixels = diffPixels.length;
  const diffCount = diffPixels.filter(pixel => pixel > threshold).length;
  return diffCount / totalPixels > threshold ? { match: true, boundingBox: diffPixels } : { match: false };
}
async function resizeCanvasImage(inputPath, outputPath, width, height) {
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
