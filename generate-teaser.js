const { Canvas, loadImage, FontLibrary } = require('skia-canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const FFMPEG = require('ffmpeg-static');
const { spawn } = require('child_process');

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

// Register fonts
FontLibrary.use('Montserrat', [
  path.join(__dirname, 'fonts', 'Montserrat-Regular.ttf'),
  path.join(__dirname, 'fonts', 'Montserrat-Bold.ttf'),
  path.join(__dirname, 'fonts', 'Montserrat-Black.ttf'),
]);
FontLibrary.use('Lora', [
  path.join(__dirname, 'fonts', 'Lora-Regular.ttf'),
]);

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function createCanvas() {
  return new Canvas(WIDTH, HEIGHT);
}

// Draw a professional gradient background
function drawBackground(ctx, color1, color2) {
  const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

// Draw subtle geometric pattern
function drawPattern(ctx, color, alpha = 0.03) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1;
  for (let i = 0; i < WIDTH; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, HEIGHT);
    ctx.stroke();
  }
  for (let j = 0; j < HEIGHT; j += 80) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(WIDTH, j);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw a decorative golden line
function drawGoldLine(ctx, x, y, w, progress = 1) {
  ctx.save();
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w * progress, y);
  ctx.stroke();
  ctx.restore();
}

// Draw rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Scene 1: Opening - Brand intro
function renderScene1(progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, COLORS.azulEscuro, COLORS.azul);
  drawPattern(ctx, COLORS.branco);

  // Animated golden accent bar at top
  const barProgress = Math.min(1, progress * 2);
  ctx.fillStyle = COLORS.dourado;
  ctx.fillRect(0, 0, WIDTH * easeOutQuart(barProgress), 6);

  // Logo text animation
  const textProgress = progress > 0.2 ? Math.min(1, (progress - 0.2) * 2) : 0;
  const yOffset = (1 - easeOutQuart(textProgress)) * 40;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // GRUPO CASTRO
  ctx.font = `700 ${60 + 20 * easeOutQuart(textProgress)}px Montserrat`;
  ctx.fillStyle = COLORS.branco;
  ctx.globalAlpha = easeOutQuart(textProgress);
  ctx.fillText('GRUPO CASTRO', WIDTH / 2, HEIGHT / 2 - 60 + yOffset);

  // CONSULTORIAS
  ctx.font = `400 ${36}px Montserrat`;
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('CONSULTORIAS', WIDTH / 2, HEIGHT / 2 + 20 + yOffset);

  // Gold line
  const lineProgress = progress > 0.4 ? Math.min(1, (progress - 0.4) * 3) : 0;
  drawGoldLine(ctx, WIDTH / 2 - 150, HEIGHT / 2 + 70 + yOffset, 300, lineProgress);

  ctx.globalAlpha = 1;
  return canvas;
}

// Scene 2: Event title
function renderScene2(progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, COLORS.azul, COLORS.azulEscuro);
  drawPattern(ctx, COLORS.branco);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subtitle animation
  const subProgress = progress > 0.1 ? Math.min(1, (progress - 0.1) * 2.5) : 0;
  const subY = (1 - easeOutQuart(subProgress)) * 30;
  ctx.font = `400 ${28}px Montserrat`;
  ctx.fillStyle = COLORS.verdeMenta;
  ctx.globalAlpha = easeOutQuart(subProgress);
  ctx.fillText('APRESENTA', WIDTH / 2, HEIGHT / 2 - 140 + subY);

  // Main title
  const titleProgress = progress > 0.25 ? Math.min(1, (progress - 0.25) * 2) : 0;
  const titleY = (1 - easeOutQuart(titleProgress)) * 50;

  ctx.font = `900 ${120}px Montserrat`;
  ctx.fillStyle = COLORS.branco;
  ctx.globalAlpha = easeOutQuart(titleProgress);
  ctx.fillText('F&B', WIDTH / 2 - 80, HEIGHT / 2 - 30 + titleY);

  ctx.font = `900 ${120}px Montserrat`;
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('4.0', WIDTH / 2 + 160, HEIGHT / 2 - 30 + titleY);

  // Description
  const descProgress = progress > 0.5 ? Math.min(1, (progress - 0.5) * 2.5) : 0;
  const descY = (1 - easeOutQuart(descProgress)) * 30;
  ctx.font = `400 ${32}px Lora`;
  ctx.fillStyle = COLORS.bege;
  ctx.globalAlpha = easeOutQuart(descProgress);
  ctx.fillText('A Nova Era da Gestão', WIDTH / 2, HEIGHT / 2 + 80 + descY);

  // Gold line
  const lineProgress = progress > 0.6 ? Math.min(1, (progress - 0.6) * 3) : 0;
  drawGoldLine(ctx, WIDTH / 2 - 200, HEIGHT / 2 + 120 + descY, 400, lineProgress);

  ctx.globalAlpha = 1;
  return canvas;
}

// Scene 3: Event details
function renderScene3(progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, COLORS.azulEscuro, '#0a1220');
  drawPattern(ctx, COLORS.branco, 0.02);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // "Palestra" label
  const p1 = progress > 0.1 ? Math.min(1, (progress - 0.1) * 2) : 0;
  ctx.font = `700 ${42}px Montserrat`;
  ctx.fillStyle = COLORS.dourado;
  ctx.globalAlpha = easeOutQuart(p1);
  ctx.fillText('PALESTRA', WIDTH / 2, HEIGHT / 2 - 160);

  // Date
  const p2 = progress > 0.25 ? Math.min(1, (progress - 0.25) * 2) : 0;
  const y2 = (1 - easeOutQuart(p2)) * 40;
  ctx.font = `900 ${80}px Montserrat`;
  ctx.fillStyle = COLORS.branco;
  ctx.globalAlpha = easeOutQuart(p2);
  ctx.fillText('10 de Setembro de 2026', WIDTH / 2, HEIGHT / 2 - 40 + y2);

  // Location
  const p3 = progress > 0.45 ? Math.min(1, (progress - 0.45) * 2) : 0;
  const y3 = (1 - easeOutQuart(p3)) * 30;
  ctx.font = `400 ${36}px Lora`;
  ctx.fillStyle = COLORS.bege;
  ctx.globalAlpha = easeOutQuart(p3);
  ctx.fillText('Morro Bento Business Center, Luanda · 09:00', WIDTH / 2, HEIGHT / 2 + 50 + y3);

  // Decorative elements
  const p4 = progress > 0.6 ? Math.min(1, (progress - 0.6) * 2.5) : 0;
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 2;
  ctx.globalAlpha = easeOutQuart(p4) * 0.6;

  // Left circle
  ctx.beginPath();
  ctx.arc(WIDTH / 2 - 400, HEIGHT / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Right circle
  ctx.beginPath();
  ctx.arc(WIDTH / 2 + 400, HEIGHT / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Cross lines
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 400, HEIGHT / 2 - 60);
  ctx.lineTo(WIDTH / 2 - 400, HEIGHT / 2 + 60);
  ctx.moveTo(WIDTH / 2 - 460, HEIGHT / 2);
  ctx.lineTo(WIDTH / 2 - 340, HEIGHT / 2);
  ctx.moveTo(WIDTH / 2 + 400, HEIGHT / 2 - 60);
  ctx.lineTo(WIDTH / 2 + 400, HEIGHT / 2 + 60);
  ctx.moveTo(WIDTH / 2 + 340, HEIGHT / 2);
  ctx.lineTo(WIDTH / 2 + 460, HEIGHT / 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  return canvas;
}

// Scene 4: Call to action
function renderScene4(progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, COLORS.azul, COLORS.azulEscuro);
  drawPattern(ctx, COLORS.branco);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // CTA box animation
  const boxProgress = progress > 0.1 ? Math.min(1, (progress - 0.1) * 1.5) : 0;
  const boxScale = 0.8 + 0.2 * easeOutQuart(boxProgress);

  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.scale(boxScale, boxScale);

  // Rounded box
  ctx.fillStyle = 'rgba(27, 54, 93, 0.6)';
  ctx.strokeStyle = COLORS.dourado;
  ctx.lineWidth = 2;
  roundRect(ctx, -400, -200, 800, 400, 20);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // Text
  const p1 = progress > 0.25 ? Math.min(1, (progress - 0.25) * 2) : 0;
  ctx.font = `700 ${38}px Montserrat`;
  ctx.fillStyle = COLORS.verdeMenta;
  ctx.globalAlpha = easeOutQuart(p1);
  ctx.fillText('NÃO PERCA ESTA OPORTUNIDADE', WIDTH / 2, HEIGHT / 2 - 80);

  const p2 = progress > 0.4 ? Math.min(1, (progress - 0.4) * 2) : 0;
  const y2 = (1 - easeOutQuart(p2)) * 30;
  ctx.font = `900 ${72}px Montserrat`;
  ctx.fillStyle = COLORS.branco;
  ctx.globalAlpha = easeOutQuart(p2);
  ctx.fillText('Reserve o seu lugar', WIDTH / 2, HEIGHT / 2 + 20 + y2);

  const p3 = progress > 0.55 ? Math.min(1, (progress - 0.55) * 2.5) : 0;
  ctx.font = `400 ${28}px Lora`;
  ctx.fillStyle = COLORS.bege;
  ctx.globalAlpha = easeOutQuart(p3);
  ctx.fillText('www.grupocastro.co.ao', WIDTH / 2, HEIGHT / 2 + 110);

  ctx.globalAlpha = 1;
  return canvas;
}

// Scene 5: Closing
function renderScene5(progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, COLORS.azulEscuro, '#070f1a');
  drawPattern(ctx, COLORS.branco, 0.02);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Logo
  const p1 = progress > 0.1 ? Math.min(1, (progress - 0.1) * 2) : 0;
  const y1 = (1 - easeOutQuart(p1)) * 30;
  ctx.font = `700 ${52}px Montserrat`;
  ctx.fillStyle = COLORS.branco;
  ctx.globalAlpha = easeOutQuart(p1);
  ctx.fillText('GRUPO CASTRO', WIDTH / 2, HEIGHT / 2 - 60 + y1);

  ctx.font = `400 ${28}px Montserrat`;
  ctx.fillStyle = COLORS.dourado;
  ctx.fillText('CONSULTORIAS', WIDTH / 2, HEIGHT / 2 - 10 + y1);

  // Gold line
  const p2 = progress > 0.3 ? Math.min(1, (progress - 0.3) * 3) : 0;
  drawGoldLine(ctx, WIDTH / 2 - 120, HEIGHT / 2 + 40 + y1, 240, p2);

  // Hashtag
  const p3 = progress > 0.5 ? Math.min(1, (progress - 0.5) * 2.5) : 0;
  const y3 = (1 - easeOutQuart(p3)) * 20;
  ctx.font = `400 ${30}px Montserrat`;
  ctx.fillStyle = COLORS.verdeMenta;
  ctx.globalAlpha = easeOutQuart(p3);
  ctx.fillText('#F&B4ponto0', WIDTH / 2, HEIGHT / 2 + 100 + y3);

  // Copyright
  const p4 = progress > 0.7 ? Math.min(1, (progress - 0.7) * 3) : 0;
  ctx.font = `400 ${18}px Montserrat`;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.globalAlpha = easeOutQuart(p4);
  ctx.fillText('© 2026 Grupo Castro Consultorias. Todos os direitos reservados.', WIDTH / 2, HEIGHT - 60);

  ctx.globalAlpha = 1;
  return canvas;
}

// Transition: fade between two scenes
function renderTransition(sceneA, sceneB, progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  // Draw scene A
  ctx.drawImage(sceneA, 0, 0);

  // Fade in scene B
  ctx.globalAlpha = progress;
  ctx.drawImage(sceneB, 0, 0);
  ctx.globalAlpha = 1;

  return canvas;
}

// Transition: slide left
function renderSlideTransition(sceneA, sceneB, progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  const ease = easeInOutCubic(progress);
  const offset = WIDTH * ease;

  ctx.drawImage(sceneA, -offset, 0);
  ctx.drawImage(sceneB, WIDTH - offset, 0);

  return canvas;
}

// Transition: zoom fade
function renderZoomFadeTransition(sceneA, sceneB, progress) {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  const ease = easeInOutQuad(progress);

  // Scene A zooms out and fades
  ctx.save();
  ctx.globalAlpha = 1 - ease;
  const scaleA = 1 - 0.1 * ease;
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.scale(scaleA, scaleA);
  ctx.translate(-WIDTH / 2, -HEIGHT / 2);
  ctx.drawImage(sceneA, 0, 0);
  ctx.restore();

  // Scene B zooms in and fades in
  ctx.save();
  ctx.globalAlpha = ease;
  const scaleB = 0.9 + 0.1 * ease;
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.scale(scaleB, scaleB);
  ctx.translate(-WIDTH / 2, -HEIGHT / 2);
  ctx.drawImage(sceneB, 0, 0);
  ctx.restore();

  ctx.globalAlpha = 1;
  return canvas;
}

async function generateVideo() {
  const framesDir = path.join(__dirname, 'video-teaser', 'frames');
  const outputDir = path.join(__dirname, 'video-teaser', 'output');
  fs.mkdirSync(framesDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });

  // Clean frames dir
  fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));

  const scenes = [
    { render: renderScene1, duration: 3 },
    { render: renderScene2, duration: 4 },
    { render: renderScene3, duration: 3.5 },
    { render: renderScene4, duration: 4 },
    { render: renderScene5, duration: 3 },
  ];

  const transitionDuration = 1; // seconds
  const transitions = ['fade', 'slide', 'zoomFade', 'fade'];

  let frameIndex = 0;

  // Pre-render scenes
  const sceneFrames = [];
  for (const scene of scenes) {
    const frames = [];
    const totalFrames = Math.floor(scene.duration * FPS);
    for (let i = 0; i < totalFrames; i++) {
      const progress = i / totalFrames;
      frames.push(scene.render(progress));
    }
    sceneFrames.push(frames);
  }

  // Render all frames
  for (let s = 0; s < scenes.length; s++) {
    const frames = sceneFrames[s];
    const isLast = s === scenes.length - 1;

    // Scene frames (excluding transition overlap at end, except last scene)
    const sceneOutputFrames = isLast ? frames : frames.slice(0, frames.length - Math.floor(transitionDuration * FPS / 2));

    for (const canvas of sceneOutputFrames) {
      const buf = await canvas.toBuffer('png');
      fs.writeFileSync(path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.png`), buf);
      frameIndex++;
    }

    // Transition to next scene
    if (!isLast) {
      const nextFrames = sceneFrames[s + 1];
      const transFrames = Math.floor(transitionDuration * FPS);
      const transitionType = transitions[s % transitions.length];

      for (let t = 0; t < transFrames; t++) {
        const progress = t / transFrames;
        const currentFrame = frames[frames.length - 1];
        const nextFrame = nextFrames[0];

        let transitionCanvas;
        switch (transitionType) {
          case 'slide':
            transitionCanvas = renderSlideTransition(currentFrame, nextFrame, progress);
            break;
          case 'zoomFade':
            transitionCanvas = renderZoomFadeTransition(currentFrame, nextFrame, progress);
            break;
          case 'fade':
          default:
            transitionCanvas = renderTransition(currentFrame, nextFrame, progress);
            break;
        }

        const buf = await transitionCanvas.toBuffer('png');
        fs.writeFileSync(path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.png`), buf);
        frameIndex++;
      }
    }
  }

  console.log(`Generated ${frameIndex} frames`);

  // Encode video with ffmpeg
  const outputPath = path.join(outputDir, 'teaser-fb4.mp4');
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(framesDir, 'frame_%05d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '18',
      '-preset', 'slow',
      '-movflags', '+faststart',
      outputPath,
    ];

    const proc = spawn(FFMPEG, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) {
        console.log('Video generated:', outputPath);
        resolve(outputPath);
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

generateVideo().catch(console.error);
