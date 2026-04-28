// Run: node scripts/generateNoise.js
// Outputs: public/noise.png and prints a base64 version to stdout.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SIZE = 200;
const outputPath = path.join(process.cwd(), "public", "noise.png");

function buildCrcTable() {
  const table = new Array(256);

  for (let n = 0; n < 256; n += 1) {
    let c = n;

    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }

    table[n] = c >>> 0;
  }

  return table;
}

const CRC_TABLE = buildCrcTable();

function crc32(buffer) {
  let crc = 0xffffffff;

  for (let index = 0; index < buffer.length; index += 1) {
    crc = CRC_TABLE[(crc ^ buffer[index]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    rgbaBuffer.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }

  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function createNoiseBuffer() {
  const pixels = Buffer.alloc(SIZE * SIZE * 4);

  for (let index = 0; index < pixels.length; index += 4) {
    const value = Math.floor(Math.random() * 255);
    pixels[index] = Math.min(255, value + 12);
    pixels[index + 1] = Math.min(255, value + 6);
    pixels[index + 2] = value;
    pixels[index + 3] = 255;
  }

  return pixels;
}

function writeNoisePng(buffer) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log("Wrote", outputPath);
  console.log("BASE64:", buffer.toString("base64"));
}

function generateWithCanvas() {
  const { createCanvas } = require("canvas");
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(SIZE, SIZE);

  for (let index = 0; index < imageData.data.length; index += 4) {
    const value = Math.floor(Math.random() * 255);
    imageData.data[index] = Math.min(255, value + 12);
    imageData.data[index + 1] = Math.min(255, value + 6);
    imageData.data[index + 2] = value;
    imageData.data[index + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer("image/png");
}

function main() {
  let pngBuffer;

  try {
    pngBuffer = generateWithCanvas();
  } catch (error) {
    console.warn("canvas package unavailable, falling back to built-in PNG generation.");
    pngBuffer = encodePng(SIZE, SIZE, createNoiseBuffer());
  }

  writeNoisePng(pngBuffer);
}

main();
