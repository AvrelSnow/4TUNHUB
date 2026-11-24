"use client";

import { useSyncExternalStore } from "react";

/**
 * The boxes a learner ticks on the route page, kept on this device only:
 * no account, nothing sent anywhere. Listed in the privacy note's storage
 * table under this key; keep the two in step.
 *
 * Same external-store shape as path-progress.ts, and every storage call is
 * wrapped: a private window throws, and the page must never break because
 * it could not remember a tick. The route's lessons are not ticked here:
 * the guided path already remembers those (path-progress.ts).
 */

export const ROUTE_KEY = "4tun.route";
const EVENT = "4tun:route";

export type Ticks = Record<string, true>;

const EMPTY: Ticks = {};

let inMemory: Ticks = EMPTY;
let cachedRaw: string | null | undefined;
let cached: Ticks = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(ROUTE_KEY);
  } catch {
    return null;
  }
}

function read(): Ticks {
  const raw = readRaw();
  if (raw === null) return inMemory;
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw) as Ticks;
    cached = parsed && typeof parsed === "object" ? parsed : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

export function toggleTick(id: string) {
  const now = { ...read() };
  if (now[id]) delete now[id];
  else now[id] = true;
  inMemory = now;
  try {
    localStorage.setItem(ROUTE_KEY, JSON.stringify(now));
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

export function useTicks(): Ticks {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
