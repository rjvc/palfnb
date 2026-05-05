const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'materiais-fb4', 'merchandising');

const COLORS = {
  azul: '#1B365D',
  azulEscuro: '#0f1f35',
  dourado: '#C8963E',
  branco: '#FFFFFF',
  cinza: '#e8e8e8',
  bege: '#f5f5f0',
  verdeMenta: '#88B7A1',
  preto: '#1a1a1a',
};

function rect(ctx, x, y, w, h, radius = 0) {
  if (radius === 0) {
    ctx.fillRect(x, y, w, h);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function createMoleskineMockup() {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLORS.cinza;
  ctx.fillRect(0, 0, 1200, 800);

  // Background card
  ctx.fillStyle = COLORS.bege;
  rect(ctx, 120, 100, 960, 600, 12);
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Moleskine
  const mx = 180, my = 200, mw = 280, mh = 390;
  const mGrad = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
  mGrad.addColorStop(0, COLORS.azul);
  mGrad.addColorStop(1, COLORS.azulEscuro);
  ctx.fillStyle = mGrad;
  rect(ctx, mx, my, mw, mh, 4);
  ctx.fill();

  // Spine shadow
  ctx.fillStyle = '#0a1525';
  ctx.fillRect(mx, my, 4, mh);

  // Elastic band
  ctx.fillStyle = COLORS.preto;
  ctx.fillRect(mx + mw - 2, my + 95, 8, 200);

  // Text on cover
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Brand name
  ctx.fillStyle = COLORS.dourado;
  ctx.font = '12px WorkSans';
  const lines = ['GRUPO CASTRO', 'CONSULTORIAS'];
  let y = my + 140;
  lines.forEach((line, i) => {
    ctx.fillText(line, mx + mw / 2, y + i * 18);
  });

  // Divider
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mx + mw / 2 - 30, y + 52);
  ctx.lineTo(mx + mw / 2 + 30, y + 52);
  ctx.stroke();

  // F&B 4.0
  ctx.fillStyle = COLORS.branco;
  ctx.font = '900 48px Bricolage';
  ctx.fillText('F&B', mx + mw / 2 - 28, y + 86);
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('4.0', mx + mw / 2 + 52, y + 86);

  // Hashtag
  ctx.fillStyle = COLORS.verdeMenta;
  ctx.font = '12px WorkSans';
  ctx.fillText('#F&B4ponto0', mx + mw / 2, my + mh - 50);

  // Info panel
  const ix = 520;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.fillStyle = COLORS.azul;
  ctx.font = '700 28px Lora';
  ctx.fillText('Moleskine Personalizado', ix, 200);

  ctx.fillStyle = COLORS.dourado;
  ctx.font = '600 15px WorkSans';
  ctx.fillText('Palestra F&B 4.0 — 10 Set 2026', ix, 240);

  // Details list
  const details = [
    ['Formato', 'A5 (148 × 210 mm)'],
    ['Capa', 'Dura, azul escuro c/ gravação dourada'],
    ['Páginas', '96 folhas, papel creme 90g/m²'],
    ['Fechamento', 'Elástico preto'],
    ['Marcador', 'Fita cetim dourada'],
    ['Quantidade', '80 unidades'],
    ['Fornecedor', 'A adjudicar'],
  ];

  let dy = 280;
  details.forEach(([k, v]) => {
    ctx.fillStyle = '#555';
    ctx.font = '600 14px WorkSans';
    ctx.fillText(k, ix, dy);
    ctx.fillStyle = '#333';
    ctx.font = '13px WorkSans';
    ctx.fillText(v, ix + 150, dy);
    dy += 28;
  });

  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUT, 'moleskine-mockup.png'), buf);
  console.log('Created moleskine-mockup.png');
}

function createCanetasMockup() {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLORS.cinza;
  ctx.fillRect(0, 0, 1200, 800);

  // Background card
  ctx.fillStyle = COLORS.bege;
  rect(ctx, 120, 100, 960, 600, 12);
  ctx.fill();

  // Pen 1
  const penY1 = 260, penX = 180, penW = 480, penH = 52;
  const penGrad = ctx.createLinearGradient(penX, penY1, penX, penY1 + penH);
  penGrad.addColorStop(0, COLORS.azul);
  penGrad.addColorStop(1, COLORS.azulEscuro);
  ctx.fillStyle = penGrad;
  rect(ctx, penX, penY1, penW, penH, 26);
  ctx.fill();

  // Pen tip
  const tipGrad = ctx.createLinearGradient(penX, penY1, penX, penY1 + 12);
  tipGrad.addColorStop(0, COLORS.dourado);
  tipGrad.addColorStop(1, '#8b691f');
  ctx.fillStyle = tipGrad;
  ctx.fillRect(penX, penY1 + 20, 24, 12);

  // Clip
  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(penX + 80, penY1 - 10, 8, 36);

  // Body text
  ctx.fillStyle = COLORS.dourado;
  ctx.font = '600 13px WorkSans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GRUPO CASTRO CONSULTORIAS', penX + penW / 2, penY1 + penH / 2 + 2);

  // Pen label
  ctx.fillStyle = '#666';
  ctx.font = '13px WorkSans';
  ctx.fillText('Caneta esferográfica metálica', penX + penW / 2, penY1 + penH + 30);

  // Pen 2
  const penY2 = 410;
  ctx.fillStyle = penGrad;
  rect(ctx, penX, penY2, penW, penH, 26);
  ctx.fill();
  ctx.fillStyle = tipGrad;
  ctx.fillRect(penX, penY2 + 20, 24, 12);
  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(penX + 80, penY2 - 10, 8, 36);
  ctx.fillText('F&B 4.0', penX + penW / 2, penY2 + penH / 2 + 2);
  ctx.fillStyle = '#666';
  ctx.font = '13px WorkSans';
  ctx.fillText('Design alternativo', penX + penW / 2, penY2 + penH + 30);

  // Info panel
  const ix = 720;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.fillStyle = COLORS.azul;
  ctx.font = '700 28px Lora';
  ctx.fillText('Canetas Personalizadas', ix, 200);

  ctx.fillStyle = COLORS.dourado;
  ctx.font = '600 15px WorkSans';
  ctx.fillText('Palestra F&B 4.0 — 10 Set 2026', ix, 240);

  const details = [
    ['Modelo', 'Esferográfica metálica'],
    ['Cor do corpo', 'Azul escuro c/ detalhes dourados'],
    ['Tinta', 'Azul'],
    ['Mecanismo', 'Rotativo (twist)'],
    ['Gravação', 'Laser dourado no corpo'],
    ['Quantidade', '100 unidades'],
    ['Fornecedor', 'A adjudicar'],
  ];

  let dy = 280;
  details.forEach(([k, v]) => {
    ctx.fillStyle = '#555';
    ctx.font = '600 14px WorkSans';
    ctx.fillText(k, ix, dy);
    ctx.fillStyle = '#333';
    ctx.font = '13px WorkSans';
    ctx.fillText(v, ix + 160, dy);
    dy += 28;
  });

  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUT, 'canetas-mockup.png'), buf);
  console.log('Created canetas-mockup.png');
}

createMoleskineMockup();
createCanetasMockup();
