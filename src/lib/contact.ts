/**
 * Contact form — shared contract between the server action and the client UI.
 *
 * The server action (contact-action.ts) is the security gate (R12): it
 * validates every field, checks a honeypot, and rate-limits per IP. It returns
 * error *codes* — never localized strings — so the server stays locale-agnostic
 * and the client maps codes → copy via the dictionary.
 */

/** Canonical topic values — the server allow-list and the <select> options. */
export const TOPIC_VALUES = [
  "services",
  "simulation",
  "energy",
  "training",
  "research",
  "other",
] as const;
export type TopicValue = (typeof TOPIC_VALUES)[number];

export type FieldName = "name" | "email" | "topic" | "message";

/** Error codes — resolved to copy by dict.contact.form.errors on the client. */
export type ErrorCode =
  | "required"
  | "emailInvalid"
  | "topicRequired"
  | "messageTooShort"
  | "messageTooLong"
  | "rateLimited"
  | "failed";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Per-field validation errors, as codes. */
  fieldErrors?: Partial<Record<FieldName, ErrorCode>>;
  /** Form-level error (rate limit / delivery failure), as a code. */
  formError?: ErrorCode;
  /** Submitted values, echoed back so the client can repopulate on error. */
  values?: Record<FieldName, string>;
};

export const initialContactState: ContactState = { status: "idle" };

/** Field bounds — enforced server-side; mirrored as UX hints client-side. */
export const LIMITS = {
  nameMax: 120,
  emailMax: 200,
  messageMin: 10,
  messageMax: 3000,
} as const;
