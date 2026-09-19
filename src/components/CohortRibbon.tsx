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
    <div className="bg-surface text-center">
      <Link
        href={href}
        className="group mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-5 py-2.5 text-2xs text-foreground sm:text-sm"
      >
        <span className="hidden sm:inline">{text}</span>
        <span className="sm:hidden">{short}</span>
        <span className="inline-flex items-center gap-0.5 font-medium text-accent group-hover:underline group-hover:underline-offset-4">
          {cta}
          <Chevron />
        </span>
      </Link>
    </div>
  );
}
