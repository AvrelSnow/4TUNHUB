"use client";

import { useSyncExternalStore } from "react";
import {
  CONSENT_DENIED,
  CONSENT_EVENT,
  CONSENT_GRANTED,
  CONSENT_STORAGE_KEY,
  type ConsentCategory,
  type ConsentRecord,
  type ConsentState,
  isCurrentRecord,
  recordFrom,
} from "@/lib/consent";

/**
 * The consent answer, read as an external store — the same shape the
 * theme control uses, so this tab, other tabs and every component that
 * depends on it all look at one value.
 *
 * Everything here is wrapped in try/catch: localStorage throws outright
 * in some private windows, and a site that crashes because it could not
 * remember a privacy choice has failed at the one thing it was asked.
 */

/** Where the answer lives when storage refuses it (private windows). */
let inMemory: ConsentRecord | null = null;

/**
 * Cached so `getSnapshot` returns a stable reference between changes —
 * `useSyncExternalStore` re-renders forever if it does not.
 */
let cached: ConsentRecord | null = null;
let cachedRaw: string | null | undefined;

function readRaw(): string | null {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function readConsent(): ConsentRecord | null {
  const raw = readRaw();
  if (raw === cachedRaw) return cached ?? inMemory;
  cachedRaw = raw;
  cached = null;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isCurrentRecord(parsed)) cached = parsed;
    } catch {
      // A corrupted or outdated answer is no answer: we ask again.
    }
  }
  return cached ?? inMemory;
}

export function writeConsent(state: ConsentState): ConsentRecord {
  const record = recordFrom(state);
  inMemory = record;
  cached = record;
  try {
    const raw = JSON.stringify(record);
    localStorage.setItem(CONSENT_STORAGE_KEY, raw);
    cachedRaw = raw;
  } catch {
    // Costs the answer on the next page load, nothing on this one.
    cachedRaw = undefined;
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return record;
}

export const acceptAll = () => writeConsent(CONSENT_GRANTED);
export const declineAll = () => writeConsent(CONSENT_DENIED);

export function setCategory(category: ConsentCategory, allowed: boolean) {
  const current = readConsent();
  const base: ConsentState = current
    ? { analytics: current.analytics, embeds: current.embeds }
    : CONSENT_DENIED;
  return writeConsent({ ...base, [category]: allowed });
}

function subscribe(onChange: () => void) {
  // `storage` fires in other tabs only, so same-tab writes announce
  // themselves with a custom event.
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

/**
 * Global Privacy Control: a browser-level "do not sell or share my data"
 * signal, which several jurisdictions treat as a legally binding refusal.
 * We honour it as a decline, and we do not argue with it by showing a
 * banner over the top of a choice the visitor has already made once, for
 * every site they visit.
 */
export function globalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl === true;
}

/** The server renders as if nothing were allowed — because nothing is. */
const serverSnapshot = (): ConsentRecord | null => null;

export type ConsentView = {
  /** Null until the visitor answers. Never assume "no answer" means yes. */
  record: ConsentRecord | null;
  state: ConsentState;
  /** True once there is an answer, or a browser-level refusal. */
  answered: boolean;
  gpc: boolean;
  /** False during the server render and the first paint. */
  ready: boolean;
};

export function useConsent(): ConsentView {
  const record = useSyncExternalStore(subscribe, readConsent, serverSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const gpc = ready && globalPrivacyControl();
  const state: ConsentState = record
    ? { analytics: record.analytics, embeds: record.embeds }
    : CONSENT_DENIED;

  return { record, state, answered: Boolean(record) || gpc, gpc, ready };
}
