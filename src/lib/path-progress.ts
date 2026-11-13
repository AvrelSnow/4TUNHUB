"use client";

import { useSyncExternalStore } from "react";

/**
 * Where a learner is on the path, kept on this device only: lessons
 * finished, checks passed, how far into each lesson they got. No account,
 * nothing sent anywhere. Listed in the privacy note's storage table under
 * this key; keep the two in step.
 *
 * The same external-store shape as the consent and theme controls, with
 * every storage call wrapped: private windows throw, and a lesson must
 * never break because it could not remember a tick.
 */

export const PROGRESS_KEY = "4tun.path";
const EVENT = "4tun:path";

export type Progress = {
  /** Lessons read to the end. */
  seen: Record<string, true>;
  /** Checks passed without showing the working. */
  passed: Record<string, true>;
  /** How many parts of each lesson are open. */
  parts: Record<string, number>;
};

const EMPTY: Progress = { seen: {}, passed: {}, parts: {} };

let inMemory: Progress = EMPTY;
let cachedRaw: string | null | undefined;
let cached: Progress = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(PROGRESS_KEY);
  } catch {
    return null;
  }
}

export function readProgress(): Progress {
  const raw = readRaw();
  if (raw === null) return inMemory;
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    cached = { seen: parsed.seen ?? {}, passed: parsed.passed ?? {}, parts: parsed.parts ?? {} };
  } catch {
    cached = EMPTY;
  }
  return cached;
}

export function updateProgress(change: (p: Progress) => Progress) {
  const next = change(readProgress());
  inMemory = next;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  } catch {
    // Kept for this visit only.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, readProgress, () => EMPTY);
}

/**
 * The number a student typed, read by the same rules as the Lab's grader
 * (4tunlab/units.read_number; the Lab's lesson.js mirrors it and its tests
 * hold both to one corpus). One case has two honest readings — a single
 * comma followed by exactly three digits — and only French settles it.
 */
export function readNumber(
  text: string,
  lang: string,
): { value: number } | { error: "empty" | "unreadable" | "ambiguous" } {
  let t = String(text ?? "").replace(/\s+/g, "").replace(/−/g, "-").replace(/'/g, "");
  if (!t) return { error: "empty" };
  t = t.replace(/E/g, "e");
  const parts = t.split("e");
  if (parts.length > 2) return { error: "unreadable" };
  let mantissa = parts[0];
  const exponent = parts.length === 2 ? parts[1] : null;
  let sign = "";
  if (mantissa && (mantissa[0] === "+" || mantissa[0] === "-")) {
    sign = mantissa[0];
    mantissa = mantissa.slice(1);
  }
  if (!mantissa || !/^[\d.,]+$/.test(mantissa)) return { error: "unreadable" };
  if (exponent !== null && !/^[-+]?\d+$/.test(exponent)) return { error: "unreadable" };

  const grouped = (groups: string[]) =>
    groups.length > 0 &&
    groups[0].length >= 1 &&
    groups[0].length <= 3 &&
    groups.every((g, i) => /^\d+$/.test(g) && (i === 0 || g.length === 3));

  const commas = (mantissa.match(/,/g) || []).length;
  const dots = (mantissa.match(/\./g) || []).length;
  let digits: string;
  if (commas && dots) {
    const decimal = mantissa.lastIndexOf(",") > mantissa.lastIndexOf(".") ? "," : ".";
    const group = decimal === "," ? "." : ",";
    const halves = mantissa.split(decimal);
    if (halves.length !== 2) return { error: "unreadable" };
    if (!grouped(halves[0].split(group))) return { error: "unreadable" };
    digits = halves[0].split(group).join("") + "." + halves[1];
  } else if (commas || dots) {
    const sep = commas ? "," : ".";
    const ps = mantissa.split(sep);
    if (ps.length > 2) {
      if (!grouped(ps)) return { error: "unreadable" };
      digits = ps.join("");
    } else {
      const [whole, frac] = ps;
      if (sep === "," && frac.length === 3 && whole && whole[0] !== "0" && whole.length <= 3 && lang !== "fr") {
        return { error: "ambiguous" };
      }
      digits = whole + "." + frac;
    }
  } else {
    digits = mantissa;
  }
  if (digits === "." || digits === "") return { error: "unreadable" };
  const value = Number(sign + digits + (exponent !== null ? "e" + exponent : ""));
  if (!Number.isFinite(value)) return { error: "unreadable" };
  return { value };
}
