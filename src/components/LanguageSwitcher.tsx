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
  inMenu = false,
}: {
  locale: Locale;
  label: string;
  /** Rendered inside the mobile panel: always visible, thumb-sized targets. */
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
            {/* A semantic token, not a palette step: `ink-300` was picked when
                there was one ground and measures 1.9:1 on the day sheet, so
                the separator all but disappeared. `hairline` is what this
                actually is — a rule — and it follows the ground. */}
            {i > 0 && <span className="mx-1 text-hairline" aria-hidden="true">·</span>}
            <Link
              href={href}
              hrefLang={l}
              aria-current={active ? "true" : undefined}
              aria-label={localeName[l]}
              className={cn(
                "font-mono text-xs uppercase transition-colors",
                inMenu && "inline-flex min-h-11 min-w-11 items-center justify-center text-sm",
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
