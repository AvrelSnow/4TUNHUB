"use server";

import { headers } from "next/headers";
import {
  LIMITS,
  TOPIC_VALUES,
  type ContactState,
  type FieldName,
  type TopicValue,
} from "./contact";

/**
 * R12 security contract — the server is the gate. Client validation is UX only.
 * Every field is validated here, a honeypot traps naive bots, and submissions
 * are rate-limited per IP. Errors are generic codes — internals are never echoed.
 *
 * Delivery is not wired while the build is local-only (no email provider yet).
 * `deliverMessage` is the single integration point: swap the body for a real
 * transport (Resend / SMTP / a queue) when the domain and infra land.
 */

// ---- Rate limiting (in-memory sliding window, per IP) --------------------
// In-memory is correct for a single-instance local/self-hosted build. If this
// ever runs multi-instance, move the window to a shared store (e.g. Redis).
const RATE_WINDOW_MS = 10 * 60_000; // 10 minutes
const RATE_MAX = 5; // messages per window per IP
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
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

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "local";
}

// ---- Validation ----------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

// ---- Delivery (integration point) ----------------------------------------
async function deliverMessage(payload: {
  name: string;
  email: string;
  topic: TopicValue;
  message: string;
}): Promise<void> {
  // TODO(post-local): replace with a real email/transport integration.
  // Kept as a server-side log so local submissions aren't silently dropped.
  console.info("[contact] new message", {
    name: payload.name,
    email: payload.email,
    topic: payload.topic,
    length: payload.message.length,
  });
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1) Honeypot — a real user never fills this. Pretend success, deliver nothing.
  if (str(formData, "company_website") !== "") {
    return { status: "success" };
  }

  // 2) Rate limit per IP.
  if (rateLimited(await clientIp())) {
    return { status: "error", formError: "rateLimited" };
  }

  // 3) Collect + validate.
  const name = str(formData, "name").slice(0, LIMITS.nameMax);
  const email = str(formData, "email").slice(0, LIMITS.emailMax);
  const topic = str(formData, "topic");
  const message = str(formData, "message");
  const values: Record<FieldName, string> = { name, email, topic, message };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "emailInvalid";
  if (!TOPIC_VALUES.includes(topic as TopicValue)) fieldErrors.topic = "topicRequired";
  if (!message) fieldErrors.message = "required";
  else if (message.length < LIMITS.messageMin) fieldErrors.message = "messageTooShort";
  else if (message.length > LIMITS.messageMax) fieldErrors.message = "messageTooLong";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  // 4) Deliver. Never leak internals — any failure is a generic code.
  try {
    await deliverMessage({ name, email, topic: topic as TopicValue, message });
  } catch {
    return { status: "error", formError: "failed", values };
  }

  return { status: "success" };
}
