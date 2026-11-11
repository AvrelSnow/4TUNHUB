import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getStore, type Store } from "@netlify/blobs";

/**
 * Shared server-side guards for every form (R12 security contract):
 * a per-IP rate limit and field helpers. Imported only by server actions.
 */

// ---- Rate limiting (sliding window per IP, shared across instances) ------
// Netlify runs several function instances and starts fresh ones for a burst,
// so a window kept in memory let 7 of 7 rapid submissions through on the
// 2026-11-10 preview check (P-2). The window now lives in Netlify Blobs,
// shared by every instance, with strong consistency and conditional writes
// so two instances can't both take the last slot.
//
// Privacy: the store never holds an IP. The key is a SHA-256 of the IP
// salted with the UTC day, the value is a list of timestamps, and entries
// from earlier days are swept away. The salt changes at midnight UTC, which
// resets the window then; at worst that allows 2 × RATE_MAX across midnight.
//
// Off Netlify (local dev) or if the store fails, the old per-instance
// memory window takes over: weaker, but never no limit at all.
const RATE_WINDOW_MS = 10 * 60_000; // 10 minutes
const RATE_MAX = 5; // submissions per window per IP, across all forms
const STORE_NAME = "form-rate-limit";
const WRITE_ATTEMPTS = 4;
const SWEEP_CHANCE = 0.05;

export async function rateLimited(ip: string): Promise<boolean> {
  const now = Date.now();
  let store: Store;
  try {
    store = getStore({ name: STORE_NAME, consistency: "strong", fetch: storeFetch });
  } catch {
    return memoryLimited(ip, now); // no Blobs context: local dev, other host
  }
  const step = { name: "start" };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new StoreTimeout()), STORE_TIMEOUT_MS);
  });
  try {
    // A form must never hang on its rate limiter: past the deadline the
    // memory window decides and the store call is abandoned.
    return await Promise.race([sharedLimited(store, ip, now, step), timeout]);
  } catch (err) {
    // Name and step only: never the IP, the key or the payload.
    console.error(`[rate-limit] shared store ${err instanceof StoreTimeout ? "timed out" : `failed (${err instanceof Error ? err.name : "unknown"})`} at ${step.name}; using the in-memory window`);
    return memoryLimited(ip, now);
  } finally {
    clearTimeout(timer);
  }
}

const STORE_TIMEOUT_MS = 2500;

// Inside a server action `fetch` is Next's patched, caching fetch. With it,
// the store's first read hung until the 30 s function timeout on the
// 2026-11-11 preview; with `cache: "no-store"` it answered in well under a
// second. The abort closes a stalled socket instead of leaving it open
// after the deadline above.
const storeFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(STORE_TIMEOUT_MS) });

class StoreTimeout extends Error {
  name = "StoreTimeout";
}

const utcDay = (now: number) => new Date(now).toISOString().slice(0, 10);

function blobKey(ip: string, now: number): string {
  const day = utcDay(now);
  return `${day}/${createHash("sha256").update(`${day}|${ip}`).digest("hex")}`;
}

async function sharedLimited(
  store: Store,
  ip: string,
  now: number,
  step: { name: string },
): Promise<boolean> {
  const key = blobKey(ip, now);
  for (let attempt = 0; attempt < WRITE_ATTEMPTS; attempt++) {
    step.name = `read#${attempt + 1}`;
    const current = await store.getWithMetadata(key, { type: "json" });
    const stored: unknown = current?.data;
    const recent = (Array.isArray(stored) ? stored : []).filter(
      (t): t is number => typeof t === "number" && now - t < RATE_WINDOW_MS,
    );
    if (recent.length >= RATE_MAX) return true;
    recent.push(now);
    step.name = `write#${attempt + 1}`;
    const result = current
      ? await store.setJSON(key, recent, current.etag ? { onlyIfMatch: current.etag } : {})
      : await store.setJSON(key, recent, { onlyIfNew: true });
    if (result.modified) {
      step.name = "sweep";
      if (Math.random() < SWEEP_CHANCE) await sweep(store, now);
      return false;
    }
    // Another instance wrote first: read again and recount.
  }
  // Still losing the race after several tries means a burst is under way.
  return true;
}

/** Deletes entries from before yesterday so the store can't grow forever. */
async function sweep(store: Store, now: number): Promise<void> {
  const keep = new Set([utcDay(now), utcDay(now - 86_400_000)]);
  try {
    const { blobs } = await store.list();
    await Promise.all(
      blobs.filter((b) => !keep.has(b.key.split("/")[0])).map((b) => store.delete(b.key)),
    );
  } catch {
    // Housekeeping only; the next sweep tries again.
  }
}

const hits = new Map<string, number[]>();

function memoryLimited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent); // keep the window; don't add this attempt
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

// The rate limit is only as good as the IP it keys on. `x-forwarded-for` is
// a list the visitor can start themselves, so its first entry is forgeable.
// Netlify's edge sets `x-nf-client-connection-ip` from the TCP connection and
// overwrites any copy the client sends — Netlify's recommended client-IP
// header (docs.netlify.com documents the same value as `context.ip`, which a
// server action cannot reach). Off Netlify (local dev, another host) the
// header is absent and we fall back to the old behaviour.
export async function clientIp(): Promise<string> {
  const h = await headers();
  const netlify = h.get("x-nf-client-connection-ip")?.trim();
  if (netlify) return netlify;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "local";
}

// ---- Validation ----------------------------------------------------------
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** International phone: optional +, then 8–15 digits once spaces and dashes go. */
export const PHONE_RE = /^\+?\d{8,15}$/;

/**
 * A LinkedIn profile, however it was copied: with or without the protocol,
 * with or without www, a country subdomain (fr.linkedin.com), a trailing
 * slash or tracking query. We only need it to be a profile on LinkedIn —
 * whether it is the right person is a human check, not a regex.
 */
export const LINKEDIN_RE = /^(https?:\/\/)?([a-z]{2,3}\.)?(www\.)?linkedin\.com\/(in|pub)\/[^\s/?#]{2,}/i;

export function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}
