"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeName, type Locale } from "@/lib/i18n/config";
import { stripLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * EN · FR. Keeps the current path when switching language, marks the
 * active locale with aria-current, and tells crawlers what each link
 * leads to with hreflang.
 */
export function LanguageSwitcher({
  locale,
  label,
  inMenu = false,
}: {
  locale: Locale;
  label: string;
  /** Inside the mobile sheet: always visible, thumb-sized targets. */
  inMenu?: boolean;
}) {
  const pathname = usePathname();
  const rest = stripLocale(pathname);

  return (
    <div
      role="group"
      aria-label={label}
      className={inMenu ? "flex items-center gap-1" : "hidden items-center gap-1 sm:flex"}
    >
      {locales.map((l, i) => {
        const active = l === locale;
        const href = `/${l}${rest === "/" ? "" : rest}`;
        return (
          <span key={l} className="flex items-center">
            {i > 0 && (
              <span className="mx-0.5 text-subtle" aria-hidden="true">
                /
              </span>
            )}
            <Link
              href={href}
              hrefLang={l}
              aria-current={active ? "true" : undefined}
              aria-label={localeName[l]}
              className={cn(
                "text-2xs uppercase tracking-wide transition-colors",
                inMenu && "inline-flex min-h-11 min-w-11 items-center justify-center text-base",
                active ? "font-semibold text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {l}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
