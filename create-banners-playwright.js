const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'materiais-fb4/banners';

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#c9a227',
  accent: '#e94560',
  light: '#f5f5f5',
  dark: '#0f0f1a',
  muted: '#4a4a6a',
};

const ROLLUP_WIDTH_CM = 200;
const ROLLUP_HEIGHT_CM = 85;

// Convert cm to pixels at 150dpi for screenshots
const CM_TO_PX_150 = 150 / 2.54;
const ROLLUP_W = Math.round(ROLLUP_WIDTH_CM * CM_TO_PX_150);
const ROLLUP_H = Math.round(ROLLUP_HEIGHT_CM * CM_TO_PX_150);

function rollupPrincipalHTML() {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&family=Lora:wght@400;700&family=Work+Sans:wght@400;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 100%; height: 100%; overflow: hidden; }
.banner {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark});
  position: relative;
  font-family: 'Bricolage Grotesque', sans-serif;
  color: ${COLORS.light};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4% 5%;
}
.top-bar { position: absolute; top: 0; left: 0; width: 100%; height: 1.2%; background: ${COLORS.secondary}; }
.pattern {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(201,162,39,0.06) 59px, rgba(201,162,39,0.06) 60px);
  pointer-events: none;
}
.logo-area { position: relative; z-index: 2; }
.logo { font-family: 'Work Sans', sans-serif; font-weight: 700; font-size: 3.5vw; color: ${COLORS.secondary}; letter-spacing: 2px; }
.logo-sub { font-family: 'Work Sans', sans-serif; font-size: 2.2vw; color: ${COLORS.light}; margin-top: 0.3vw; }
.content { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.title { font-size: 11vw; font-weight: 700; line-height: 1; margin-bottom: 1vw; }
.subtitle { font-size: 4vw; font-weight: 700; color: ${COLORS.secondary}; line-height: 1.3; }
.divider { width: 12%; height: 0.4vw; background: ${COLORS.secondary}; margin: 2vw 0; }
.desc { font-family: 'Lora', serif; font-size: 2.8vw; line-height: 1.4; }
.placeholder { font-family: 'Work Sans', sans-serif; font-size: 2.2vw; color: ${COLORS.muted}; margin-top: 2vw; }
.accent-circle {
  position: absolute; right: 8%; top: 50%; transform: translateY(-50%);
  width: 22vw; height: 22vw;
}
.accent-circle .outer { width: 100%; height: 100%; border-radius: 50%; background: ${COLORS.accent}; display: flex; align-items: center; justify-content: center; }
.accent-circle .inner { width: 75%; height: 75%; border-radius: 50%; background: ${COLORS.primary}; display: flex; align-items: center; justify-content: center; }
.accent-circle .text { font-family: 'Work Sans', sans-serif; font-size: 6vw; font-weight: 700; color: ${COLORS.secondary}; }
.bottom-bar {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 5.5%;
  background: ${COLORS.secondary}; display: flex; align-items: center; justify-content: center;
}
.bottom-bar span { font-family: 'Work Sans', sans-serif; font-size: 1.8vw; color: ${COLORS.dark}; }
</style></head>
<body>
<div class="banner">
  <div class="top-bar"></div>
  <div class="pattern"></div>
  <div class="logo-area">
    <div class="logo">GRUPO CASTRO</div>
    <div class="logo-sub">CONSULTORIAS</div>
  </div>
  <div class="content">
    <div class="title">F&B 4.0</div>
    <div class="subtitle">A Revolução da Gestão<br>de Restauração em Angola</div>
    <div class="divider"></div>
    <div class="desc">Palestra exclusiva para profissionais<br>do sector de Food & Beverage</div>
    <div class="placeholder">[Data e local a definir]</div>
  </div>
  <div class="accent-circle">
    <div class="outer"><div class="inner"><div class="text">4.0</div></div></div>
  </div>
  <div class="bottom-bar"><span>www.grupocastro.ao  |  info@grupocastro.ao</span></div>
</div>
</body></html>`;
}

function rollupInformativoHTML() {
  const topics = [
    'Tecnologia na Gestão de Restaurantes',
    'Análise de Dados e Métricas',
    'Experiência do Cliente Digital',
    'Sustentabilidade e Eficiência',
    'Tendências 2026'
  ];
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&family=Lora:wght@400;700&family=Work+Sans:wght@400;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 100%; height: 100%; overflow: hidden; }
.banner {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, ${COLORS.dark}, ${COLORS.primary});
  position: relative;
  font-family: 'Bricolage Grotesque', sans-serif;
  color: ${COLORS.light};
  padding: 4% 5%;
}
.top-bar { position: absolute; top: 0; left: 0; width: 100%; height: 1.2%; background: ${COLORS.secondary}; }
.header { font-family: 'Work Sans', sans-serif; font-size: 3.5vw; font-weight: 700; color: ${COLORS.secondary}; margin-bottom: 3vw; }
.columns { display: flex; height: 75%; }
.left { width: 48%; padding-right: 4%; }
.right { width: 48%; padding-left: 4%; border-left: 0.3vw solid ${COLORS.secondary}; }
.section-title { font-size: 3.2vw; font-weight: 700; margin-bottom: 2vw; }
.topic { display: flex; align-items: flex-start; margin-bottom: 1.8vw; }
.dot { width: 1vw; height: 1vw; background: ${COLORS.secondary}; margin-right: 1.2vw; margin-top: 0.8vw; flex-shrink: 0; }
.topic-text { font-family: 'Work Sans', sans-serif; font-size: 2.4vw; line-height: 1.3; }
.speaker { margin-bottom: 3vw; }
.speaker-name { font-family: 'Work Sans', sans-serif; font-size: 2.6vw; color: ${COLORS.muted}; }
.speaker-role { font-family: 'Work Sans', sans-serif; font-size: 2vw; color: ${COLORS.muted}; margin-top: 0.3vw; }
.date-loc { font-family: 'Work Sans', sans-serif; font-size: 2.8vw; font-weight: 700; color: ${COLORS.secondary}; margin-top: 2vw; }
.bottom-bar {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 5.5%;
  background: ${COLORS.secondary}; display: flex; align-items: center; justify-content: center;
}
.bottom-bar span { font-family: 'Work Sans', sans-serif; font-size: 1.8vw; color: ${COLORS.dark}; }
</style></head>
<body>
<div class="banner">
  <div class="top-bar"></div>
  <div class="header">PALESTRA F&B 4.0</div>
  <div class="columns">
    <div class="left">
      <div class="section-title">O que vai aprender:</div>
      ${topics.map(t => `<div class="topic"><div class="dot"></div><div class="topic-text">${t}</div></div>`).join('')}
    </div>
    <div class="right">
      <div class="section-title">Oradores</div>
      <div class="speaker">
        <div class="speaker-name">[Nome do Orador Principal]</div>
        <div class="speaker-role">Especialista em Gestão F&B</div>
      </div>
      <div class="speaker">
        <div class="speaker-name">[Nome do Orador Convidado]</div>
        <div class="speaker-role">Consultor de Transformação Digital</div>
      </div>
      <div class="date-loc">[Data]  |  [Local]  |  Luanda</div>
    </div>
  </div>
  <div class="bottom-bar"><span>Inscrições: www.grupocastro.ao/palestra-fb4</span></div>
</div>
</body></html>`;
}

function socialPostHTML(type, format) {
  const posts = {
    1: { title: 'F&B 4.0', subtitle: 'A Revolução Chegou a Angola', body: 'Descubra como a tecnologia está a transformar a gestão de restaurantes e a elevar a experiência do cliente.' },
    2: { title: 'Oradores de Excelência', subtitle: 'Aprenda com os Melhores', body: 'Especialistas nacionais e internacionais partilham estratégias práticas para o seu negócio.' },
    3: { title: 'O que vai Aprender', subtitle: '5 Pilares da Transformação', body: 'Tecnologia, Dados, Experiência Digital, Sustentabilidade e Tendências 2026.' },
    4: { title: 'Última Chamada', subtitle: 'Vagas Limitadas', body: 'Garanta o seu lugar na palestra mais esperada do sector F&B em Luanda.' },
  };
  const post = posts[type];
  const isStory = format === 'story';
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&family=Work+Sans:wght@400;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: ${isStory ? 1920 : 1080}px; overflow: hidden; }
.banner {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark});
  position: relative;
  font-family: 'Bricolage Grotesque', sans-serif;
  color: ${COLORS.light};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 50px;
}
.top-bar { position: absolute; top: 0; left: 0; width: 100%; height: 10px; background: ${COLORS.secondary}; }
.logo { position: absolute; top: 40px; left: 50px; font-family: 'Work Sans', sans-serif; font-size: 32px; font-weight: 700; color: ${COLORS.secondary}; }
.title { font-size: ${isStory ? 110 : 90}px; font-weight: 700; line-height: 1.1; margin-bottom: 30px; }
.subtitle { font-size: ${isStory ? 64 : 52}px; font-weight: 700; color: ${COLORS.secondary}; line-height: 1.2; margin-bottom: 40px; }
.body { font-family: 'Work Sans', sans-serif; font-size: ${isStory ? 48 : 40}px; line-height: 1.4; margin-bottom: 60px; }
.cta { font-family: 'Work Sans', sans-serif; font-size: ${isStory ? 44 : 38}px; font-weight: 700; color: ${COLORS.accent}; }
.bottom-bar {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 50px;
  background: ${COLORS.secondary}; display: flex; align-items: center; justify-content: center;
}
.bottom-bar span { font-family: 'Work Sans', sans-serif; font-size: 22px; color: ${COLORS.dark}; }
</style></head>
<body>
<div class="banner">
  <div class="top-bar"></div>
  <div class="logo">GRUPO CASTRO</div>
  <div class="title">${post.title}</div>
  <div class="subtitle">${post.subtitle}</div>
  <div class="body">${post.body}</div>
  <div class="cta">[Data e local a definir]</div>
  <div class="bottom-bar"><span>www.grupocastro.ao  |  @grupocastro</span></div>
</div>
</body></html>`;
}

function mockup3DHTML() {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 2400px; height: 1600px; background: #e8e8e8; position: relative; overflow: hidden; font-family: sans-serif; }
.floor { position: absolute; bottom: 0; left: 0; width: 100%; height: 30%; background: linear-gradient(to bottom, #d0d0d0, #b0b0b0); }
.rollup-container { position: absolute; bottom: 30%; display: flex; flex-direction: column; align-items: center; }
.rollup-container.left { left: 350px; }
.rollup-container.right { right: 350px; }
.canvas { width: 500px; height: 1100px; box-shadow: 20px 0 30px rgba(0,0,0,0.15); position: relative; }
.canvas img { width: 100%; height: 100%; object-fit: cover; }
.base { width: 520px; height: 15px; background: #333; }
.stand { width: 60px; height: 30px; background: #333; }
.shadow { width: 560px; height: 30px; background: rgba(0,0,0,0.12); border-radius: 50%; margin-top: 10px; }
.label { position: absolute; bottom: 40px; width: 100%; text-align: center; font-size: 48px; font-weight: 700; color: #0f0f1a; }
</style></head>
<body>
<div class="floor"></div>
<div class="rollup-container left">
  <div class="canvas"><img src="file://${path.resolve(OUT_DIR, 'banner-principal.png')}"></div>
  <div class="base"></div>
  <div class="stand"></div>
  <div class="shadow"></div>
</div>
<div class="rollup-container right">
  <div class="canvas"><img src="file://${path.resolve(OUT_DIR, 'banner-informativo.png')}"></div>
  <div class="base"></div>
  <div class="stand"></div>
  <div class="shadow"></div>
</div>
<div class="label">Mockup 3D — Roll-ups F&B 4.0</div>
</body></html>`;
}

async function renderHTML(browser, html, viewport, pdfOptions = null) {
  const page = await browser.newPage();
  await page.setViewportSize(viewport);
  await page.setContent(html, { waitUntil: 'networkidle' });
  // Wait for fonts
  await page.waitForTimeout(2000);
  
  const screenshotBuf = await page.screenshot({ type: 'png' });
  
  let pdfBuf = null;
  if (pdfOptions) {
    pdfBuf = await page.pdf(pdfOptions);
  }
  
  await page.close();
  return { png: screenshotBuf, pdf: pdfBuf };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();

  // Roll-up Principal — PNG preview + PDF
  console.log('Creating roll-up principal...');
  const rollup1 = await renderHTML(
    browser,
    rollupPrincipalHTML(),
    { width: ROLLUP_W, height: ROLLUP_H },
    {
      width: `${ROLLUP_WIDTH_CM}cm`,
      height: `${ROLLUP_HEIGHT_CM}cm`,
      printBackground: true,
      preferCSSPageSize: false,
    }
  );
  fs.writeFileSync(`${OUT_DIR}/banner-principal.png`, rollup1.png);
  fs.writeFileSync(`${OUT_DIR}/banner-principal.pdf`, rollup1.pdf);

  // Roll-up Informativo — PNG preview + PDF
  console.log('Creating roll-up informativo...');
  const rollup2 = await renderHTML(
    browser,
    rollupInformativoHTML(),
    { width: ROLLUP_W, height: ROLLUP_H },
    {
      width: `${ROLLUP_WIDTH_CM}cm`,
      height: `${ROLLUP_HEIGHT_CM}cm`,
      printBackground: true,
      preferCSSPageSize: false,
    }
  );
  fs.writeFileSync(`${OUT_DIR}/banner-informativo.png`, rollup2.png);
  fs.writeFileSync(`${OUT_DIR}/banner-informativo.pdf`, rollup2.pdf);

  // Social posts
  for (let i = 1; i <= 4; i++) {
    for (const format of ['square', 'story']) {
      const w = 1080;
      const h = format === 'square' ? 1080 : 1920;
      console.log(`Creating social post ${i} ${format}...`);
      const result = await renderHTML(
        browser,
        socialPostHTML(i, format),
        { width: w, height: h }
      );
      fs.writeFileSync(`${OUT_DIR}/social-post-${i}-${format}.png`, result.png);
      
      // JPG version
      const page = await browser.newPage();
      await page.setViewportSize({ width: w, height: h });
      await page.setContent(socialPostHTML(i, format), { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      const jpgBuf = await page.screenshot({ type: 'jpeg', quality: 95 });
      await page.close();
      fs.writeFileSync(`${OUT_DIR}/social-post-${i}-${format}.jpg`, jpgBuf);
    }
  }

  // Mockup 3D (depends on roll-up PNGs already existing)
  console.log('Creating mockup 3D...');
  const mockup = await renderHTML(
    browser,
    mockup3DHTML(),
    { width: 2400, height: 1600 }
  );
  fs.writeFileSync(`${OUT_DIR}/mockup-3d-rollups.png`, mockup.png);

  await browser.close();
  console.log('\nAll banners created successfully in', OUT_DIR);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
