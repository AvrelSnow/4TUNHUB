"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeName, type Locale } from "@/lib/i18n/config";
import { stripLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * EN | FR toggle. Preserves the current path when switching language,
 * and marks the active locale via aria-current. hreflang on each link
 * tells crawlers what they'll get.
 */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = stripLocale(pathname);

  return (
    <div role="group" aria-label={label} className="hidden items-center gap-1 sm:flex">
      {locales.map((l, i) => {
        const active = l === locale;
        const href = `/${l}${rest === "/" ? "" : rest}`;
        return (
          <span key={l} className="flex items-center">
            {i > 0 && <span className="mx-1 text-ink-300" aria-hidden="true">·</span>}
            <Link
              href={href}
              hrefLang={l}
              aria-current={active ? "true" : undefined}
              aria-label={localeName[l]}
              className={cn(
                "font-mono text-xs uppercase transition-colors",
                active
                  ? "font-bold text-foreground"
                  : "text-muted hover:text-foreground",
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
