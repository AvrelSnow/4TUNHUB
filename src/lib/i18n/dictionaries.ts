import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

/**
 * Dictionaries are dynamically imported and run server-only, so
 * translation files never reach the client bundle. `getDictionary`
 * returns the localized copy for a page/layout.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

export type { Dictionary };
