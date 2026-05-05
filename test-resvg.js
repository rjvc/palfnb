const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
  <rect width="200" height="100" fill="red"/>
  <text x="10" y="50" font-family="Arial" font-size="20" fill="white">Hello World</text>
</svg>`;

try {
  const resvg = new Resvg(svg, { 
    background: 'white',
    font: { 
      fontFiles: ['/paperclip/.claude/skills/canvas-design--f68a068779/canvas-fonts/BricolageGrotesque-Regular.ttf'],
      loadSystemFonts: true
    }
  });
  console.log('Resvg created');
  const pngData = resvg.render();
  console.log('Rendered, width:', pngData.width, 'height:', pngData.height);
  const buf = pngData.asPng();
  console.log('PNG size:', buf.length);
  fs.writeFileSync('/tmp/test-resvg2.png', buf);
} catch(e) {
  console.error('Error:', e);
}
