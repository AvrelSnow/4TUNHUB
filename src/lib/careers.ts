import { WHATSAPP_COMMUNITY_URL } from "./site";

/**
 * ============================================================
 * CAREERS — real-only, same contract as blog.ts and commerce.ts.
 * ============================================================
 * Structural facts only (slug, kind, location, commitment). Every
 * word of prose lives in the dictionaries so EN/FR parity stays
 * enforced by the type system.
 *
 * `roles` is EMPTY on purpose, and that is the honest state: 4TUN
 * Hub is founder-led today and has no salary to pay. A careers page
 * that invents openings to look established is the same lie as a
 * store that lists products nobody can buy — and it is worse here,
 * because the people it wastes are job seekers.
 *
 * So the page does not advertise. It states the position plainly,
 * commits to how hiring will work when it starts, and points at the
 * three doors that are genuinely open today.
 */

export type RoleKind = "engineering" | "education" | "research" | "operations";

export type Role = {
  /** Stable id, kebab-case, e.g. "simulation-engineer". */
  slug: string;
  kind: RoleKind;
  /** Where the work happens, plainly stated. */
  location: string;
  commitment: "full-time" | "part-time" | "contract" | "internship";
  /** ISO date the role opened, used for sorting. */
  posted: string;
  /** Where to apply. Absent while the role is still being written. */
  href?: string;
  /** Hidden from the index and from search while true. */
  draft?: boolean;
};

/** Real openings only. Empty renders the honest state instead. */
export const roles: Role[] = [];

export const openRoles = (): Role[] =>
  roles.filter((r) => !r.draft).sort((a, b) => b.posted.localeCompare(a.posted));

/**
 * The doors that are actually open today. Not "ways to stay in touch"
 * — each of these is a live surface someone can walk into this week,
 * and each is the honest answer to "can I be part of this yet?".
 */
export type EntryPoint = {
  key: "community" | "academy" | "collaborate";
  href: string;
  /** Leaves the site — rendered with the external link treatment. */
  external?: boolean;
  /** Rendered with the amber "open now" badge. */
  live?: boolean;
};

export const entryPoints: EntryPoint[] = [
  { key: "community", href: WHATSAPP_COMMUNITY_URL, external: true, live: true },
  { key: "academy", href: "/academy" },
  { key: "collaborate", href: "/contact" },
];

/** The commitments that govern hiring when it starts, in display order. */
export const hiringPrinciples = ["paid", "proof", "local", "open"] as const;
