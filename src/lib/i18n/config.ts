/**
 * ============================================================
 * i18n CONFIG — the locale contract (R1).
 * ============================================================
 * English is the default and source language. French is a fully
 * manual, professional localization (no machine translation).
 * Adding a language later = add the code here + a dictionary file;
 * no routing or component changes required.
 */

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** BCP-47 tags for Intl formatting and <html lang>. */
export const localeTag: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export const localeName: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** Type guard — narrows a raw string param to a supported Locale. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
