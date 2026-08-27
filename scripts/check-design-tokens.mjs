#!/usr/bin/env node
/**
 * R8 — design-token lint gate. Fails (exit 1) when a component reaches past
 * the token system for values that MUST be tokens:
 *   - raw hex colors in className   → use color tokens
 *   - arbitrary font-size text-[..] → use the type scale (text-3xs … text-5xl)
 *   - arbitrary z-index z-[..]      → use the z scale (0 / 10 / 40 / 50)
 *
 * Structural arbitraries stay allowed (grid templates, micro-transforms,
 * transition property lists, aria-variant selectors, % min-widths, scale).
 *
 *   node scripts/check-design-tokens.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "src");

// Only .tsx — that's where className / token usage lives. Data/prose in
// .ts files (e.g. blueprint copy that quotes class names) is not scanned.
function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p));
    else if (/\.tsx$/.test(entry.name)) out.push(p);
  }
  return out;
}

// [pattern, message] — each match is a violation. Font/z patterns require a
// real leading digit so documentation like "text-[..px]" isn't flagged.
const RULES = [
  [/className=[^>]*#[0-9A-Fa-f]{3,6}\b/g, "raw hex color in className — use a color token"],
  [/\btext-\[[0-9][0-9.]*(px|rem|em)\]/g, "arbitrary font-size — use the type scale"],
  [/\bz-\[[0-9]+\]/g, "arbitrary z-index — use the z scale (0 / 10 / 40 / 50)"],
  [/\b(bg|text|border|fill|stroke|ring|shadow)-\[#[0-9A-Fa-f]/g, "arbitrary color utility — use a color token"],
];

let violations = [];
for (const file of walk(SRC)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const [re, msg] of RULES) {
      re.lastIndex = 0;
      if (re.test(line)) {
        violations.push({
          file: file.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", ""),
          line: i + 1,
          msg,
          snippet: line.trim().slice(0, 90),
        });
      }
    }
  });
}

console.log("\n  Design-token lint\n");
if (violations.length === 0) {
  console.log("  ✓ No token violations — every color, font-size and z-index is on the system.\n");
  process.exit(0);
}

for (const v of violations) {
  console.log(`  ✗ ${v.file}:${v.line}  ${v.msg}\n      ${v.snippet}`);
}
console.log(`\n  ${violations.length} violation(s). Replace with a token or justify a new one in globals.css.\n`);
process.exit(1);
