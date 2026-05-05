const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

// Register fonts
registerFont('/tmp/bricolage.ttf', { family: 'Bricolage' });
registerFont('/tmp/lora.ttf', { family: 'Lora' });
registerFont('/tmp/worksans.ttf', { family: 'WorkSans' });

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#c9a227',
  accent: '#e94560',
  light: '#f5f5f5',
  dark: '#0f0f1a',
  muted: '#4a4a6a',
};

function createRollupPrincipal() {
  const W = 2400, H = 1020;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.primary);
  grad.addColorStop(1, COLORS.dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(0, 0, W, 12);

  ctx.strokeStyle = 'rgba(201, 162, 39, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.secondary;
  ctx.font = 'bold 42px WorkSans';
  ctx.fillText('GRUPO CASTRO', 120, 120);
  ctx.fillStyle = COLORS.light;
  ctx.font = '28px WorkSans';
  ctx.fillText('CONSULTORIAS', 120, 160);

  ctx.fillStyle = COLORS.light;
  ctx.font = 'bold 120px Bricolage';
  ctx.fillText('F&B 4.0', 120, 400);

  ctx.fillStyle = COLORS.secondary;
  ctx.font = 'bold 52px Bricolage';
  ctx.fillText('A Revolução da Gestão', 120, 480);
  ctx.fillText('de Restauração em Angola', 120, 550);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(120, 600, 200, 4);

  ctx.fillStyle = COLORS.light;
  ctx.font = '36px Lora';
  ctx.fillText('Palestra exclusiva para profissionais', 120, 660);
  ctx.fillText('do sector de Food & Beverage', 120, 710);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '30px WorkSans';
  ctx.fillText('10 Setembro 2026 | Morro Bento Business Center | 09:00', 120, 820);

  ctx.fillStyle = COLORS.accent;
  ctx.beginPath();
  ctx.arc(W - 300, H/2, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.primary;
  ctx.beginPath();
  ctx.arc(W - 300, H/2, 140, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.secondary;
  ctx.font = 'bold 48px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('4.0', W - 300, H/2 + 16);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = COLORS.dark;
  ctx.font = '24px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('www.grupocastro.ao  |  info@grupocastro.ao', W/2, H - 22);
  ctx.textAlign = 'left';

  return canvas;
}

function createRollupInformativo() {
  const W = 2400, H = 1020;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.dark);
  grad.addColorStop(1, COLORS.primary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(0, 0, W, 12);

  ctx.fillStyle = COLORS.secondary;
  ctx.font = 'bold 48px WorkSans';
  ctx.fillText('PALESTRA F&B 4.0', 120, 100);

  const topics = [
    'Tecnologia na Gestão de Restaurantes',
    'Análise de Dados e Métricas',
    'Experiência do Cliente Digital',
    'Sustentabilidade e Eficiência',
    'Tendências 2026'
  ];

  ctx.fillStyle = COLORS.light;
  ctx.font = 'bold 42px Bricolage';
  ctx.fillText('O que vai aprender:', 120, 200);

  ctx.fillStyle = COLORS.light;
  ctx.font = '36px WorkSans';
  topics.forEach((t, i) => {
    ctx.fillStyle = COLORS.secondary;
    ctx.fillRect(120, 260 + i * 80, 10, 10);
    ctx.fillStyle = COLORS.light;
    ctx.fillText(t, 150, 275 + i * 80);
  });

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(W/2 + 100, 180, 3, 600);

  ctx.fillStyle = COLORS.light;
  ctx.font = 'bold 42px Bricolage';
  ctx.fillText('Oradores', W/2 + 150, 240);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '32px WorkSans';
  ctx.fillText('[Nome do Orador Principal]', W/2 + 150, 320);
  ctx.font = '26px WorkSans';
  ctx.fillText('Especialista em Gestão F&B', W/2 + 150, 360);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '32px WorkSans';
  ctx.fillText('[Nome do Orador Convidado]', W/2 + 150, 460);
  ctx.font = '26px WorkSans';
  ctx.fillText('Consultor de Transformação Digital', W/2 + 150, 500);

  ctx.fillStyle = COLORS.secondary;
  ctx.font = 'bold 36px WorkSans';
  ctx.fillText('10 Setembro 2026  |  Morro Bento Business Center  |  09:00', W/2 + 150, 650);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = COLORS.dark;
  ctx.font = '24px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('Inscrições: www.grupocastro.ao/palestra-fb4', W/2, H - 22);
  ctx.textAlign = 'left';

  return canvas;
}

function createSocialPost(type, format) {
  let W, H;
  if (format === 'square') { W = 1080; H = 1080; }
  else { W = 1080; H = 1920; }

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.primary);
  grad.addColorStop(1, COLORS.dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(0, 0, W, 8);

  ctx.fillStyle = COLORS.secondary;
  ctx.font = `bold ${W > 1500 ? 36 : 28}px WorkSans`;
  ctx.fillText('GRUPO CASTRO', 40, 60);

  let title, subtitle, body;

  switch(type) {
    case 1:
      title = 'F&B 4.0';
      subtitle = 'A Revolução Chegou a Angola';
      body = 'Descubra como a tecnologia está a transformar a gestão de restaurantes e a elevar a experiência do cliente.';
      break;
    case 2:
      title = 'Oradores de Excelência';
      subtitle = 'Aprenda com os Melhores';
      body = 'Especialistas nacionais e internacionais partilham estratégias práticas para o seu negócio.';
      break;
    case 3:
      title = 'O que vai Aprender';
      subtitle = '5 Pilares da Transformação';
      body = 'Tecnologia, Dados, Experiência Digital, Sustentabilidade e Tendências 2026.';
      break;
    case 4:
      title = 'Última Chamada';
      subtitle = 'Vagas Limitadas';
      body = 'Garanta o seu lugar na palestra mais esperada do sector F&B em Luanda.';
      break;
  }

  const titleSize = format === 'story' ? 72 : 64;
  const subSize = format === 'story' ? 42 : 38;
  const bodySize = format === 'story' ? 36 : 32;
  const maxWidth = W - 80;

  ctx.fillStyle = COLORS.light;
  ctx.font = `bold ${titleSize}px Bricolage`;
  wrapText(ctx, title, 40, H * 0.3, maxWidth, titleSize + 10);

  ctx.fillStyle = COLORS.secondary;
  ctx.font = `bold ${subSize}px Bricolage`;
  wrapText(ctx, subtitle, 40, H * 0.3 + titleSize + 30, maxWidth, subSize + 8);

  ctx.fillStyle = COLORS.light;
  ctx.font = `${bodySize}px WorkSans`;
  wrapText(ctx, body, 40, H * 0.3 + titleSize + subSize + 60, maxWidth, bodySize + 10);

  ctx.fillStyle = COLORS.accent;
  ctx.font = `bold ${bodySize}px WorkSans`;
  ctx.fillText('10 Set. 2026 | Morro Bento | 09h00', 40, H - 120);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(0, H - 40, W, 40);
  ctx.fillStyle = COLORS.dark;
  ctx.font = '20px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('www.grupocastro.ao  |  @grupocastro', W/2, H - 12);
  ctx.textAlign = 'left';

  return canvas;
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
}

function createMockup3D() {
  const W = 2400, H = 1600;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(0, 0, W, H);

  const floorGrad = ctx.createLinearGradient(0, H*0.7, 0, H);
  floorGrad.addColorStop(0, '#d0d0d0');
  floorGrad.addColorStop(1, '#b0b0b0');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, H*0.7, W, H*0.3);

  drawRollupMockup(ctx, 400, H*0.15, 500, 1100, createRollupPrincipal(), 0.85);
  drawRollupMockup(ctx, 1500, H*0.15, 500, 1100, createRollupInformativo(), 0.85);

  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(650, H*0.7 + 20, 280, 20, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(1750, H*0.7 + 20, 280, 20, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = COLORS.dark;
  ctx.font = 'bold 48px Bricolage';
  ctx.textAlign = 'center';
  ctx.fillText('Mockup 3D — Roll-ups F&B 4.0', W/2, H - 60);
  ctx.textAlign = 'left';

  return canvas;
}

function drawRollupMockup(ctx, x, y, w, h, sourceCanvas, scale) {
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 10, y + h, w + 20, 15);
  ctx.fillRect(x + w/2 - 30, y + h + 15, 60, 30);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, x, y, w, h);
  ctx.restore();

  const sideGrad = ctx.createLinearGradient(x + w, y, x + w + 20, y);
  sideGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
  sideGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sideGrad;
  ctx.fillRect(x + w, y, 20, h);
}

function savePNG(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buf);
  console.log('Created:', filename);
}

function saveJPG(canvas, filename) {
  const buf = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(filename, buf);
  console.log('Created:', filename);
}

function savePDF(canvas, filename, widthCm, heightCm) {
  const imgData = canvas.toDataURL('image/png');
  const doc = new jsPDF({
    orientation: widthCm > heightCm ? 'landscape' : 'portrait',
    unit: 'cm',
    format: [widthCm, heightCm]
  });
  doc.addImage(imgData, 'PNG', 0, 0, widthCm, heightCm);
  doc.save(filename);
  console.log('Created:', filename);
}

async function main() {
  const outDir = 'materiais-fb4/banners';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Roll-ups
  const rollup1 = createRollupPrincipal();
  savePNG(rollup1, `${outDir}/banner-principal.png`);
  savePDF(rollup1, `${outDir}/banner-principal.pdf`, 200, 85);

  const rollup2 = createRollupInformativo();
  savePNG(rollup2, `${outDir}/banner-informativo.png`);
  savePDF(rollup2, `${outDir}/banner-informativo.pdf`, 200, 85);

  // Social posts
  for (let i = 1; i <= 4; i++) {
    const square = createSocialPost(i, 'square');
    savePNG(square, `${outDir}/social-post-${i}-square.png`);
    saveJPG(square, `${outDir}/social-post-${i}-square.jpg`);

    const story = createSocialPost(i, 'story');
    savePNG(story, `${outDir}/social-post-${i}-story.png`);
    saveJPG(story, `${outDir}/social-post-${i}-story.jpg`);
  }

  // Mockup
  const mockup = createMockup3D();
  savePNG(mockup, `${outDir}/mockup-3d-rollups.png`);

  console.log('\nAll banners created successfully!');
}

main().catch(console.error);
