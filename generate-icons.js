// Script untuk generate PWA icons
// Jalankan sekali aja: node generate-icons.js
const { createCanvas } = require('canvas');
const fs = require('fs');

const sizes = [72, 96, 128, 192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#4c1d95');
  grad.addColorStop(1, '#7c3aed');
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Emoji
  ctx.font = `${size * 0.6}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌍', size / 2, size / 2);

  fs.writeFileSync(`icon-${size}.png`, canvas.toBuffer('image/png'));
  console.log(`Generated icon-${size}.png`);
});
