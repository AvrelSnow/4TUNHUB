/**
 * The shelf's filter values, kept apart from shelf.ts: the browser component
 * needs these, and must not pull the whole catalogue (and the lesson data
 * it points at) into the client bundle.
 */

export const SHELF_KINDS = ["book", "course"] as const;
export const SHELF_SUBJECTS = ["mechanical", "electronics", "maths", "programming", "design"] as const;
export const SHELF_LANGS = ["en", "fr"] as const;
export const SHELF_PRICES = ["free", "paid"] as const;

export type ShelfKind = (typeof SHELF_KINDS)[number];
export type ShelfSubject = (typeof SHELF_SUBJECTS)[number];
export type ShelfLang = (typeof SHELF_LANGS)[number];
export type ShelfPrice = (typeof SHELF_PRICES)[number];
