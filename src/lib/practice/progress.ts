"use client";

import { useSyncExternalStore } from "react";
import type { Status } from "./engine";

/**
 * A learner's practice challenges, kept on this device only: the seed their
 * numbers come from, what they answered, the attempts used, and which
 * challenges they have cleared. No account, nothing sent anywhere. Listed in
 * the privacy note's storage table under this key; keep the two in step.
 *
 * Same external-store shape as path-progress.ts, with every storage call
 * wrapped: a private window throws, and a challenge must still work.
 */

export const PRACTICE_KEY = "4tun.practice";
const EVENT = "4tun:practice";

export type Result = { status: Status; diagnosis: string | null; hint: string | null };

export type Run = {
  /** The challenge version the numbers were drawn for. */
  version: string;
  seed: number;
  /** What was typed, and the number it read as. */
  text: Record<string, string>;
  answers: Record<string, number>;
  results: Record<string, Result>;
  /** Attempts used per step on these numbers. */
  used: Record<string, number>;
  /** Submissions already counted: sent again, they cost nothing. */
  keys: string[];
};

export type Entry = { run?: Run; cleared?: true };
export type Practice = Record<string, Entry>;

const EMPTY: Practice = {};

let inMemory: Practice = EMPTY;
let cachedRaw: string | null | undefined;
let cached: Practice = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(PRACTICE_KEY);
  } catch {
    return null;
  }
}

export function readPractice(): Practice {
  const raw = readRaw();
  if (raw === null) return inMemory;
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw) as Practice;
    cached = parsed && typeof parsed === "object" ? parsed : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

export function updateEntry(id: string, change: (e: Entry) => Entry) {
  const all = readPractice();
  const next = { ...all, [id]: change(all[id] ?? {}) };
  inMemory = next;
  try {
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(next));
  } catch {
    // Kept for this visit only.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function freshRun(version: string): Run {
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  return { version, seed, text: {}, answers: {}, results: {}, used: {}, keys: [] };
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function usePractice(): Practice {
  return useSyncExternalStore(subscribe, readPractice, () => EMPTY);
}
