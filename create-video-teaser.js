const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = 'materiais-fb4/video-teaser';
const FFMPEG = '/tmp/ffmpeg/ffmpeg';

const COLORS = {
  primary: '#1B365D',
  gold: '#C8963E',
  light: '#D9D9D9',
  white: '#FFFFFF',
  dark: '#0a0f1a',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

// Load assets
async function loadAssets() {
  const assets = {};
  const assetPaths = {
    bannerPrincipal: 'materiais-fb4/banners/banner-principal.png',
    bannerInformativo: 'materiais-fb4/banners/banner-informativo.png',
    social1sq: 'materiais-fb4/banners/social-post-1-square.png',
    social2sq: 'materiais-fb4/banners/social-post-2-square.png',
    social3sq: 'materiais-fb4/banners/social-post-3-square.png',
    social4sq: 'materiais-fb4/banners/social-post-4-square.png',
    estandarte1: 'materiais-fb4/estandartes/estandarte-1-tema.png',
    estandarte2: 'materiais-fb4/estandartes/estandarte-2-oradores.png',
    estandarte3: 'materiais-fb4/estandartes/estandarte-3-cta.png',
  };
  for (const [key, p] of Object.entries(assetPaths)) {
    try {
      assets[key] = await loadImage(p);
    } catch (e) {
      console.warn(`Could not load ${p}:`, e.message);
    }
  }
  return assets;
}

// Scene 1: Opening — Logo animation background
function createScene1(W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Deep blue gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.primary);
  grad.addColorStop(1, COLORS.dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle geometric gold lines
  ctx.strokeStyle = 'rgba(200, 150, 62, 0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < W; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }
  for (let i = 0; i < H; i += 80) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(W, i);
    ctx.stroke();
  }

  // Gold accent bar top
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, 0, W, 6);

  // Logo text
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.06)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('GRUPO CASTRO', W / 2, H * 0.38);

  ctx.fillStyle = COLORS.light;
  ctx.font = `${Math.floor(W * 0.03)}px sans-serif`;
  ctx.fillText('CONSULTORIAS', W / 2, H * 0.44);

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.floor(W * 0.025)}px sans-serif`;
  ctx.fillText('APRESENTA', W / 2, H * 0.54);

  // Bottom gold bar
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, H - 6, W, 6);

  ctx.textAlign = 'left';
  return canvas;
}

// Scene 2: The Problem
function createScene2(W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, COLORS.primary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Animated-looking dashed grid (restaurant metaphor)
  ctx.strokeStyle = 'rgba(201, 150, 62, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 60) {
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Title
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.045)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('GERIR UM NEGÓCIO DE RESTAURAÇÃO', W / 2, H * 0.25);
  ctx.fillText('EM ANGOLA NÃO É FÁCIL', W / 2, H * 0.32);

  // Keywords
  const keywords = ['CUSTOS', 'INVENTÁRIO', 'CLIENTES'];
  ctx.font = `bold ${Math.floor(W * 0.035)}px sans-serif`;
  const kwY = H * 0.55;
  const kwSpacing = W * 0.28;
  keywords.forEach((kw, i) => {
    const x = W / 2 + (i - 1) * kwSpacing;
    ctx.fillStyle = 'rgba(201, 150, 62, 0.2)';
    ctx.fillRect(x - kwSpacing * 0.35, kwY - W * 0.04, kwSpacing * 0.7, W * 0.08);
    ctx.fillStyle = COLORS.white;
    ctx.fillText(kw, x, kwY + W * 0.01);
  });

  ctx.fillStyle = COLORS.light;
  ctx.font = `${Math.floor(W * 0.022)}px sans-serif`;
  ctx.fillText('Quem é que tem tempo para pensar no futuro?', W / 2, H * 0.75);

  ctx.textAlign = 'left';
  return canvas;
}

// Scene 3: The Solution
function createScene3(W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, COLORS.primary);
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Tech grid
  ctx.strokeStyle = 'rgba(201, 150, 62, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 100) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }
  for (let i = 0; i < H; i += 100) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(W, i);
    ctx.stroke();
  }

  // Main text
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.055)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('F&B 4.0', W / 2, H * 0.3);

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.floor(W * 0.03)}px sans-serif`;
  ctx.fillText('A NOVA ERA DA GESTÃO', W / 2, H * 0.38);

  ctx.fillStyle = COLORS.light;
  ctx.font = `${Math.floor(W * 0.022)}px sans-serif`;
  wrapText(ctx, 'Inteligência Artificial ao alcance do seu negócio. Soluções simples, práticas e feitas à medida das PMEs angolanas.', W / 2 - W * 0.35, H * 0.52, W * 0.7, W * 0.035);

  // Equation
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.025)}px sans-serif`;
  ctx.fillText('IA + GESTÃO F&B = RESULTADOS REAIS', W / 2, H * 0.72);

  ctx.textAlign = 'left';
  return canvas;
}

// Scene 4: Speakers (placeholders)
function createScene4(W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(1, COLORS.primary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.strokeStyle = 'rgba(201, 150, 62, 0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W * 0.25, H * 0.45, W * 0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W * 0.75, H * 0.45, W * 0.12, 0, Math.PI * 2);
  ctx.stroke();

  // Left placeholder (Jorge Castro)
  ctx.fillStyle = 'rgba(201, 150, 62, 0.3)';
  ctx.beginPath();
  ctx.arc(W * 0.25, H * 0.4, W * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.light;
  ctx.font = `bold ${Math.floor(W * 0.08)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('JC', W * 0.25, H * 0.42);

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.floor(W * 0.022)}px sans-serif`;
  ctx.fillText('JORGE CASTRO', W * 0.25, H * 0.58);
  ctx.fillStyle = COLORS.gold;
  ctx.font = `${Math.floor(W * 0.018)}px sans-serif`;
  ctx.fillText('Especialista F&B', W * 0.25, H * 0.63);

  // Right placeholder (Ricardo Castro)
  ctx.fillStyle = 'rgba(201, 150, 62, 0.3)';
  ctx.beginPath();
  ctx.arc(W * 0.75, H * 0.4, W * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.light;
  ctx.font = `bold ${Math.floor(W * 0.08)}px sans-serif`;
  ctx.fillText('RC', W * 0.75, H * 0.42);

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.floor(W * 0.022)}px sans-serif`;
  ctx.fillText('RICARDO CASTRO', W * 0.75, H * 0.58);
  ctx.fillStyle = COLORS.gold;
  ctx.font = `${Math.floor(W * 0.018)}px sans-serif`;
  ctx.fillText('Director de Tecnologia', W * 0.75, H * 0.63);

  // Note
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `italic ${Math.floor(W * 0.015)}px serif`;
  ctx.fillText('[Fotos dos oradores em breve]', W / 2, H * 0.85);

  ctx.textAlign = 'left';
  return canvas;
}

// Scene 5: CTA
function createScene5(W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.primary);
  grad.addColorStop(1, COLORS.dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Gold frame
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 6;
  ctx.strokeRect(W * 0.05, H * 0.05, W * 0.9, H * 0.9);

  // Main title
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.075)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('F&B 4.0', W / 2, H * 0.3);

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.floor(W * 0.035)}px sans-serif`;
  ctx.fillText('A NOVA ERA DA GESTÃO', W / 2, H * 0.4);

  // Event details
  ctx.fillStyle = COLORS.light;
  ctx.font = `${Math.floor(W * 0.022)}px sans-serif`;
  ctx.fillText('10 de Setembro de 2026', W / 2, H * 0.55);
  ctx.fillText('Morro Bento Business Center, Luanda', W / 2, H * 0.6);
  ctx.fillText('09:00', W / 2, H * 0.65);

  // CTA
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.028)}px sans-serif`;
  ctx.fillText('VAGAS LIMITADAS', W / 2, H * 0.76);

  ctx.fillStyle = COLORS.white;
  ctx.font = `${Math.floor(W * 0.02)}px sans-serif`;
  ctx.fillText('www.grupocastro.co.ao', W / 2, H * 0.84);

  ctx.textAlign = 'left';
  return canvas;
}

// Scene 6: Closing
function createScene6(W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.dark);
  grad.addColorStop(1, COLORS.primary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Logo
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.06)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('GRUPO CASTRO', W / 2, H * 0.4);

  ctx.fillStyle = COLORS.light;
  ctx.font = `${Math.floor(W * 0.03)}px sans-serif`;
  ctx.fillText('CONSULTORIAS', W / 2, H * 0.47);

  // Hashtag
  ctx.fillStyle = COLORS.gold;
  ctx.font = `bold ${Math.floor(W * 0.04)}px sans-serif`;
  ctx.fillText('#F&B4ponto0', W / 2, H * 0.62);

  // Website
  ctx.fillStyle = COLORS.light;
  ctx.font = `${Math.floor(W * 0.022)}px sans-serif`;
  ctx.fillText('www.grupocastro.co.ao', W / 2, H * 0.75);

  ctx.textAlign = 'left';
  return canvas;
}

function savePNG(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buf);
  console.log('Created:', filename);
}

async function generateHorizontalFrames() {
  const W = 1920, H = 1080;
  const dir = `${OUT_DIR}/frames-16x9`;
  ensureDir(dir);

  console.log('Generating horizontal frames...');
  savePNG(createScene1(W, H), `${dir}/scene01.png`);
  savePNG(createScene2(W, H), `${dir}/scene02.png`);
  savePNG(createScene3(W, H), `${dir}/scene03.png`);
  savePNG(createScene4(W, H), `${dir}/scene04.png`);
  savePNG(createScene5(W, H), `${dir}/scene05.png`);
  savePNG(createScene6(W, H), `${dir}/scene06.png`);
}

async function generateVerticalFrames() {
  const W = 1080, H = 1920;
  const dir = `${OUT_DIR}/frames-9x16`;
  ensureDir(dir);

  console.log('Generating vertical frames...');
  savePNG(createScene1(W, H), `${dir}/scene01.png`);
  savePNG(createScene2(W, H), `${dir}/scene02.png`);
  savePNG(createScene3(W, H), `${dir}/scene03.png`);
  savePNG(createScene4(W, H), `${dir}/scene04.png`);
  savePNG(createScene5(W, H), `${dir}/scene05.png`);
  savePNG(createScene6(W, H), `${dir}/scene06.png`);
}

async function generateSquareFrames() {
  const W = 1080, H = 1080;
  const dir = `${OUT_DIR}/frames-1x1`;
  ensureDir(dir);

  console.log('Generating square frames...');
  savePNG(createScene1(W, H), `${dir}/scene01.png`);
  savePNG(createScene2(W, H), `${dir}/scene02.png`);
  savePNG(createScene3(W, H), `${dir}/scene03.png`);
  savePNG(createScene4(W, H), `${dir}/scene04.png`);
  savePNG(createScene5(W, H), `${dir}/scene05.png`);
  savePNG(createScene6(W, H), `${dir}/scene06.png`);
}

function compileVideo(format, duration, scenes) {
  const dir = `${OUT_DIR}/frames-${format}`;
  const output = `${OUT_DIR}/teaser-fb40-${format}.mp4`;

  // Build concat demuxer list file using absolute paths
  const listFile = `${OUT_DIR}/concat-${format}.txt`;
  const absDir = path.resolve(dir);
  let listContent = '';
  scenes.forEach((scene) => {
    listContent += `file '${absDir}/scene0${scene.idx}.png'\n`;
    listContent += `duration ${scene.dur}\n`;
  });
  // ffmpeg concat demuxer requires the last file to be repeated without duration
  listContent += `file '${absDir}/scene0${scenes[scenes.length - 1].idx}.png'\n`;
  fs.writeFileSync(listFile, listContent);

  const cmd = `${FFMPEG} -y -f concat -safe 0 -i "${listFile}" -vf "fps=30,format=yuv420p" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart "${output}"`;

  console.log('Compiling:', output);
  console.log('Command:', cmd);
  execSync(cmd, { stdio: 'inherit' });
  console.log('Done:', output);
}

async function main() {
  ensureDir(OUT_DIR);

  await generateHorizontalFrames();
  await generateVerticalFrames();
  await generateSquareFrames();

  // 16:9 horizontal 45s
  compileVideo('16x9', 45, [
    { idx: 1, dur: 5 },
    { idx: 2, dur: 7 },
    { idx: 3, dur: 10 },
    { idx: 4, dur: 10 },
    { idx: 5, dur: 8 },
    { idx: 6, dur: 5 },
  ]);

  // 9:16 vertical 15s (short version)
  compileVideo('9x16', 15, [
    { idx: 1, dur: 3 },
    { idx: 4, dur: 4 },
    { idx: 5, dur: 5 },
    { idx: 6, dur: 3 },
  ]);

  // 1:1 square 30s
  compileVideo('1x1', 30, [
    { idx: 1, dur: 4 },
    { idx: 2, dur: 6 },
    { idx: 3, dur: 7 },
    { idx: 5, dur: 8 },
    { idx: 6, dur: 5 },
  ]);

  console.log('\nAll videos compiled successfully!');
}

main().catch(console.error);
