const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFMPEG = path.join(__dirname, 'node_modules', '@ffmpeg-installer', 'linux-arm64', 'ffmpeg');
const OUT_VIDEO = path.join(__dirname, 'video-teaser', 'output', 'teaser-fb4.mp4');
const W = 1920, H = 1080;

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
  for (let i = 0; i < W; i += 80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
  for (let i = 0; i < H; i += 80) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }
  ctx.fillStyle = COLORS.gold; ctx.fillRect(0, 0, W, 6);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.06)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('GRUPO CASTRO', W/2, H*0.38);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.03)}px sans-serif`;
  ctx.fillText('CONSULTORIAS', W/2, H*0.44);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.025)}px sans-serif`;
  ctx.fillText('APRESENTA', W/2, H*0.54);
  ctx.fillStyle = COLORS.gold; ctx.fillRect(0, H-6, W, 6);
  ctx.textAlign = 'left'; return c;
}

function scene2() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1a1a2e'); g.addColorStop(1, COLORS.primary);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(201,150,62,0.12)'; ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 60) { ctx.setLineDash([5,15]); ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
  ctx.setLineDash([]);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.045)}px sans-serif`;
  ctx.textAlign = 'center'; 
  ctx.fillText('GERIR UM NEGÓCIO DE RESTAURAÇÃO', W/2, H*0.25);
  ctx.fillText('EM ANGOLA NÃO É FÁCIL', W/2, H*0.32);
  const keywords = ['CUSTOS', 'INVENTÁRIO', 'CLIENTES'];
  ctx.font = `bold ${Math.floor(W*0.035)}px sans-serif`;
  keywords.forEach((kw, i) => {
    const x = W/2 + (i-1)*W*0.28;
    ctx.fillStyle = 'rgba(201,150,62,0.2)'; ctx.fillRect(x-W*0.28*0.35, H*0.55-W*0.04, W*0.28*0.7, W*0.08);
    ctx.fillStyle = COLORS.white; ctx.fillText(kw, x, H*0.55+W*0.01);
  });
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.022)}px sans-serif`;
  ctx.fillText('Quem é que tem tempo para pensar no futuro?', W/2, H*0.75);
  ctx.textAlign = 'left'; return c;
}

function scene3() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#0f172a'); g.addColorStop(0.5, COLORS.primary); g.addColorStop(1, '#1e293b');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(201,150,62,0.1)'; ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 100) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
  for (let i = 0; i < H; i += 100) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.055)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('F&B 4.0', W/2, H*0.3);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.03)}px sans-serif`;
  ctx.fillText('A NOVA ERA DA GESTÃO', W/2, H*0.38);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.022)}px sans-serif`;
  wrapText(ctx, 'Inteligência Artificial ao alcance do seu negócio. Soluções simples, práticas e feitas à medida das PMEs angolanas.', W/2-W*0.35, H*0.52, W*0.7, W*0.035);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.025)}px sans-serif`;
  ctx.fillText('IA + GESTÃO F&B = RESULTADOS REAIS', W/2, H*0.72);
  ctx.textAlign = 'left'; return c;
}

function scene4() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(W/2, H/2, 100, W/2, H/2, W);
  g.addColorStop(0, '#1e293b'); g.addColorStop(1, COLORS.primary);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(201,150,62,0.2)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(W*0.25, H*0.45, W*0.12, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.75, H*0.45, W*0.12, 0, Math.PI*2); ctx.stroke();
  ctx.fillStyle = 'rgba(201,150,62,0.3)'; ctx.beginPath(); ctx.arc(W*0.25, H*0.4, W*0.1, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = COLORS.light; ctx.font = `bold ${Math.floor(W*0.08)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('JC', W*0.25, H*0.42);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.022)}px sans-serif`;
  ctx.fillText('JORGE CASTRO', W*0.25, H*0.58);
  ctx.fillStyle = COLORS.gold; ctx.font = `${Math.floor(W*0.018)}px sans-serif`;
  ctx.fillText('Especialista F&B', W*0.25, H*0.63);
  ctx.fillStyle = 'rgba(201,150,62,0.3)'; ctx.beginPath(); ctx.arc(W*0.75, H*0.4, W*0.1, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = COLORS.light; ctx.font = `bold ${Math.floor(W*0.08)}px sans-serif`;
  ctx.fillText('RC', W*0.75, H*0.42);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.022)}px sans-serif`;
  ctx.fillText('RICARDO CASTRO', W*0.75, H*0.58);
  ctx.fillStyle = COLORS.gold; ctx.font = `${Math.floor(W*0.018)}px sans-serif`;
  ctx.fillText('Director de Tecnologia', W*0.75, H*0.63);
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = `italic ${Math.floor(W*0.015)}px serif`;
  ctx.fillText('[Fotos dos oradores em breve]', W/2, H*0.85);
  ctx.textAlign = 'left'; return c;
}

function scene5() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, COLORS.primary); g.addColorStop(1, COLORS.dark);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = COLORS.gold; ctx.lineWidth = 6; ctx.strokeRect(W*0.05, H*0.05, W*0.9, H*0.9);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.075)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('F&B 4.0', W/2, H*0.3);
  ctx.fillStyle = COLORS.white; ctx.font = `bold ${Math.floor(W*0.035)}px sans-serif`;
  ctx.fillText('A NOVA ERA DA GESTÃO', W/2, H*0.4);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.022)}px sans-serif`;
  ctx.fillText('10 de Setembro de 2026', W/2, H*0.55);
  ctx.fillText('Morro Bento Business Center, Luanda', W/2, H*0.6);
  ctx.fillText('09:00', W/2, H*0.65);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.028)}px sans-serif`;
  ctx.fillText('VAGAS LIMITADAS', W/2, H*0.76);
  ctx.fillStyle = COLORS.white; ctx.font = `${Math.floor(W*0.02)}px sans-serif`;
  ctx.fillText('www.grupocastro.co.ao', W/2, H*0.84);
  ctx.textAlign = 'left'; return c;
}

function scene6() {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, COLORS.dark); g.addColorStop(1, COLORS.primary);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.06)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('GRUPO CASTRO', W/2, H*0.4);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.03)}px sans-serif`;
  ctx.fillText('CONSULTORIAS', W/2, H*0.47);
  ctx.fillStyle = COLORS.gold; ctx.font = `bold ${Math.floor(W*0.04)}px sans-serif`;
  ctx.fillText('#F&B4ponto0', W/2, H*0.62);
  ctx.fillStyle = COLORS.light; ctx.font = `${Math.floor(W*0.022)}px sans-serif`;
  ctx.fillText('www.grupocastro.co.ao', W/2, H*0.75);
  ctx.textAlign = 'left'; return c;
}

const scenes = [
  { fn: scene1, dur: 5 }, { fn: scene2, dur: 7 }, { fn: scene3, dur: 10 },
  { fn: scene4, dur: 10 }, { fn: scene5, dur: 8 }, { fn: scene6, dur: 5 },
];

const tmpDir = fs.mkdtempSync('frames-');
console.log('Generating frames...');
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
