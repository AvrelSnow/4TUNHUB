/**
 * CSWA Bootcamp · Cohort 0 — the facts the page, the ribbon and the
 * application form share. Copy lives in the dictionaries; dates and
 * limits live here, once. Source: docs/launch-plan.md.
 */

export const COHORT_PATH = "/academy/cohort-0";

/** Applications close at the end of Thursday 1 October, Cameroon time. */
export const APPLICATIONS_CLOSE = "2026-10-01T23:59:59+01:00";

export const COHORT_SEATS = 20;

export function applicationsOpen(now: Date = new Date()): boolean {
  return now.getTime() < new Date(APPLICATIONS_CLOSE).getTime();
}

/** The <select> options, and the server's allow-list. */
export const SW_VERSIONS = ["2025", "2024", "2023", "older", "student", "none"] as const;
export type SwVersion = (typeof SW_VERSIONS)[number];

export type ApplyField = "name" | "email" | "whatsapp" | "org" | "sw" | "why" | "consent";

/** Error codes, resolved to copy by dict.cohort.form.errors on the client. */
export type ApplyError =
  | "required"
  | "emailInvalid"
  | "whatsappInvalid"
  | "choose"
  | "tooShort"
  | "tooLong"
  | "consent"
  | "closed"
  | "rateLimited"
  | "failed"
  | "unavailable";

export type ApplyState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<ApplyField, ApplyError>>;
  formError?: ApplyError;
  values?: Partial<Record<ApplyField, string>>;
};

export const initialApplyState: ApplyState = { status: "idle" };

export const APPLY_LIMITS = {
  nameMax: 120,
  emailMax: 200,
  whatsappMax: 30,
  orgMax: 160,
  whyMin: 30,
  whyMax: 1500,
} as const;
