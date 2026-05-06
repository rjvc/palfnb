const { Canvas, FontLibrary } = require('skia-canvas');
const fs = require('fs');
const path = require('path');

const W = 1080;
const H = 1920;
const FPS = 30;
const FFMPEG = require('ffmpeg-static');
const { spawn } = require('child_process');

const COLORS = {
  azul: '#1B365D',
  azulEscuro: '#0f1f35',
  dourado: '#C8963E',
  branco: '#FFFFFF',
  bege: '#f5f5f0',
  verdeMenta: '#88B7A1',
};

FontLibrary.use('Montserrat', [
  path.join(__dirname, 'fonts', 'Montserrat-Regular.ttf'),
  path.join(__dirname, 'fonts', 'Montserrat-Bold.ttf'),
  path.join(__dirname, 'fonts', 'Montserrat-Black.ttf'),
]);
FontLibrary.use('Lora', [path.join(__dirname, 'fonts', 'Lora-Regular.ttf')]);

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

function createCanvas() { return new Canvas(W, H); }

function drawBg(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function goldLine(ctx, x, y, len, prog) {
  ctx.save();
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len*prog, y); ctx.stroke();
  ctx.restore();
}

// Scene 1: Brand (0-3s)
function scene1(p) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  drawBg(ctx, COLORS.azulEscuro, COLORS.azul);
  const bar = Math.min(1, p*2);
  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(0, 0, W*easeOutQuart(bar), 6);
  const tp = p>0.2 ? Math.min(1, (p-0.2)*2) : 0;
  const yo = (1-easeOutQuart(tp))*60;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${64}px Montserrat`;
  ctx.fillStyle = COLORS.branco; ctx.globalAlpha = easeOutQuart(tp);
  ctx.fillText('GRUPO CASTRO', W/2, H/2-40+yo);
  ctx.font = `400 ${36}px Montserrat`;
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('CONSULTORIAS', W/2, H/2+30+yo);
  const lp = p>0.4 ? Math.min(1, (p-0.4)*3) : 0;
  goldLine(ctx, W/2-140, H/2+90+yo, 280, lp);
  ctx.globalAlpha = 1;
  return c;
}

// Scene 2: Event title (3-7s)
function scene2(p) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  drawBg(ctx, COLORS.azul, COLORS.azulEscuro);
  const sp = p>0.1 ? Math.min(1, (p-0.1)*2.5) : 0;
  const sy = (1-easeOutQuart(sp))*40;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `400 ${30}px Montserrat`;
  ctx.fillStyle = COLORS.verdeMenta; ctx.globalAlpha = easeOutQuart(sp);
  ctx.fillText('APRESENTA', W/2, H/2-220+sy);
  const tp = p>0.25 ? Math.min(1, (p-0.25)*2) : 0;
  const ty = (1-easeOutQuart(tp))*70;
  ctx.font = `900 ${140}px Montserrat`;
  ctx.fillStyle = COLORS.branco; ctx.globalAlpha = easeOutQuart(tp);
  ctx.fillText('F&B', W/2-50, H/2-60+ty);
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('4.0', W/2+130, H/2-60+ty);
  const dp = p>0.5 ? Math.min(1, (p-0.5)*2.5) : 0;
  const dy = (1-easeOutQuart(dp))*40;
  ctx.font = `400 ${32}px Lora`;
  ctx.fillStyle = COLORS.bege; ctx.globalAlpha = easeOutQuart(dp);
  ctx.fillText('A Nova Era da Gestão', W/2, H/2+60+dy);
  const lp = p>0.6 ? Math.min(1, (p-0.6)*3) : 0;
  goldLine(ctx, W/2-180, H/2+160+dy, 360, lp);
  ctx.globalAlpha = 1;
  return c;
}

// Scene 3: Details (7-10.5s)
function scene3(p) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  drawBg(ctx, COLORS.azulEscuro, '#0a1220');
  const p1 = p>0.1 ? Math.min(1, (p-0.1)*2) : 0;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${40}px Montserrat`;
  ctx.fillStyle = COLORS.dourado; ctx.globalAlpha = easeOutQuart(p1);
  ctx.fillText('PALESTRA', W/2, H/2-180);
  const p2 = p>0.25 ? Math.min(1, (p-0.25)*2) : 0;
  const y2 = (1-easeOutQuart(p2))*50;
  ctx.font = `900 ${72}px Montserrat`;
  ctx.fillStyle = COLORS.branco; ctx.globalAlpha = easeOutQuart(p2);
  ctx.fillText('10 de Setembro', W/2, H/2-50+y2);
  ctx.fillText('de 2026', W/2, H/2+30+y2);
  const p3 = p>0.5 ? Math.min(1, (p-0.5)*2) : 0;
  const y3 = (1-easeOutQuart(p3))*30;
  ctx.font = `400 ${32}px Lora`;
  ctx.fillStyle = COLORS.bege; ctx.globalAlpha = easeOutQuart(p3);
  ctx.fillText('Morro Bento Business Center', W/2, H/2+120+y3);
  ctx.fillText('Luanda · 09:00', W/2, H/2+165+y3);
  ctx.globalAlpha = 1;
  return c;
}

// Scene 4: CTA (10.5-13s)
function scene4(p) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  drawBg(ctx, COLORS.azul, COLORS.azulEscuro);
  const bp = p>0.1 ? Math.min(1, (p-0.1)*1.5) : 0;
  const sc = 0.8 + 0.2*easeOutQuart(bp);
  ctx.save(); ctx.translate(W/2, H/2); ctx.scale(sc, sc);
  ctx.fillStyle = 'rgba(27,54,93,0.6)';
  ctx.strokeStyle = COLORS.dourado; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-380, -220, 760, 440, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
  const p1 = p>0.25 ? Math.min(1, (p-0.25)*2) : 0;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${34}px Montserrat`;
  ctx.fillStyle = COLORS.verdeMenta; ctx.globalAlpha = easeOutQuart(p1);
  ctx.fillText('NÃO PERCA ESTA OPORTUNIDADE', W/2, H/2-90);
  const p2 = p>0.4 ? Math.min(1, (p-0.4)*2) : 0;
  const y2 = (1-easeOutQuart(p2))*40;
  ctx.font = `900 ${64}px Montserrat`;
  ctx.fillStyle = COLORS.branco; ctx.globalAlpha = easeOutQuart(p2);
  ctx.fillText('Reserve o seu lugar', W/2, H/2+10+y2);
  const p3 = p>0.55 ? Math.min(1, (p-0.55)*2.5) : 0;
  ctx.font = `400 ${28}px Lora`;
  ctx.fillStyle = COLORS.bege; ctx.globalAlpha = easeOutQuart(p3);
  ctx.fillText('www.grupocastro.co.ao', W/2, H/2+110);
  ctx.globalAlpha = 1;
  return c;
}

// Scene 5: Closing (13-15s)
function scene5(p) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  drawBg(ctx, COLORS.azulEscuro, '#070f1a');
  const p1 = p>0.1 ? Math.min(1, (p-0.1)*2) : 0;
  const y1 = (1-easeOutQuart(p1))*30;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${48}px Montserrat`;
  ctx.fillStyle = COLORS.branco; ctx.globalAlpha = easeOutQuart(p1);
  ctx.fillText('GRUPO CASTRO', W/2, H/2-50+y1);
  ctx.font = `400 ${28}px Montserrat`;
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('CONSULTORIAS', W/2, H/2+y1);
  const p2 = p>0.3 ? Math.min(1, (p-0.3)*3) : 0;
  goldLine(ctx, W/2-110, H/2+50+y1, 220, p2);
  const p3 = p>0.5 ? Math.min(1, (p-0.5)*2.5) : 0;
  const y3 = (1-easeOutQuart(p3))*20;
  ctx.font = `400 ${30}px Montserrat`;
  ctx.fillStyle = COLORS.verdeMenta; ctx.globalAlpha = easeOutQuart(p3);
  ctx.fillText('#F&B4ponto0', W/2, H/2+110+y3);
  ctx.globalAlpha = 1;
  return c;
}

function fadeTrans(a, b, prog) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  ctx.drawImage(a, 0, 0); ctx.globalAlpha = prog; ctx.drawImage(b, 0, 0); ctx.globalAlpha = 1;
  return c;
}

function slideTrans(a, b, prog) {
  const c = createCanvas(); const ctx = c.getContext('2d');
  const e = easeInOutCubic(prog); const off = W*e;
  ctx.drawImage(a, -off, 0); ctx.drawImage(b, W-off, 0);
  return c;
}

async function generate() {
  const outDir = path.join(__dirname, 'video-teaser', 'output');
  const framesDir = path.join(__dirname, 'video-teaser', 'frames-v');
  fs.mkdirSync(framesDir, { recursive: true });
  fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));

  const scenes = [
    { render: scene1, dur: 3 },
    { render: scene2, dur: 4 },
    { render: scene3, dur: 3.5 },
    { render: scene4, dur: 2.5 },
    { render: scene5, dur: 2 },
  ];
  const transDur = 0.8;
  const trans = ['fade','slide','fade','slide'];

  let frameIdx = 0;
  const sceneFrames = [];
  for (const s of scenes) {
    const frames = []; const total = Math.floor(s.dur*FPS);
    for (let i=0; i<total; i++) frames.push(s.render(i/total));
    sceneFrames.push(frames);
  }

  for (let s=0; s<scenes.length; s++) {
    const frames = sceneFrames[s]; const last = s===scenes.length-1;
    const out = last ? frames : frames.slice(0, frames.length - Math.floor(transDur*FPS/2));
    for (const canvas of out) {
      fs.writeFileSync(path.join(framesDir, `f_${String(frameIdx).padStart(5,'0')}.png`), await canvas.toBuffer('png'));
      frameIdx++;
    }
    if (!last) {
      const next = sceneFrames[s+1]; const tFrames = Math.floor(transDur*FPS);
      for (let t=0; t<tFrames; t++) {
        const prog = t/tFrames;
        const tc = trans[s%trans.length]==='slide' ? slideTrans(frames[frames.length-1], next[0], prog) : fadeTrans(frames[frames.length-1], next[0], prog);
        fs.writeFileSync(path.join(framesDir, `f_${String(frameIdx).padStart(5,'0')}.png`), await tc.toBuffer('png'));
        frameIdx++;
      }
    }
  }

  console.log(`Generated ${frameIdx} frames`);
  const outPath = path.join(outDir, 'teaser-fb4-vertical.mp4');
  return new Promise((res, rej) => {
    const proc = spawn(FFMPEG, [
      '-y','-framerate',String(FPS),'-i',path.join(framesDir,'f_%05d.png'),
      '-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','slow','-movflags','+faststart',outPath
    ], { stdio: 'inherit' });
    proc.on('close', code => code===0 ? (console.log('Video:', outPath), res(outPath)) : rej(new Error('ffmpeg '+code)));
  });
}

generate().catch(console.error);
