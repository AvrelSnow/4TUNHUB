import { headers } from "next/headers";

/**
 * Shared server-side guards for every form (R12 security contract):
 * a per-IP rate limit and field helpers. Imported only by server actions.
 */

// ---- Rate limiting (in-memory sliding window, per IP) --------------------
// In-memory is correct for a single instance. On a multi-instance host each
// instance keeps its own window, which still caps abuse per instance; move
// the window to a shared store (e.g. Redis) if that ever stops being enough.
const RATE_WINDOW_MS = 10 * 60_000; // 10 minutes
const RATE_MAX = 5; // submissions per window per IP, across all forms
const hits = new Map<string, number[]>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
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

export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "local";
}

// ---- Validation ----------------------------------------------------------
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** International phone: optional +, then 8–15 digits once spaces and dashes go. */
export const PHONE_RE = /^\+?\d{8,15}$/;

export function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}
