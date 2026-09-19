#!/usr/bin/env node
/**
 * Writes a 720px-wide "-sm.webp" beside every photograph that is shown as a
 * card, a tile or part of the home fan. Phones on mobile data download the
 * small one; large screens and the lightbox still get the original.
 * Media.tsx picks between them with srcset (`responsive` prop).
 *
 *   node scripts/make-thumbnails.mjs
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(process.cwd(), "public", "images");
const WIDTH = 720;

const targets = [
  ...readdirSync(join(ROOT, "projects"))
    .filter((f) => /-hero\.webp$/.test(f))
    .map((f) => join(ROOT, "projects", f)),
  ...readdirSync(join(ROOT, "camrail"))
    .filter((f) => /\.webp$/.test(f) && !/-sm\.webp$/.test(f))
    .map((f) => join(ROOT, "camrail", f)),
  join(ROOT, "founder-portrait.webp"),
];

let before = 0;
let after = 0;
for (const src of targets) {
  const out = src.replace(/\.webp$/, "-sm.webp");
  const meta = await sharp(src).metadata();
  const info = await sharp(src)
    .resize({ width: Math.min(WIDTH, meta.width ?? WIDTH) })
    .webp({ quality: 74 })
    .toFile(out);
  const { size } = await sharp(src).toBuffer({ resolveWithObject: true }).then((r) => r.info);
  before += size;
  after += info.size;
  console.log(`${out.replace(process.cwd(), ".")}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`\n${targets.length} files · originals ${(before / 1024).toFixed(0)} KB → small ${(after / 1024).toFixed(0)} KB`);
