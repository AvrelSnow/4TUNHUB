"use client";

import { PROGRESS_KEY, readProgress, updateProgress, type Progress } from "@/lib/path-progress";
import { PRACTICE_KEY, readPractice, replacePractice, type Entry, type Practice, type Run } from "@/lib/practice/progress";

/**
 * Save and restore a learner's progress as a small file, because nothing is
 * kept anywhere but this device. A loaded file is read field by field: a
 * damaged or edited one must never break a page.
 */

const FORMAT = "4tunhub-engineering-thinking";

export function backupText(): string {
  return JSON.stringify(
    { format: FORMAT, version: 1, [PROGRESS_KEY]: readProgress(), [PRACTICE_KEY]: readPractice() },
    null,
    1,
  );
}

type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj => (x && typeof x === "object" && !Array.isArray(x) ? (x as Obj) : {});
const pick = <T,>(x: unknown, ok: (v: unknown) => v is T): Record<string, T> =>
  Object.fromEntries(Object.entries(obj(x)).filter((e): e is [string, T] => ok(e[1])));
const isTrue = (v: unknown): v is true => v === true;
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isText = (v: unknown): v is string => typeof v === "string";
const texts = (x: unknown) => (Array.isArray(x) ? x.filter(isText) : []);

function run(x: unknown): Run | undefined {
  const r = obj(x);
  if (!isText(r.version) || !isNumber(r.seed)) return undefined;
  const results: Run["results"] = {};
  for (const [step, value] of Object.entries(obj(r.results))) {
    const v = obj(value);
    if (v.status !== "correct" && v.status !== "correct_method" && v.status !== "wrong") continue;
    results[step] = {
      status: v.status,
      diagnosis: isText(v.diagnosis) ? v.diagnosis : null,
      hint: isText(v.hint) ? v.hint : null,
    };
  }
  return {
    version: r.version,
    seed: r.seed,
    text: pick(r.text, isText),
    answers: pick(r.answers, isNumber),
    results,
    used: pick(r.used, isNumber),
    keys: texts(r.keys),
  };
}

/** The saved progress, or null if this is not a file of ours. */
export function parseBackup(text: string): { path: Progress; practice: Practice } | null {
  let file: Obj;
  try {
    file = obj(JSON.parse(text));
  } catch {
    return null;
  }
  if (file.format !== FORMAT) return null;
  const p = obj(file[PROGRESS_KEY]);
  const last = obj(p.last);
  const kind = last.kind;
  const practice: Practice = {};
  for (const [id, value] of Object.entries(obj(file[PRACTICE_KEY]))) {
    const e = obj(value);
    const entry: Entry = { proved: pick(e.proved, isTrue) };
    const r = run(e.run);
    if (r) entry.run = r;
    if (e.cleared === true) entry.cleared = true;
    practice[id] = entry;
  }
  return {
    path: {
      seen: pick(p.seen, isTrue),
      passed: pick(p.passed, isTrue),
      parts: pick(p.parts, isNumber),
      last:
        (kind === "lesson" || kind === "warmup" || kind === "challenge") && isText(last.id)
          ? { kind, id: last.id }
          : undefined,
      days: texts(p.days),
      noted: texts(p.noted),
    },
    practice,
  };
}

export function restore(saved: { path: Progress; practice: Practice }) {
  updateProgress(() => saved.path);
  replacePractice(saved.practice);
}

export function startOver() {
  restore({ path: { seen: {}, passed: {}, parts: {}, days: [], noted: [] }, practice: {} });
}
