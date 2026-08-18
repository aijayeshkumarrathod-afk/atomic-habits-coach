// Pure Node.js script using built-in zlib and fs to generate crisp PNG app icons
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, drawFn) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const idx = (y * width + x) * 4;
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // PNG filter byte (0 for none) before each scanline
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (width * 4 + 1)] = 0;
    buffer.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatData = zlib.deflateSync(scanlines);

  // Helper to calculate CRC32
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ byte) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function createChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const crcBuf = Buffer.alloc(4);
    const typeAndData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([lenBuf, typeAndData, crcBuf]);
  }

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Art Generator: Dark squircle with glowing gradient rings and atomic habit vote nucleus
function habitIconPainter(x, y, w, h) {
  const nx = (x / w) * 2 - 1; // -1 to 1
  const ny = (y / h) * 2 - 1;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background rounded squircle
  const cornerRadius = 0.8;
  const inSquircle = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4) < cornerRadius;

  if (!inSquircle) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Dark background gradient (#0b0f19 to #131b2e)
  let r = Math.round(11 + (ny + 1) * 4);
  let g = Math.round(15 + (ny + 1) * 6);
  let b = Math.round(25 + (ny + 1) * 10);
  let a = 255;

  // Outer glowing ring
  const ringDist = Math.abs(dist - 0.65);
  if (ringDist < 0.05) {
    const ringIntensity = 1 - (ringDist / 0.05);
    // Gradient from emerald (16, 185, 129) to purple (139, 92, 246)
    const t = (nx + 1) / 2;
    r = Math.round(r * (1 - ringIntensity) + (16 * (1 - t) + 139 * t) * ringIntensity);
    g = Math.round(g * (1 - ringIntensity) + (185 * (1 - t) + 92 * t) * ringIntensity);
    b = Math.round(b * (1 - ringIntensity) + (129 * (1 - t) + 246 * t) * ringIntensity);
  }

  // 3 Elliptical atomic habit loops (rotations -30 deg, 30 deg, 90 deg)
  const angles = [-Math.PI / 6, Math.PI / 6, Math.PI / 2];
  for (let ang of angles) {
    const rx = nx * Math.cos(ang) - ny * Math.sin(ang);
    const ry = nx * Math.sin(ang) + ny * Math.cos(ang);
    const ellipseDist = Math.abs(Math.sqrt((rx / 0.68) * (rx / 0.68) + (ry / 0.28) * (ry / 0.28)) - 1);
    if (ellipseDist < 0.08) {
      const loopIntensity = (1 - (ellipseDist / 0.08)) * 0.85;
      r = Math.round(r * (1 - loopIntensity) + 59 * loopIntensity);
      g = Math.round(g * (1 - loopIntensity) + 130 * loopIntensity);
      b = Math.round(b * (1 - loopIntensity) + 246 * loopIntensity);
    }
  }

  // Center nucleus (Identity Core)
  if (dist < 0.22) {
    if (dist < 0.10) {
      // White inner core
      r = 255; g = 255; b = 255;
    } else {
      // Emerald / Blue gradient nucleus
      const coreT = dist / 0.22;
      r = Math.round(16 * (1 - coreT) + 59 * coreT);
      g = Math.round(185 * (1 - coreT) + 130 * coreT);
      b = Math.round(129 * (1 - coreT) + 246 * coreT);
    }
  }

  return [r, g, b, a];
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192, habitIconPainter));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512, habitIconPainter));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPng(180, 180, habitIconPainter));
console.log('✅ Generated icon-192.png, icon-512.png, and apple-touch-icon.png');
