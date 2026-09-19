"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = { key: string; label: string; href: string };

/**
 * The menu below lg: a full-height sheet under the bar, with the pillars
 * set large enough to hit with a thumb. Escape closes, navigating closes,
 * the page behind stops scrolling while it is open, and the toggle reports
 * its state through aria-expanded / aria-controls.
 *
 * The sheet is portalled to <body>: the bar's backdrop-filter makes it the
 * containing block for fixed descendants, which would trap the sheet inside
 * a 56px strip.
 */
export function MobileNav({
  items,
  dict,
  ctaHref,
  locale,
}: {
  items: Item[];
  dict: Dictionary;
  ctaHref: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-foreground"
      >
        <span className="relative block h-3 w-4" aria-hidden="true">
          <span
            className={cn(
              "absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300",
              open && "translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300",
              open && "-translate-y-1.5 -rotate-45",
            )}
          />
        </span>
      </button>

      {open && createPortal(
        <div
          id={panelId}
          className="fixed inset-x-0 bottom-0 top-14 z-40 animate-fade-in overflow-y-auto bg-background"
        >
          <nav aria-label={dict.nav.mobile} className="mx-auto max-w-6xl px-8 pb-12 pt-6">
            <ul className="flex flex-col">
              {items.map((item, i) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li
                    key={item.key}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block py-2.5 text-3xl font-semibold tracking-tight",
                        active ? "text-foreground" : "text-foreground/80 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
              <LanguageSwitcher locale={locale} label={dict.nav.language} inMenu />
              <Button as="a" href={ctaHref} size="md" onClick={() => setOpen(false)}>
                {dict.nav.workWithUs}
              </Button>
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}
