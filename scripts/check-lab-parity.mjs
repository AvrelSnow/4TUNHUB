#!/usr/bin/env node
/**
 * The browser engine against the Lab's Python engine.
 *
 *   python scripts/lab-parity.py --lab C:\4TUNHUBLAB.COM --out cases.json
 *   node scripts/check-lab-parity.mjs cases.json
 *
 * Also draws numbers for every challenge from many seeds and fills each
 * brief and drawing, so a missing placeholder fails here, not on a learner.
 * Needs Node 22.18+ (it imports the TypeScript directly).
 */
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";

// The site's imports carry no file extension; Node wants one.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith(".") && !/\.\w+$/.test(specifier)) {
      return next(specifier + ".ts", context);
    }
    return next(specifier, context);
  },
});

const engine = await import("../src/lib/practice/engine.ts");
const { LOGIC } = await import("../src/lib/practice/logic.ts");
const practice = JSON.parse(
  readFileSync(new URL("../src/content/practice.json", import.meta.url), "utf8"),
);
const casesFile = process.argv[2];
if (!casesFile) {
  console.error("usage: node scripts/check-lab-parity.mjs <cases.json from lab-parity.py>");
  process.exit(2);
}
const lab = JSON.parse(readFileSync(casesFile, "utf8"));

const failures = [];
let checked = 0;
const fail = (what) => failures.length < 20 ? failures.push(what) : failures.push("…");
const close = (a, b) =>
  a === b || (a !== null && b !== null && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)));

const labIds = Object.keys(lab).sort().join();
if (labIds !== Object.keys(practice.challenges).sort().join() || labIds !== Object.keys(LOGIC).sort().join()) {
  fail("the Lab, practice.json and logic.ts do not list the same challenges");
}

for (const [id, c] of Object.entries(practice.challenges)) {
  const logic = LOGIC[id];
  const data = lab[id];
  if (!logic || !data) continue;

  for (const [params, valid] of data.draws) {
    checked++;
    if (logic.validate(params, c.constants) !== valid) fail(`${id} validate ${JSON.stringify(params)}`);
  }

  for (const run of data.runs) {
    // The Lab's params are already derived; deriving again must change nothing.
    const derived = logic.derive ? logic.derive(run.params, c.constants) : run.params;
    for (const [k, v] of Object.entries(run.params)) {
      if (derived[k] !== v && !close(derived[k], v)) fail(`${id} derive ${k}: ${derived[k]} != ${v}`);
    }
    const chain = engine.solve(c.steps, logic, run.params, c.constants);
    for (const step of c.steps) {
      checked++;
      if (!close(chain[step.id], run.answers[step.id])) {
        fail(`${id} ${step.id}: ${chain[step.id]} != ${run.answers[step.id]}`);
      }
    }
    for (const t of run.cases) {
      checked++;
      const step = c.steps.find((s) => s.id === t.step);
      const got = engine.gradeStep(step, c.steps, logic, run.params, c.constants, t.value, t.given);
      if (got.status !== t.status || got.diagnosis !== t.diagnosis) {
        fail(`${id} ${t.step} value ${t.value}: ${got.status}/${got.diagnosis}, Lab says ${t.status}/${t.diagnosis}`);
      }
    }
  }

  // Every sheet fills, for many seeds, in both languages.
  for (let seed = 1; seed <= 500; seed++) {
    const params = engine.drawParams(c.params, seed * 7919, logic, c.constants);
    const values = { ...c.constants, ...params };
    for (const lang of ["en", "fr"]) {
      engine.fill(c.brief[lang], values, lang);
      for (const svg of Object.values(c.drawings[lang])) engine.fill(svg, values, lang);
      checked++;
    }
  }

  // Every step, mistake and hint has words in both languages.
  for (const step of c.steps) {
    const keys = [["step", step.id], ...(logic.fingerprintIds[step.id] ?? []).map((f) => ["diagnosis", f])];
    for (const [kind, key] of keys) {
      for (const lang of ["en", "fr"]) {
        if (!c.strings[kind][key]?.[lang]) fail(`${id}: no ${lang} ${kind} for ${key}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`✗ ${failures.length} difference(s):\n  ` + failures.slice(0, 20).join("\n  "));
  process.exit(1);
}
console.log(`✓ ${checked} checks agree with the Lab across ${Object.keys(LOGIC).length} challenges`);
