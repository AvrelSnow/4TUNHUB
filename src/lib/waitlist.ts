/**
 * Waitlist — shared contract between the server action and the client UI.
 *
 * Same security shape as the contact and application forms: the server
 * action (waitlist-action.ts) validates everything, traps bots with a
 * honeypot, and rate-limits per IP. It returns error *codes*, never
 * localized strings, so the client maps codes → copy via the dictionary.
 *
 * The ask is deliberately small. A waitlist that demands a name, a company
 * and a paragraph is a contact form wearing a different hat, and it loses
 * most of the people who would have left an address. One field, plus the
 * tracks they want to hear about.
 */

/**
 * What a visitor can wait for. Each one is a real thing with a date
 * behind it — never a box that goes nowhere. Ticking a track *is* the
 * opt-in: it says which emails this person asked for, and nothing outside
 * their ticked tracks may ever be sent to them.
 */
export const TRACK_VALUES = ["lab", "academy", "rem", "products"] as const;
export type TrackValue = (typeof TRACK_VALUES)[number];

export type WaitlistField = "email" | "name" | "tracks";

/** Error codes, resolved to copy by dict.waitlist.form.errors on the client. */
export type WaitlistError =
  | "required"
  | "emailInvalid"
  | "tracksRequired"
  | "rateLimited"
  | "failed"
  /** No mail provider on this host: the client offers email instead. */
  | "unavailable";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<WaitlistField, WaitlistError>>;
  formError?: WaitlistError;
  /** Echoed back so nothing has to be retyped after an error. */
  values?: { email?: string; name?: string; tracks?: TrackValue[] };
};

export const initialWaitlistState: WaitlistState = { status: "idle" };

export const WAITLIST_LIMITS = {
  nameMax: 120,
  emailMax: 200,
} as const;
