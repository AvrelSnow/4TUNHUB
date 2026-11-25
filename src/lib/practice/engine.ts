/**
 * The practice engine: drawing a learner's numbers and judging an answer.
 *
 * This is the Lab's grader (4tunlab/seed.py and grade.py) rewritten for the
 * browser, and held to it by scripts/check-lab-parity.mjs. It imports
 * nothing at run time, so that script can load it directly.
 *
 * Practice only: everything here runs on the learner's own device, so the
 * answers can be found by someone who goes looking. Nothing built on it may
 * be offered as proof to a third party.
 */

export type Params = Record<string, number | string>;
// Each challenge knows the shape of its own constants.
export type Constants = Record<string, unknown>;
export type Chain = Record<string, number | null>;

export type Logic = {
  validate(params: Params, constants: Constants): boolean;
  /** Values implied by the drawn ones (the brief prints them). */
  derive?(params: Params, constants: Constants): Params;
  /** One step. Pass the correct chain, or the learner's own for follow-through. */
  solveStep(step: string, params: Params, constants: Constants, prior: Chain): number | null;
  /** Known mistakes per step, in match order. */
  fingerprintIds: Record<string, string[]>;
  fingerprints(
    step: string,
    params: Params,
    constants: Constants,
    correct: Chain,
  ): Partial<Record<string, number | null>>;
};

export type Tolerance = { type: "rel" | "abs" | "exact"; value?: number };
export type Step = { id: string; unit: string; signed: boolean; tolerance: Tolerance };
export type ParamSpec = { values?: (number | string)[]; min?: number; max?: number; step?: number };

export type Status = "correct" | "correct_method" | "wrong";
export type Verdict = { status: Status; diagnosis: string | null };

export const CLEARED: readonly Status[] = ["correct", "correct_method"];

/** A small seeded generator (mulberry32): the same seed, the same numbers. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MAX_DRAWS = 2000;

/** Rejection-sample a valid parameter set. Keys in sorted order, as in the Lab. */
export function drawParams(
  spec: Record<string, ParamSpec>,
  seed: number,
  logic: Logic,
  constants: Constants,
): Params {
  const random = seeded(seed);
  const keys = Object.keys(spec).sort();
  for (let i = 0; i < MAX_DRAWS; i++) {
    const params: Params = {};
    for (const key of keys) {
      const s = spec[key];
      if (s.values) {
        params[key] = s.values[Math.floor(random() * s.values.length)];
      } else {
        const rungs = Math.round((s.max! - s.min!) / s.step!);
        params[key] = s.min! + s.step! * Math.floor(random() * (rungs + 1));
      }
    }
    if (!logic.validate(params, constants)) continue;
    return logic.derive ? logic.derive(params, constants) : params;
  }
  throw new Error("practice: no valid numbers in the declared space");
}

export function solve(steps: Step[], logic: Logic, params: Params, constants: Constants): Chain {
  const chain: Chain = {};
  for (const s of steps) chain[s.id] = logic.solveStep(s.id, params, constants, chain);
  return chain;
}

const EXACT_EPSILON = 1e-9;

export function withinTolerance(value: number, expected: number | null, tolerance: Tolerance): boolean {
  if (expected === null) return false;
  const off = Math.abs(value - expected);
  if (tolerance.type === "exact") return off <= EXACT_EPSILON;
  if (tolerance.type === "abs") return off <= tolerance.value!;
  return off <= tolerance.value! * Math.abs(expected);
}

/**
 * Judge one step. `given` is every answer the learner has typed so far: a
 * step is compared with the true value and with the value that follows from
 * their own earlier answers, so one slip gets one diagnosis.
 */
export function gradeStep(
  step: Step,
  steps: Step[],
  logic: Logic,
  params: Params,
  constants: Constants,
  value: number,
  given: Record<string, number>,
): Verdict {
  const correct = solve(steps, logic, params, constants);
  const expected = correct[step.id];
  const v = step.signed ? value : Math.abs(value);

  const prior: Chain = { ...correct };
  for (const s of steps) if (s.id in given) prior[s.id] = s.signed ? given[s.id] : Math.abs(given[s.id]);
  delete prior[step.id];

  if (withinTolerance(v, expected, step.tolerance)) return { status: "correct", diagnosis: null };

  const followed = logic.solveStep(step.id, params, constants, prior);
  if (
    followed !== null &&
    Number.isFinite(followed) &&
    !withinTolerance(followed, expected, step.tolerance) &&
    withinTolerance(v, followed, step.tolerance)
  ) {
    return { status: "correct_method", diagnosis: null };
  }

  const prints = logic.fingerprints(step.id, params, constants, correct);
  const diagnosis =
    (logic.fingerprintIds[step.id] ?? []).find((id) => {
      const print = prints[id];
      return print !== undefined && print !== null && withinTolerance(v, print, step.tolerance);
    }) ?? null;
  return { status: "wrong", diagnosis };
}

/**
 * "This value, on this step, from these earlier answers": sent again, it is
 * the same attempt and costs nothing.
 */
export function stepKey(step: Step, steps: Step[], value: number, given: Record<string, number>): string {
  const same = (x: number) => Number((step.signed ? x : Math.abs(x)).toPrecision(12));
  const earlier = steps.slice(0, steps.findIndex((s) => s.id === step.id));
  return JSON.stringify([
    step.id,
    same(value),
    earlier.filter((s) => s.id in given).map((s) => [s.id, Number(given[s.id].toPrecision(12))]),
  ]);
}

/** How a number looks in a brief: French takes a decimal comma. */
export function formatValue(value: unknown, lang: string): string {
  if (typeof value === "number" && !Number.isInteger(value) && lang === "fr") {
    return String(value).replace(".", ",");
  }
  return String(value);
}

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Fill every {{name}}; a missing one throws rather than reaching a learner. */
export function fill(template: string, values: Record<string, unknown>, lang: string): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    if (!(name in values)) throw new Error(`practice: the sheet wants {{${name}}}`);
    return escapeXml(formatValue(values[name], lang));
  });
}

/** "7.85 × 10^-9" is how a textbook writes 7.85e-9. */
export function plainPower(text: string): string {
  return text.replace(/\s*[x×*·]\s*10\s*\^\s*([-+−]?\d+)\s*$/i, "e$1");
}
