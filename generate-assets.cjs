const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create the exact SVG logo based on user's image
// 512x512 Canvas
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <style>
      .bg { fill: #FFFFFF; }
      .lotus-line { fill: none; stroke: #A8B8E8; stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; }
      .navy-s { font-family: 'Times New Roman', Georgia, serif; font-weight: bold; font-size: 295px; fill: #16284F; }
      .navy-c { font-family: 'Times New Roman', Georgia, serif; font-weight: bold; font-size: 295px; fill: #16284F; stroke: #FFFFFF; stroke-width: 7px; paint-order: stroke fill; stroke-linejoin: round; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" class="bg" />

  <!-- Lotus Flower Petals (Symmetrical vector geometry) -->
  <g class="lotus-line">
    <!-- Center Top Petal -->
    <path d="M 256,70 C 218,150 218,300 256,365 C 294,300 294,150 256,70 Z" />

    <!-- Upper Inner Petals -->
    <path d="M 256,365 C 210,240 128,130 132,105 C 172,125 224,220 256,365 Z" />
    <path d="M 256,365 C 302,240 384,130 380,105 C 340,125 288,220 256,365 Z" />

    <!-- Upper Outer Petals -->
    <path d="M 256,365 C 185,260 65,180 70,150 C 118,170 205,250 256,365 Z" />
    <path d="M 256,365 C 327,260 447,180 442,150 C 394,170 307,250 256,365 Z" />

    <!-- Side Mid Petals -->
    <path d="M 256,365 C 150,290 22,215 18,180 C 72,195 182,270 256,365 Z" />
    <path d="M 256,365 C 362,290 490,215 494,180 C 440,195 330,270 256,365 Z" />

    <!-- Side Lower Petals -->
    <path d="M 256,365 C 130,330 15,310 12,270 C 65,285 170,330 256,365 Z" />
    <path d="M 256,365 C 382,330 497,310 500,270 C 447,285 342,330 256,365 Z" />

    <!-- Lower Wide Petals -->
    <path d="M 256,365 C 145,360 20,365 15,335 C 75,365 175,370 256,365 Z" />
    <path d="M 256,365 C 367,360 492,365 497,335 C 437,365 337,370 256,365 Z" />

    <!-- Bottom Outer Petals -->
    <path d="M 256,365 C 160,390 55,410 50,380 C 105,415 185,410 256,365 Z" />
    <path d="M 256,365 C 352,390 457,410 462,380 C 407,415 327,410 256,365 Z" />

    <!-- Bottom Drop Petals -->
    <path d="M 256,365 C 190,410 125,435 128,420 C 168,442 215,425 256,365 Z" />
    <path d="M 256,365 C 322,410 387,435 384,420 C 344,442 297,425 256,365 Z" />

    <!-- Bottom Center Tip -->
    <path d="M 256,365 C 220,420 195,445 256,452 C 317,445 292,420 256,365 Z" />
  </g>

  <!-- Foreground SC Monogram -->
  <text x="120" y="365" class="navy-s">S</text>
  <text x="210" y="365" class="navy-c">C</text>
</svg>`;

async function generate() {
  const wwwDir = path.join(__dirname, 'www');
  const resDir = path.join(__dirname, 'app', 'src', 'main', 'res');

  fs.writeFileSync(path.join(wwwDir, 'icon.svg'), svgContent);

  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .toFile(path.join(wwwDir, 'icon.png'));

  await sharp(Buffer.from(svgContent))
    .resize(192, 192)
    .toFile(path.join(wwwDir, 'icon-192.png'));

  await sharp(Buffer.from(svgContent))
    .resize(32, 32)
    .toFile(path.join(wwwDir, 'favicon.png'));

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
    await sharp(Buffer.from(svgContent))
      .resize(item.size, item.size)
      .toFile(path.join(dirPath, 'ic_launcher.png'));

    await sharp(Buffer.from(svgContent))
      .resize(item.size, item.size)
      .toFile(path.join(dirPath, 'ic_launcher_round.png'));
  }

  console.log('Successfully generated all icon assets!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
