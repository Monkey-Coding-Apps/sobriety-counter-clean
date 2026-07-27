const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const wwwDir = path.join(__dirname, 'www');
  const resDir = path.join(__dirname, 'app', 'src', 'main', 'res');

  const sourceIcon = path.join(wwwDir, 'icon.png');
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon www/icon.png not found!');
    process.exit(1);
  }

  // Generate web icons
  await sharp(sourceIcon)
    .resize(192, 192)
    .toFile(path.join(wwwDir, 'icon-192.png'));

  await sharp(sourceIcon)
    .resize(32, 32)
    .toFile(path.join(wwwDir, 'favicon.png'));

  // Android mipmap sizes for launcher icons
  const mipmapSizes = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const item of mipmapSizes) {
    const dirPath = path.join(resDir, item.dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    await sharp(sourceIcon)
      .resize(item.size, item.size)
      .toFile(path.join(dirPath, 'ic_launcher.png'));

    await sharp(sourceIcon)
      .resize(item.size, item.size)
      .toFile(path.join(dirPath, 'ic_launcher_round.png'));
  }

  // Android adaptive icon foreground drawables (API 26+)
  const drawableSizes = [
    { dir: 'drawable-mdpi', size: 108 },
    { dir: 'drawable-hdpi', size: 162 },
    { dir: 'drawable-xhdpi', size: 216 },
    { dir: 'drawable-xxhdpi', size: 324 },
    { dir: 'drawable-xxxhdpi', size: 432 },
  ];

  for (const item of drawableSizes) {
    const dirPath = path.join(resDir, item.dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    await sharp(sourceIcon)
      .resize(item.size, item.size)
      .toFile(path.join(dirPath, 'ic_launcher_foreground.png'));
  }

  // If old vector xml foreground exists, remove it so PNG drawables take effect
  const oldXmlForeground = path.join(resDir, 'drawable', 'ic_launcher_foreground.xml');
  if (fs.existsSync(oldXmlForeground)) {
    fs.unlinkSync(oldXmlForeground);
  }

  console.log('Successfully generated all icon assets from www/icon.png!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

