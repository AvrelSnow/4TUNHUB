#!/usr/bin/env node
/**
 * Image pipeline (R11). Source art lives outside the repo; this resizes and
 * converts it to WebP in public/images/ so we ship small, fast assets.
 * Transparent art keeps its alpha channel. Re-run after adding sources.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DOWNLOADS = "C:/Users/fortu/Downloads";
const PORTFOLIO = "C:/Users/fortu/GitHub-Projects/Portfolio-project/assets/images";
// BMP sources pre-converted to PNG (sharp can't read BMP).
const SCRATCH = "C:/Users/fortu/AppData/Local/Temp/claude/C--4TUNHUB-com/2b1eb0dd-2fde-446e-9eac-56423fe657ee/scratchpad";
const OUT = join(process.cwd(), "public", "images");

for (const dir of [OUT, join(OUT, "projects"), join(OUT, "logos"), join(OUT, "camrail")]) {
  mkdirSync(dir, { recursive: true });
}

/** [sourceDir, file, outPath, maxWidth, opts] */
const JOBS = [
  // --- Decorative art ---
  [DOWNLOADS, "pngwing.com.png", "cfd-vehicle.webp", 1000, { alpha: true, q: 82 }],
  [DOWNLOADS, "pngwing.com (1).png", "mech-figure.webp", 700, { alpha: true, q: 80 }],
  [DOWNLOADS, "pexels-adrien-olichon-1257089-2387532.jpg", "texture-ridges.webp", 1920, { q: 68 }],

  // === PROJECT IMAGES — curated set, one hero + gallery per project ===

  // FSAE (unchanged: reference photo; CFD render is the illustrative gallery)
  [PORTFOLIO, "Fsae-car-image.jpg", "projects/fsae-hero.webp", 1200, { q: 78 }],

  // Banana-pseudostem shredder (hero + 14) — full portfolio documentation set
  [PORTFOLIO, "Machine-TOWE-3.jpg", "projects/banana-hero.webp", 1400, { q: 74 }],
  [PORTFOLIO, "Banana-Pseudo-shredder-machine-A2.jpg", "projects/banana-1.webp", 1400, { q: 80 }],
  [PORTFOLIO, "Resultat-essai-TOWE.jpg", "projects/banana-2.webp", 1200, { q: 80 }],
  [PORTFOLIO, "schema-cinematique-TOWE.jpg", "projects/banana-3.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Principe-de-broyage-TOWE.jpg", "projects/banana-4.webp", 1200, { q: 80 }],
  [PORTFOLIO, "l'essai-de-la-pendule-pesant-TOWE.jpg", "projects/banana-5.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Diagramme-FAST-TOWE.jpg", "projects/banana-6.webp", 1200, { q: 80 }],
  [PORTFOLIO, "The Blade lock.jpg", "projects/banana-7.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Shaft.jpg", "projects/banana-8.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Front plate.jpg", "projects/banana-9.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Frame.jpg", "projects/banana-10.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Blade.jpg", "projects/banana-11.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Blade Box Folded Plate.jpg", "projects/banana-12.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Blade box back plate.jpg", "projects/banana-13.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Banana Pseudostem shredding machine full BOM.jpg", "projects/banana-14.webp", 1400, { q: 80 }],

  // Locomotive braking (hero + 3)
  [PORTFOLIO, "CC3300-AC-LOCOMOTIVE.jpg", "projects/braking-hero.webp", 1200, { q: 78 }],
  [PORTFOLIO, "TBS-1.jpg", "projects/braking-1.webp", 1200, { q: 78 }],
  [PORTFOLIO, "BRAKING-SHOES-FOR-CC_2200-LOCOMOTIVES.jpg", "projects/braking-2.webp", 1200, { q: 78 }],
  [PORTFOLIO, "braking-shoes-of-the-CC2200.png", "projects/braking-3.webp", 1300, { q: 80 }],

  // Motorised wheelbarrow (hero + 8; three motor images pre-converted from BMP)
  [PORTFOLIO, "WheelBarrow-2.jpg", "projects/wheelbarrow-hero.webp", 1200, { q: 78 }],
  [PORTFOLIO, "WHEELBARROW FULL 2D ASSEMBLY.png", "projects/wheelbarrow-1.webp", 1400, { q: 80 }],
  [PORTFOLIO, "WHEELBARROW ASSEMBLY- WHEEL,SHAFT AND DRIVING ORGANE..png", "projects/wheelbarrow-2.webp", 1400, { q: 80 }],
  [PORTFOLIO, "WHEELBARROW ASSEMBLY - CHASSIS.png", "projects/wheelbarrow-3.webp", 1400, { q: 80 }],
  [SCRATCH, "wheelbarrow-motor-exploded.png", "projects/wheelbarrow-4.webp", 1400, { q: 80 }],
  [PORTFOLIO, "Wheelbarrow 3d model.jpg", "projects/wheelbarrow-5.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Wheelbarrow 3d model-zoomed.jpg", "projects/wheelbarrow-6.webp", 1200, { q: 80 }],
  [SCRATCH, "wheelbarrow-motor-components-2.png", "projects/wheelbarrow-7.webp", 1200, { q: 80 }],
  [SCRATCH, "wheelbarrow-motor-components-1.png", "projects/wheelbarrow-8.webp", 1200, { q: 80 }],

  // Pedal-power charger (hero + 15) — full portfolio documentation set
  [PORTFOLIO, "Pedal power mobile phone charger.png", "projects/pedal-hero.webp", 1200, { q: 80 }],
  [PORTFOLIO, "calculation-pic-1.png", "projects/pedal-1.webp", 1200, { q: 82 }],
  [PORTFOLIO, "circuit-image.png", "projects/pedal-2.webp", 1200, { q: 82 }],
  [PORTFOLIO, "PPMPC-Full assembly.png", "projects/pedal-3.webp", 1200, { q: 80 }],
  [PORTFOLIO, "PPMPC-Frame.png", "projects/pedal-4.webp", 1200, { q: 80 }],
  [PORTFOLIO, "PPMPC-Exploded view.png", "projects/pedal-5.webp", 1200, { q: 80 }],
  [PORTFOLIO, "the-design-simplification-for-the-fea-simulation.jpg", "projects/pedal-6.webp", 1200, { q: 80 }],
  [PORTFOLIO, "charges on bicycle.jpg", "projects/pedal-7.webp", 1200, { q: 80 }],
  [PORTFOLIO, "support-description.png", "projects/pedal-8.webp", 1200, { q: 82 }],
  [PORTFOLIO, "Von-mises-stress.png", "projects/pedal-9.webp", 900, { q: 82 }],
  [PORTFOLIO, "support-description-2.png", "projects/pedal-10.webp", 1200, { q: 82 }],
  [PORTFOLIO, "real-one-ppmpc.273.png", "projects/pedal-11.webp", 1400, { q: 74 }],
  [PORTFOLIO, "real-one-ppmpc.274.png", "projects/pedal-12.webp", 1400, { q: 74 }],
  [PORTFOLIO, "real-one-ppmpc.275.png", "projects/pedal-13.webp", 1400, { q: 74 }],
  [PORTFOLIO, "images of rear mount of the pedal power project.png", "projects/pedal-14.webp", 1200, { q: 80 }],
  [PORTFOLIO, "force exerted for the pedal project.png", "projects/pedal-15.webp", 1200, { q: 82 }],

  // Beans unwrapping machine — BUR (hero + 10) — full portfolio documentation set
  [PORTFOLIO, "Real-BUR.jpg", "projects/beans-hero.webp", 1200, { q: 78 }],
  [PORTFOLIO, "Bur-Explanation-1.png", "projects/beans-1.webp", 1300, { q: 82 }],
  [PORTFOLIO, "Bur-Explanation-2.png", "projects/beans-2.webp", 1300, { q: 82 }],
  [PORTFOLIO, "Kinematic-diagram-of-the-Bur.png", "projects/beans-3.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Legend-of-the-Bur.png", "projects/beans-4.webp", 1000, { q: 82 }],
  [PORTFOLIO, "BUR Frame.png", "projects/beans-5.webp", 1400, { q: 82 }],
  [PORTFOLIO, "BUR Shaft.png", "projects/beans-6.webp", 1400, { q: 82 }],
  [PORTFOLIO, "BUR-Render-2.jpg", "projects/beans-7.webp", 1200, { q: 80 }],
  [PORTFOLIO, "BUR-Render-1.jpg", "projects/beans-8.webp", 1200, { q: 80 }],
  [PORTFOLIO, "BUR-Render-3.jpg", "projects/beans-9.webp", 1200, { q: 80 }],
  [PORTFOLIO, "Bur-test-and-validation.png", "projects/beans-10.webp", 1300, { q: 82 }],

  // --- Affiliate logos (real marks only, full colour, trimmed to content) ---
  [DOWNLOADS, "camrail logo.png", "logos/camrail.webp", 300, { logo: true }],
  [DOWNLOADS, "Enset logo.jpg", "logos/enset.webp", 300, { logo: true }],
  [DOWNLOADS, "IUC logo.jpg", "logos/iuc.webp", 300, { logo: true }],
  [DOWNLOADS, "university of douala logo.jpg", "logos/univ-douala.webp", 300, { logo: true }],
  [DOWNLOADS, "user group solidworks logo.jpg", "logos/solidworks-ug.webp", 300, { logo: true }],
  [PORTFOLIO, "Renewable Energy Mall & Engineering Reviews Logo.png", "logos/rem.webp", 300, { logo: true }],

  // --- Founder portrait (for the About/Founder pillar) ---
  [PORTFOLIO, "Donfack_Fortune_portrait.jpeg", "founder-portrait.webp", 800, { q: 80 }],

  // --- CAMRAIL experience page (real on-site work) ---
  [PORTFOLIO, "My Image 3.jpg", "camrail/portrait.webp", 900, { q: 80 }],
  [PORTFOLIO, "Braking support for locomotive BB1100 and CC3300AC full view.jpeg", "camrail/brake-support.webp", 1200, { q: 78 }],
  [PORTFOLIO, "compressor test bench.jpeg", "camrail/test-bench.webp", 1200, { q: 78 }],
  [PORTFOLIO, "compressor test bench before optimisation-1.jpeg", "camrail/bench-before.webp", 1200, { q: 78 }],
  [PORTFOLIO, "CC3300AC Compressors.jpeg", "camrail/cc3300ac-compressors.webp", 1200, { q: 78 }],
  [PORTFOLIO, "CC2500 Compressors.jpeg", "camrail/cc2500-compressors.webp", 1200, { q: 78 }],
  [PORTFOLIO, "intercity trains.jpeg", "camrail/intercity-trains.webp", 1200, { q: 78 }],
  [PORTFOLIO, "Intercity trains wagons .jpeg", "camrail/train-wagons.webp", 1200, { q: 78 }],
];

let total = 0;
let missing = 0;
for (const [dir, file, out, width, opts] of JOBS) {
  const src = join(dir, file);
  if (!existsSync(src)) {
    console.warn(`  ! missing: ${file}`);
    missing++;
    continue;
  }
  const dest = join(OUT, out);
  let pipe = sharp(src);
  if (opts.logo) {
    // Flatten onto white, trim the uniform white border → tight, consistent
    // logos that sit cleanly inside their white chip. Colour is preserved.
    pipe = pipe
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 12 });
  }
  await pipe
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: opts.logo ? 90 : opts.q, alphaQuality: opts.alpha ? 90 : undefined })
    .toFile(dest);

  const before = statSync(src).size / 1024;
  const after = statSync(dest).size / 1024;
  total += after;
  console.log(
    `  ✓ ${out.padEnd(46)} ${before.toFixed(0).padStart(5)} KB → ${after.toFixed(0).padStart(4)} KB`,
  );
}
console.log(`\n  ${JOBS.length - missing}/${JOBS.length} assets · ${total.toFixed(0)} KB total\n`);
