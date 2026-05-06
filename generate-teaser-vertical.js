const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFMPEG = path.join(__dirname, 'node_modules', '@ffmpeg-installer', 'linux-arm64', 'ffmpeg');
const OUT_VIDEO = path.join(__dirname, 'video-teaser', 'output', 'teaser-fb4-vertical.mp4');
const W = 1080, H = 1920;

const COLORS = {
  primary: '#1B365D', gold: '#C8963E', light: '#D9D9D9',
  white: '#FFFFFF', dark: '#0a0f1a',
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '', currentY = y;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else line = test;
  }
  ctx.fillText(line, x, currentY);
}

function scene1() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, COLORS.primary); g.addColorStop(1, COLORS.dark);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(200,150,62,0.15)'; ctx.lineWidth = 2;
  for (let i = 0; i < W; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
  ctx.fillStyle = COLORS.gold; ctx.fillRect(0, 0, W, 6);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.07)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('GRUPO CASTRO', W/2, H*0.35);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.035)}px sans-serif`;
  ctx.fillText('CONSULTORIAS', W/2, H*0.41);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.03)}px sans-serif`;
  ctx.fillText('APRESENTA', W/2, H*0.50);
  ctx.fillStyle = COLORS.gold; ctx.fillRect(0, H-6, W, 6);
  ctx.textAlign = 'left'; return c;
}

function scene2() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1a1a2e'); g.addColorStop(1, COLORS.primary);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.05)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('F&B 4.0', W/2, H*0.25);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.04)}px sans-serif`;
  ctx.fillText('A NOVA ERA DA GESTÃO', W/2, H*0.33);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.028)}px sans-serif`;
  ctx.fillText('10 de Setembro de 2026', W/2, H*0.5);
  ctx.fillText('Morro Bento Business Center, Luanda', W/2, H*0.56);
  ctx.fillText('09:00', W/2, H*0.62);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.035)}px sans-serif`;
  ctx.fillText('VAGAS LIMITADAS', W/2, H*0.74);
  ctx.fillStyle = COLORS.white; ctx.font = `${Math.floor(W*0.025)}px sans-serif`;
  ctx.fillText('www.grupocastro.co.ao', W/2, H*0.82);
  ctx.textAlign = 'left'; return c;
}

function scene3() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, COLORS.dark); g.addColorStop(1, COLORS.primary);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.08)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('GRUPO CASTRO', W/2, H*0.35);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.04)}px sans-serif`;
  ctx.fillText('CONSULTORIAS', W/2, H*0.42);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.055)}px sans-serif`;
  ctx.fillText('#F&B4ponto0', W/2, H*0.6);
  ctx.textAlign = 'left'; return c;
}

const scenes = [
  { fn: scene1, dur: 4 }, { fn: scene2, dur: 7 }, { fn: scene3, dur: 5 },
];

const tmpDir = fs.mkdtempSync('frames-');
console.log('Generating vertical frames...');
scenes.forEach((s, i) => {
  const idx = String(i + 1).padStart(2, '0');
  const buf = s.fn().toBuffer('image/png');
  fs.writeFileSync(`${tmpDir}/scene${idx}.png`, buf);
  console.log(`  scene${idx}.png`);
});

const absTmpDir = fs.realpathSync(tmpDir);
const listFile = `${absTmpDir}/concat.txt`;
fs.writeFileSync(listFile, scenes.map((s, i) => `file '${absTmpDir}/scene${String(i+1).padStart(2,'0')}.png'\nduration ${s.dur}\n`).join('') + `file '${absTmpDir}/scene${String(scenes.length).padStart(2,'0')}.png'\n`);

console.log('Compiling video...');
execSync(`${FFMPEG} -y -f concat -safe 0 -i "${listFile}" -vf "fps=30,format=yuv420p" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart "${OUT_VIDEO}"`, { stdio: 'inherit' });

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log('Done:', OUT_VIDEO);
