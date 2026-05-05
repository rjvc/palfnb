const opentype = require('opentype.js');
const fs = require('fs');

try {
  const buffer = fs.readFileSync('/paperclip/.claude/skills/canvas-design--f68a068779/canvas-fonts/BricolageGrotesque-Regular.ttf');
  const font = opentype.parse(buffer, { lowMemory: true });
  console.log('Font family:', font.names.fontFamily);
  console.log('Number of glyphs:', font.numGlyphs);
  
  const path = font.getPath('Hello', 0, 100, 20);
  console.log('Path commands count:', path.commands.length);
  console.log('First few commands:', path.commands.slice(0, 3));
} catch(e) {
  console.error('Error:', e.message);
  console.error(e.stack);
}
