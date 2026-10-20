/**
 * CSWA Bootcamp · Cohort 0 — the facts the page, the ribbon and the
 * application form share. Copy lives in the dictionaries; dates and
 * limits live here, once. Source: docs/launch-plan.md.
 */

export const COHORT_PATH = "/academy/cohort-0";
/** Where an applicant is sent to hand in the screenshots of their follows. */
export const SCREENSHOTS_PATH = "/academy/cohort-0/screenshots";

/**
 * The 4TUNHub company page — not the founder's profile (see site.ts).
 * Following it on LinkedIn and on YouTube is a condition of a seat, so the
 * address is the page's public vanity URL, checked on 2 Oct 2026 (the
 * numeric admin ID it replaced was a guess).
 */
export const HUB_LINKEDIN_URL = "https://www.linkedin.com/company/4tunhub/";

/**
 * MKV Academy co-delivers Cohort 0 under a written agreement (1 Oct 2026):
 * Joseph Celestine Donald, CSWE, teaches alongside Fortune, and following
 * both organisations on LinkedIn and YouTube is a condition of a seat
 * (clause 4). Links taken from mkvacademy.online's own footer.
 */
export const MKV = {
  name: "MKV Academy",
  url: "https://www.mkvacademy.online",
  linkedin: "https://www.linkedin.com/showcase/mkv-academy/",
  youtube: "https://www.youtube.com/@mkvconsulting",
  logo: "/images/logos/mkv-academy.webp",
} as const;

export const MKV_INSTRUCTOR = { name: "Joseph Celestine Donald", credential: "CSWE" } as const;

/**
 * Applications close at the end of Sunday 11 October, Cameroon time.
 * Moved from 1 October on 2026-09-20: six days was too short a window for
 * a form with four conditions in front of it, and the ambassador
 * programme had nowhere to live. The LAUNCH date did not move — see the
 * decision log in blueprint.ts.
 */
export const APPLICATIONS_CLOSE = "2026-10-11T23:59:59+01:00";

export const COHORT_SEATS = 20;

/**
 * Local preview only: `NEXT_PUBLIC_PREVIEW_APPLICATIONS=open npm run dev`
 * shows the form after the deadline, so the next cohort's application can be
 * built and tested before it opens. A production build compiles this to
 * false whatever the variable says.
 */
const PREVIEW_OPEN =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_PREVIEW_APPLICATIONS === "open";

export function applicationsOpen(now: Date = new Date()): boolean {
  if (PREVIEW_OPEN) return true;
  return now.getTime() < new Date(APPLICATIONS_CLOSE).getTime();
}

/** Prefix of an application's reference, e.g. C0-7F3KQ. */
export const COHORT_REF_PREFIX = "C0";

/**
 * The four screenshots travel WITH the application, one file per follow.
 * They used to come by a separate email with a blank name line, and could
 * not be matched to the application they belonged to (inbox, Oct 2026).
 * The slot keys are the ones the screenshots page already names.
 */
export const PROOF_SLOTS = ["hubLinkedin", "hubYoutube", "mkvLinkedin", "mkvYoutube"] as const;
export type ProofSlot = (typeof PROOF_SLOTS)[number];
export type ProofField = `proof_${ProofSlot}`;
export const proofField = (slot: ProofSlot): ProofField => `proof_${slot}`;

/**
 * The browser shrinks each image to a JPEG no longer than `maxEdge` before
 * it is sent (a screenshot comes out around 250 KB). The server still
 * enforces `maxBytes` per file, because a request without JavaScript sends
 * the originals. Four at the cap stay under the 5 MB action limit in
 * next.config.ts, itself under the host's 6 MB request ceiling.
 */
export const PROOF_LIMITS = {
  maxEdge: 1600,
  maxBytes: 1_200_000,
  types: ["image/jpeg", "image/png", "image/webp"],
} as const;

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
  | "consent"
  | ProofField;

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
  | "proofMissing"
  | "proofType"
  | "proofTooLarge"
  | "proofUnreadable"
  | "closed"
  | "rateLimited"
  | "failed"
  | "unavailable";

export type ApplyState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<ApplyField, ApplyError>>;
  formError?: ApplyError;
  values?: Partial<Record<ApplyField, string>>;
  /** Set on success: the code in the inbox subject and in the receipt. */
  reference?: string;
  /** Whether the applicant was sent a receipt (needs a verified sender). */
  receipt?: boolean;
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
