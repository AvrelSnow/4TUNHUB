/**
 * ============================================================
 * CONSENT — what is allowed to run on a visitor's machine.
 * ============================================================
 *
 * The honest position this file exists to keep:
 *
 *   The site sets NO cookies. It stores two things in the browser — the
 *   appearance you picked and the answer you gave here — and both stay on
 *   your device. The only thing that leaves is an anonymous visit count,
 *   and it does not run until someone says yes.
 *
 * WHY A REAL GATE AND NOT A DECORATIVE BANNER
 * A banner that says "Accept" and loads the script either way is worse
 * than no banner: it is a claim that is false, on a site whose entire
 * argument is that its engineering is honest. So `Accept` and `Decline`
 * both do exactly what they say, and nothing in a non-essential category
 * runs before one of them is pressed.
 *
 * WHY OPT-IN, WHEN COOKIELESS ANALYTICS IS ARGUABLY EXEMPT
 * Cookieless audience measurement can qualify for an exemption from prior
 * consent, so counting visits before an answer would probably be lawful
 * today. It stops being lawful the day the first YouTube replay, payment
 * form or chat widget lands — and that day is January, not next year.
 * Opt-in is the one rule that does not need revisiting when the site
 * grows, and the cost is a fraction of the visit count, which is a price
 * worth paying once rather than a legal question worth reopening twice.
 *
 * WHAT IS *NOT* ASKED ABOUT, AND WHY
 * The appearance preference (`4tun.theme`) and the record of this very
 * choice (`4tun.consent`) are strictly necessary for something the
 * visitor asked for: obeying a setting they chose, and not being asked
 * the same question on every page. Asking permission to remember that
 * permission was refused is the kind of theatre that makes people stop
 * reading banners.
 *
 * ADDING A CATEGORY LATER
 * Turn its `active` flag on here, give it a name and a description in the
 * dictionaries, and **bump CONSENT_VERSION**. Everyone who answered the
 * old question is asked the new one, because consent to count visits is
 * not consent to load a video player.
 */

/** Bump when the question changes. Old answers stop counting. */
export const CONSENT_VERSION = 1;

/** localStorage key. Namespaced like the theme key so it cannot collide. */
export const CONSENT_STORAGE_KEY = "4tun.consent";

/** Fired on the window when the choice changes in this tab. */
export const CONSENT_EVENT = "4tun:consent";

/** Anchor for the preferences block on the privacy page. */
export const CONSENT_ANCHOR = "storage";

export type ConsentCategory = "analytics" | "embeds";

/** What the visitor allowed, category by category. */
export type ConsentState = Record<ConsentCategory, boolean>;

/** The stored answer: the state, the version it answered, and when. */
export type ConsentRecord = ConsentState & {
  v: number;
  /** ISO date. Kept so we can say "you chose this on …" and prove it. */
  at: string;
};

/**
 * The categories, in the order they are shown.
 *
 * `active` is what keeps this honest: a category nobody uses yet is not
 * offered, because a switch labelled "Embedded media" on a site with no
 * embedded media teaches the visitor that the controls are decorative.
 */
export const CONSENT_CATEGORIES: readonly {
  id: ConsentCategory;
  active: boolean;
}[] = [
  { id: "analytics", active: true },
  // Turns on with the first YouTube replay, Bevy widget or payment form.
  // Until then those load behind a click-to-load placeholder instead.
  { id: "embeds", active: false },
];

/** Nothing non-essential runs until it is asked for. */
export const CONSENT_DENIED: ConsentState = { analytics: false, embeds: false };
export const CONSENT_GRANTED: ConsentState = { analytics: true, embeds: true };

export function activeCategories(): ConsentCategory[] {
  return CONSENT_CATEGORIES.filter((c) => c.active).map((c) => c.id);
}

/** Is this a record we still recognise, answering the current question? */
export function isCurrentRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Partial<ConsentRecord>;
  return (
    r.v === CONSENT_VERSION &&
    typeof r.at === "string" &&
    typeof r.analytics === "boolean" &&
    typeof r.embeds === "boolean"
  );
}

export function recordFrom(state: ConsentState): ConsentRecord {
  return { ...state, v: CONSENT_VERSION, at: new Date().toISOString() };
}
