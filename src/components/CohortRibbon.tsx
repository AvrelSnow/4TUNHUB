"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Chevron } from "./ui/ArrowLink";
import { COHORT_PATH, applicationsOpen } from "@/lib/cohort";

// The clock, read as an external store: the server snapshot says "open"
// (the layout only renders this while it is), and the client re-reads it,
// so a deploy older than the deadline hides the ribbon without a
// hydration mismatch.
const noopSubscribe = () => () => {};
const serverOpen = () => true;

/**
 * The announcement bar above the header while Cohort 0 applications are
 * open. Server-rendered, so it never pops in and shifts the page. It stays
 * off the cohort page itself, which says it better.
 *
 * Amber, not the grey surface (reviewed 2026-09-20): on a quiet white page
 * a grey bar reads as chrome and gets skipped. This is the one element on
 * the site with a deadline on it, so it carries the brand fill and ink
 * type — 9.2:1, and the same colours in both themes, because a deadline
 * does not care what time it is where you are. The link inside is ink too:
 * the accent brown would sit at 2.8:1 on this ground.
 */
export function CohortRibbon({
  href,
  text,
  short,
  cta,
}: {
  href: string;
  text: string;
  /** The phone version: one line. */
  short: string;
  cta: string;
}) {
  const pathname = usePathname();
  const open = useSyncExternalStore(noopSubscribe, applicationsOpen, serverOpen);

  if (!open || pathname.endsWith(COHORT_PATH)) return null;

  return (
    <div className="bg-brand-500 text-center">
      <Link
        href={href}
        className="group mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-5 py-2.5 text-2xs font-medium text-ink-900 transition-colors hover:bg-brand-400 sm:text-sm"
      >
        <span className="hidden sm:inline">{text}</span>
        <span className="sm:hidden">{short}</span>
        <span className="inline-flex items-center gap-0.5 font-semibold underline decoration-ink-900/30 underline-offset-4 group-hover:decoration-ink-900">
          {cta}
          <Chevron />
        </span>
      </Link>
    </div>
  );
}
