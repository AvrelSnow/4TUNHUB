"use client";

import { useEffect, useId, useState } from "react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = { key: string; label: string; href: string };

/**
 * Mobile navigation — accessible disclosure panel below the header.
 * Escape closes; navigating closes; body scroll locks while open;
 * the toggle reports state via aria-expanded / aria-controls.
 *
 * The panel carries EN·FR because the header switcher is hidden below
 * sm — without it a phone visitor had no way into the other language.
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
        className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="relative block h-4 w-5" aria-hidden="true">
          <span
            className={`absolute left-0 top-0.5 h-0.5 w-5 rounded bg-current transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute bottom-0.5 left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-16 z-40 border-b border-border bg-background shadow-e2"
        >
          <nav aria-label={dict.nav.mobile} className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.key}>
                  <NavLink
                    href={item.href}
                    onNavigate={() => setOpen(false)}
                    className="block w-fit py-2.5 text-base"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-border pt-4">
              <LanguageSwitcher locale={locale} label={dict.nav.language} inMenu />
            </div>
            <div className="mt-4 border-t border-border pt-5">
              <Button as="a" href={ctaHref} size="lg" className="w-full">
                {dict.nav.workWithUs}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
