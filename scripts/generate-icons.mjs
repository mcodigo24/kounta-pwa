// Genera los íconos PWA a partir del ícono launcher de la app Android (3 barras blancas sobre #AD8B73).
import sharp from "sharp";

const BG = "#AD8B73";
const bars = `<path fill="#FFFFFF" d="M34,38h40v8H34zM34,52h40v8H34zM34,66h28v8H34z"/>`;

const svg = (rounded) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><rect width="108" height="108" rx="${rounded ? 24 : 0}" fill="${BG}"/>${bars}</svg>`,
  );

const targets = [
  ["public/icons/icon-192.png", 192, true],
  ["public/icons/icon-512.png", 512, true],
  ["public/icons/maskable-512.png", 512, false],
  ["public/icons/apple-touch-icon.png", 180, false],
];

for (const [path, size, rounded] of targets) {
  await sharp(svg(rounded), { density: 384 }).resize(size, size).png().toFile(path);
  console.log("ok", path);
}
