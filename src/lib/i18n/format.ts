import type { Locale } from "./config";
import { localeTag } from "./config";

/**
 * Locale-aware formatting via the platform Intl APIs — no library.
 * Currency defaults to XAF (Central African CFA franc, Cameroon);
 * pass "USD" for international digital goods.
 */

export function formatDate(
  value: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
): string {
  return new Intl.DateTimeFormat(localeTag[locale], options).format(
    value instanceof Date ? value : new Date(value),
  );
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(localeTag[locale], options).format(value);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency: "XAF" | "USD" = "XAF",
): string {
  return new Intl.NumberFormat(localeTag[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "XAF" ? 0 : 2,
  }).format(value);
}
