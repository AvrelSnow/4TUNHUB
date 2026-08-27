#!/usr/bin/env node
/**
 * R3 — JS budget gate. Run AFTER `next build`.
 * Measures gzipped client JS in .next/static/chunks and fails (exit 1)
 * if the total or the largest chunk exceeds performance-budgets.json.
 *
 * Turbopack's build manifest is sparse for the App Router, so we gate on
 * total + largest-chunk gzipped size — stable and tool-agnostic — rather
 * than fragile per-route mapping.
 *
 *   node scripts/check-bundle-size.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = process.cwd();
const CHUNKS_DIR = join(ROOT, ".next", "static", "chunks");
const budgets = JSON.parse(
  readFileSync(join(ROOT, "performance-budgets.json"), "utf8"),
).clientJs;

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p));
    else if (entry.name.endsWith(".js")) out.push(p);
  }
  return out;
}

let files;
try {
  files = walk(CHUNKS_DIR);
} catch {
  console.error("✗ No build found at .next/static/chunks — run `next build` first.");
  process.exit(1);
}

const kb = (bytes) => bytes / 1024;
let total = 0;
let largest = { name: "", gz: 0 };

for (const file of files) {
  const gz = gzipSync(readFileSync(file)).length;
  total += gz;
  if (gz > largest.gz) largest = { name: file.split(/[\\/]/).pop(), gz };
}

const totalKB = kb(total);
const largestKB = kb(largest.gz);

const rows = [
  {
    metric: "Total client JS (gzip)",
    value: totalKB,
    budget: budgets.totalGzipKB,
  },
  {
    metric: "Largest chunk (gzip)",
    value: largestKB,
    budget: budgets.largestChunkGzipKB,
  },
];

let failed = false;
console.log("\n  Performance budget — client JS\n");
for (const r of rows) {
  const ok = r.value <= r.budget;
  if (!ok) failed = true;
  const pct = ((r.value / r.budget) * 100).toFixed(0);
  console.log(
    `  ${ok ? "✓" : "✗"} ${r.metric.padEnd(26)} ${r.value.toFixed(1).padStart(7)} KB / ${String(r.budget).padStart(3)} KB budget  (${pct}%)`,
  );
}
console.log(`\n  ${files.length} chunks · largest: ${largest.name}\n`);

if (failed) {
  console.error("✗ Bundle exceeds budget. Trim JS or justify a budget bump in performance-budgets.json.\n");
  process.exit(1);
}
console.log("✓ Within budget.\n");
