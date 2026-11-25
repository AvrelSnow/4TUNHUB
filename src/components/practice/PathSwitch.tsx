import Link from "next/link";
import { cn } from "@/lib/cn";
import { PATH_ROOT } from "@/lib/engineering-thinking";
import { PRACTICE_ROOT } from "@/lib/practice/data";
import { localizeHref } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";

/** The two places inside Engineering Thinking. */
export function PathSwitch({
  locale,
  here,
  t,
}: {
  locale: Locale;
  here: "path" | "practice";
  t: { label: string; path: string; practice: string };
}) {
  const places = [
    { id: "path", href: PATH_ROOT, label: t.path },
    { id: "practice", href: PRACTICE_ROOT, label: t.practice },
  ] as const;
  return (
    <nav aria-label={t.label} className="mb-8 grid grid-cols-2 gap-1 rounded-full bg-surface p-1 sm:max-w-xs">
      {places.map((p) => (
        <Link
          key={p.id}
          href={localizeHref(locale, p.href)}
          aria-current={here === p.id ? "page" : undefined}
          className={cn(
            "rounded-full py-2 text-center text-sm font-semibold transition-colors",
            here === p.id ? "bg-foreground text-background" : "text-muted hover:text-foreground",
          )}
        >
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
