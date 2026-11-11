"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeName, type Locale } from "@/lib/i18n/config";
import { stripLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * EN | FR. Keeps the current path when switching language, marks the
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

  // In the bar: a segmented pill (after Fapshi), the active language
  // raised on a white chip. In the phone menu: thumb-sized targets.
  return (
    <div
      role="group"
      aria-label={label}
      className={
        inMenu
          ? "flex items-center gap-1 rounded-full bg-surface p-1"
          : "hidden items-center rounded-full bg-surface p-0.5 sm:flex"
      }
    >
      {locales.map((l) => {
        const active = l === locale;
        const href = `/${l}${rest === "/" ? "" : rest}`;
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            aria-label={localeName[l]}
            className={cn(
              "inline-flex items-center justify-center rounded-full text-2xs font-semibold uppercase tracking-wide transition-[background-color,color,box-shadow] duration-300",
              inMenu ? "min-h-11 min-w-14 text-sm" : "h-8 min-w-10 px-2.5",
              active
                ? "bg-surface-2 text-foreground shadow-e1"
                : "text-muted hover:text-foreground",
            )}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
