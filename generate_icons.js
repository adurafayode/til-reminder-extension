const sharp = require('sharp');
const fs = require('fs').promises;

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  const svgBuffer = await fs.readFile('icons/icon.svg');
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`icons/icon${size}.png`);
  }
}

generateIcons().catch(console.error); 