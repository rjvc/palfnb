const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

registerFont('/tmp/bricolage.ttf', { family: 'Bricolage' });
registerFont('/tmp/lora.ttf', { family: 'Lora' });
registerFont('/tmp/worksans.ttf', { family: 'WorkSans' });

const COLORS = {
  azul: '#1B365D',
  azulMedio: '#2C5282',
  dourado: '#C8963E',
  branco: '#FFFFFF',
  cinzaClaro: '#F2F2F2',
  verdeMenta: '#88B7A1',
  terracota: '#C1663B',
  dark: '#0f1a2e',
};

const W = 2400;  // 120cm at 20px/cm
const H = 1600;  // 80cm at 20px/cm

function createEstandarte1Tema() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, COLORS.azul);
  grad.addColorStop(1, COLORS.azulMedio);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(200, 150, 62, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(0, 0, W, 10);

  ctx.fillStyle = COLORS.branco;
  ctx.font = 'bold 42px WorkSans';
  ctx.fillText('GRUPO CASTRO', 100, 100);
  ctx.fillStyle = COLORS.dourado;
  ctx.font = '24px WorkSans';
  ctx.fillText('CONSULTORIAS', 100, 140);

  const leftX = 100;
  const rightX = W / 2 + 50;

  ctx.save();
  ctx.translate(leftX + 80, 180);
  ctx.fillStyle = COLORS.dourado;
  ctx.font = 'bold 180px Bricolage';
  const text = 'F&B 4.0';
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], 0, i * 170);
  }
  ctx.restore();

  ctx.fillStyle = COLORS.branco;
  ctx.font = 'bold 48px Bricolage';
  ctx.fillText('A gestão do seu negócio', rightX, 380);
  ctx.fillText('nunca mais será a mesma', rightX, 450);

  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(rightX, 500, 100, 4);

  ctx.fillStyle = COLORS.branco;
  ctx.font = '36px Lora';
  ctx.fillText('Venha descobrir como a tecnologia', rightX, 560);
  ctx.fillText('pode optimizar cada etapa da', rightX, 615);
  ctx.fillText('sua operação:', rightX, 670);

  const topics = [
    { icon: '▸', label: 'Custos' },
    { icon: '▸', label: 'Inventário' },
    { icon: '▸', label: 'Atendimento' },
    { icon: '▸', label: 'Rentabilidade' },
  ];

  ctx.font = 'bold 38px WorkSans';
  topics.forEach((t, i) => {
    const y = 760 + i * 70;
    ctx.fillStyle = COLORS.dourado;
    ctx.fillText('●', rightX, y);
    ctx.fillStyle = COLORS.branco;
    ctx.fillText(t.label, rightX + 40, y);
  });

  ctx.fillStyle = COLORS.branco;
  ctx.font = '32px WorkSans';
  ctx.fillText('10 Setembro 2026  |  Morro Bento Business Center  |  09:00', rightX, 1090);

  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = COLORS.azul;
  ctx.font = '22px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('www.grupocastro.ao  |  #F&B4ponto0  |  @grupocastro', W / 2, H - 20);
  ctx.textAlign = 'left';

  return canvas;
}

function createEstandarte2Oradores() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLORS.branco;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = COLORS.azul;
  ctx.fillRect(0, 0, W, 10);
  ctx.fillRect(0, H - 10, W, 10);
  ctx.fillRect(0, 0, 10, H);
  ctx.fillRect(W - 10, 0, 10, H);

  ctx.fillStyle = COLORS.azul;
  ctx.font = 'bold 36px WorkSans';
  ctx.fillText('GRUPO CASTRO CONSULTORIAS', 100, 80);

  ctx.fillStyle = COLORS.azul;
  ctx.font = 'bold 68px Bricolage';
  ctx.textAlign = 'center';
  ctx.fillText('OS NOSSOS ORADORES', W / 2, 200);

  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(W / 2 - 200, 230, 400, 4);
  ctx.textAlign = 'left';

  const speakerY = 320;
  const photoRadius = 110;

  // Jorge Castro (left)
  const jx = W / 4;
  ctx.beginPath();
  ctx.arc(jx, speakerY + 50, photoRadius, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = COLORS.cinzaClaro;
  ctx.fill();
  ctx.fillStyle = COLORS.azul;
  ctx.font = 'bold 42px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('JC', jx, speakerY + 60);
  ctx.fillText('JORGE CASTRO', jx, speakerY + 260);
  ctx.fillStyle = COLORS.azulMedio;
  ctx.font = '28px Lora';
  ctx.fillText('Especialista em Gestão F&B', jx, speakerY + 305);
  ctx.fillText('+15 anos de experiência', jx, speakerY + 345);

  // Ricardo Castro (right)
  const rx = W * 3 / 4;
  ctx.beginPath();
  ctx.arc(rx, speakerY + 50, photoRadius, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = COLORS.cinzaClaro;
  ctx.fill();
  ctx.fillStyle = COLORS.azul;
  ctx.font = 'bold 42px WorkSans';
  ctx.fillText('RC', rx, speakerY + 60);
  ctx.fillText('RICARDO CASTRO', rx, speakerY + 260);
  ctx.fillStyle = COLORS.azulMedio;
  ctx.font = '28px Lora';
  ctx.fillText('Director de Tecnologia', rx, speakerY + 305);
  ctx.fillText('Soluções digitais para PMEs', rx, speakerY + 345);

  ctx.textAlign = 'left';

  const dividerY = 740;
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(400, dividerY);
  ctx.lineTo(W - 400, dividerY);
  ctx.stroke();

  ctx.fillStyle = COLORS.azul;
  ctx.font = '38px Lora';
  ctx.textAlign = 'center';
  ctx.fillText('Moderação: Grupo Castro Consultorias', W / 2, dividerY + 80);

  ctx.fillStyle = COLORS.azulMedio;
  ctx.font = '30px WorkSans';
  ctx.fillText('10 Setembro 2026  |  Morro Bento Business Center  |  09:00', W / 2, dividerY + 150);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.azul;
  ctx.fillRect(0, H - 50, W, 50);
  ctx.fillStyle = COLORS.branco;
  ctx.font = '20px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('www.grupocastro.ao  |  #F&B4ponto0  |  @grupocastro', W / 2, H - 16);
  ctx.textAlign = 'left';

  return canvas;
}

function createEstandarte3CTA() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 200, H);
    ctx.stroke();
  }
  for (let i = 0; i < W; i += 100) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 100, H);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.branco;
  ctx.fillRect(0, 0, W, 10);
  ctx.fillRect(0, H - 10, W, 10);

  ctx.fillStyle = COLORS.branco;
  ctx.font = 'bold 120px Bricolage';
  ctx.textAlign = 'center';
  ctx.fillText('PRONTO PARA', W / 2, 300);
  ctx.fillText('O FUTURO?', W / 2, 450);

  ctx.fillStyle = COLORS.azul;
  ctx.fillRect(W / 2 - 180, 500, 360, 4);

  ctx.fillStyle = COLORS.azul;
  ctx.font = '44px Lora';
  ctx.fillText('Marque já a sua presença na palestra', W / 2, 620);
  ctx.fillText('que vai mudar a forma como gere', W / 2, 690);
  ctx.fillText('o seu negócio F&B', W / 2, 760);

  const infoY = 880;
  ctx.fillStyle = COLORS.branco;
  ctx.font = 'bold 42px WorkSans';
  ctx.fillText('📅 10 Setembro 2026', W / 2, infoY);
  ctx.font = '36px WorkSans';
  ctx.fillText('📍 Morro Bento Business Center, Luanda', W / 2, infoY + 60);
  ctx.fillText('🕘 09:00', W / 2, infoY + 110);

  ctx.fillStyle = COLORS.azul;
  ctx.fillRect(W / 2 - 250, infoY + 170, 500, 3);

  ctx.fillStyle = COLORS.azul;
  ctx.font = 'bold 40px WorkSans';
  ctx.fillText('INSCREVA-SE JÁ', W / 2, infoY + 240);
  ctx.font = '32px Lora';
  ctx.fillText('www.grupocastro.co.ao', W / 2, infoY + 300);

  // QR code placeholder
  const qrX = 180;
  const qrY = H - 340;
  const qrSize = 200;
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.fillStyle = COLORS.branco;
  ctx.font = 'bold 24px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('QR CODE', qrX + qrSize / 2, qrY + qrSize / 2 - 10);
  ctx.fillText('INSCRIÇÃO', qrX + qrSize / 2, qrY + qrSize / 2 + 20);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.branco;
  ctx.font = '28px WorkSans';
  ctx.textAlign = 'center';
  ctx.fillText('Contacto: +244 9XX XXX XXX  |  @grupocastro  |  #F&B4ponto0', W / 2, H - 40);
  ctx.textAlign = 'left';

  return canvas;
}

function savePNG(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buf);
  console.log('Created:', filename);
}

function savePDF(canvas, filename, widthCm, heightCm) {
  const imgData = canvas.toDataURL('image/png');
  const doc = new jsPDF({
    orientation: widthCm > heightCm ? 'landscape' : 'portrait',
    unit: 'cm',
    format: [widthCm, heightCm],
  });
  doc.addImage(imgData, 'PNG', 0, 0, widthCm, heightCm);
  doc.save(filename);
  console.log('Created:', filename);
}

async function main() {
  const outDir = 'materiais-fb4/estandartes';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const est1 = createEstandarte1Tema();
  savePNG(est1, `${outDir}/estandarte-1-tema.png`);
  savePDF(est1, `${outDir}/estandarte-1-tema.pdf`, 120, 80);

  const est2 = createEstandarte2Oradores();
  savePNG(est2, `${outDir}/estandarte-2-oradores.png`);
  savePDF(est2, `${outDir}/estandarte-2-oradores.pdf`, 120, 80);

  const est3 = createEstandarte3CTA();
  savePNG(est3, `${outDir}/estandarte-3-cta.png`);
  savePDF(est3, `${outDir}/estandarte-3-cta.pdf`, 120, 80);

  console.log('\nAll estandartes created successfully!');
}

main().catch(console.error);
