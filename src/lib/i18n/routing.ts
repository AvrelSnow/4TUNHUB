import type { Locale } from "./config";
import { locales } from "./config";

/**
 * Prefix an internal href with the active locale.
 * External links, mailto:, tel:, and #anchors pass through untouched.
 */
export function localizeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href; // external / mailto / anchor
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/** Strip the leading locale segment from a pathname → the locale-less rest. */
export function stripLocale(pathname: string): string {
  const match = pathname.match(new RegExp(`^/(${locales.join("|")})(?=/|$)`));
  if (!match) return pathname;
  const rest = pathname.slice(match[0].length);
  return rest || "/";
}
