/**
 * PRACTICE — the Lab's challenges inside Engineering Thinking.
 *
 * Words, numbers' ranges and drawings come from the Lab through
 * scripts/export-lab-challenges.py; the formulas are in ./challenges and are
 * held to the Lab's Python by scripts/check-lab-parity.mjs. Edit a challenge
 * in the Lab, then re-run both. Never edit the JSON by hand.
 *
 * Import this file from the server only: pages hand one challenge, in one
 * language, to the browser.
 */
import practice from "@/content/practice.json";
import warmup from "@/content/warmup.json";
import { PATH_ROOT } from "@/lib/engineering-thinking";
import type { Locale } from "@/lib/i18n/config";
import type { Constants, ParamSpec, Step } from "./engine";

export const PRACTICE_ROOT = `${PATH_ROOT}/practice`;
export const BRACKET_ID = "001-bracket";
export const challengePath = (id: string) => `${PRACTICE_ROOT}/${id}`;
export const warmupPath = (id: string) => `${PRACTICE_ROOT}/warmup/${id.replace("warmup-", "")}`;

type Words = { en: string; fr: string };

type Raw = {
  id: string;
  version: string;
  title: Words;
  constants: Constants;
  params: Record<string, ParamSpec>;
  attempts: number;
  steps: Step[];
  strings: Record<"step" | "diagnosis" | "hint", Record<string, Words>>;
  brief: Words;
  drawings: Record<Locale, Record<string, string>>;
};

const all = practice.challenges as unknown as Record<string, Raw>;

export const challengeIds = Object.keys(all);

/** The order a learner meets them in. */
export const GROUPS = {
  calculator: ["p004-limits-and-fits", "p005-solver-preflight", "p006-position-at-mmc"],
  cad: ["p001-stepped-block", "p002-stepped-shaft", "p003-driven-plate"],
} as const;

export type ChallengeView = ReturnType<typeof challengeView>;

export function challengeView(id: string, locale: Locale) {
  const c = all[id];
  const pick = (table: Record<string, Words>) =>
    Object.fromEntries(Object.entries(table).map(([k, v]) => [k, v[locale]]));
  return {
    id: c.id,
    version: c.version,
    title: c.title[locale],
    constants: c.constants,
    params: c.params,
    attempts: c.attempts,
    steps: c.steps,
    strings: {
      step: pick(c.strings.step),
      diagnosis: pick(c.strings.diagnosis),
      hint: pick(c.strings.hint),
    },
    brief: c.brief[locale],
    drawings: c.drawings[locale],
    status: pick(practice.status as Record<string, Words>),
    noDiagnosis: (practice.noDiagnosis as Words)[locale],
  };
}

export const summaries = (locale: Locale) =>
  Object.fromEntries(
    challengeIds.map((id) => [id, { title: all[id].title[locale], steps: all[id].steps.map((s) => s.id) }]),
  );

export type WarmupUnit = { id: string; title: string; minutes: number; steps: string[] };

export const warmupUnits = (locale: Locale) => (warmup as Record<Locale, WarmupUnit[]>)[locale];
