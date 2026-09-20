/**
 * CSWA Bootcamp · Cohort 0 — the facts the page, the ribbon and the
 * application form share. Copy lives in the dictionaries; dates and
 * limits live here, once. Source: docs/launch-plan.md.
 */

export const COHORT_PATH = "/academy/cohort-0";
/** Where an applicant is sent to hand in their proof of membership. */
export const SCREENSHOTS_PATH = "/academy/cohort-0/screenshots";

/**
 * Cohort 0 runs with the Douala City SWUG, and membership of the group is
 * a condition of a seat. Every one of these links is therefore a step an
 * applicant has to complete — an empty one renders as plain text rather
 * than a dead link, so a missing URL is visible instead of broken.
 *
 * REQUIRED BEFORE LAUNCH: the first three.
 */
export const SWUG_NAME = "Douala City SWUG";
/** The group's page on SWUGN's own network: 483 members, verified 20 Sep 2026. */
export const SWUG_BEVY_URL = "https://community.swugn.org/douala-city-solidworks-user-group/";

/**
 * UNVERIFIED MAPPING — confirm before launch. Both company pages were
 * given as admin URLs, which no one but an admin can open, so which ID
 * belongs to which page is a guess from the numbering (LinkedIn IDs rise
 * over time, and the group is older than the Hub's page). Swapping these
 * two lines is the whole fix if the guess is wrong.
 */
export const SWUG_LINKEDIN_URL = "https://www.linkedin.com/company/105488333/";
/** The 4TUN Hub company page — not the founder's profile (see site.ts). */
export const HUB_LINKEDIN_URL = "https://www.linkedin.com/company/111010064/";

/**
 * Applications close at the end of Sunday 11 October, Cameroon time.
 * Moved from 1 October on 2026-09-20: six days was too short a window for
 * a form with four conditions in front of it, and the ambassador
 * programme had nowhere to live. The LAUNCH date did not move — see the
 * decision log in blueprint.ts.
 */
export const APPLICATIONS_CLOSE = "2026-10-11T23:59:59+01:00";

export const COHORT_SEATS = 20;

export function applicationsOpen(now: Date = new Date()): boolean {
  return now.getTime() < new Date(APPLICATIONS_CLOSE).getTime();
}

/** The <select> options, and the server's allow-list. */
export const SW_VERSIONS = ["2025", "2024", "2023", "older", "student", "none"] as const;
export type SwVersion = (typeof SW_VERSIONS)[number];

export type ApplyField =
  | "name"
  | "email"
  | "whatsapp"
  | "linkedin"
  | "org"
  | "sw"
  | "why"
  | "consent";

/** Error codes, resolved to copy by dict.cohort.form.errors on the client. */
export type ApplyError =
  | "required"
  | "emailInvalid"
  | "whatsappInvalid"
  | "linkedinInvalid"
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
  linkedinMax: 200,
  orgMax: 160,
  whyMin: 30,
  whyMax: 1500,
} as const;
