"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";
import { acceptAll, declineAll, useConsent } from "./consent-store";

export type ConsentStrings = {
  /** Accessible name of the bar. */
  label: string;
  title: string;
  body: string;
  /** The phone version: the same question, in one sentence. */
  short: string;
  accept: string;
  decline: string;
  more: string;
};

/**
 * The privacy bar, shown once, until it is answered.
 *
 * FOUR RULES IT KEEPS, AND WHY EACH ONE
 *
 * 1. It never blocks the page. No overlay, no focus trap, nothing over
 *    the Cohort 0 call to action on the one day traffic spikes. A bar at
 *    the bottom is read by anyone who wants to read it and steps in front
 *    of nobody.
 * 2. Refusing is exactly as easy as accepting: same size, same weight,
 *    same click count, side by side. A "Decline" rendered as faint small
 *    print is the dark pattern regulators name first, and it is also just
 *    dishonest.
 * 3. Neither button is amber. The site spends its one loud colour on the
 *    two things with a deadline — the ribbon and the exam voucher — and a
 *    privacy question is not one of them.
 * 4. Not answering is not consent. There is no X and no dismiss: closing
 *    it silently would have to mean either yes or no, and a visitor who
 *    pressed nothing said neither.
 *
 * It renders nothing until the store is readable, so the page never shows
 * the bar and then removes it from under a returning visitor's thumb.
 * Fixed to the viewport, so it cannot shift the layout it appears over.
 */
export function ConsentBanner({
  strings,
  privacyHref,
}: {
  strings: ConsentStrings;
  privacyHref: string;
}) {
  const { answered, ready } = useConsent();
  const pathname = usePathname();

  // Never on the privacy page itself. The same rule the cohort ribbon
  // follows: the page says it better, and here the bar would sit on top
  // of the very table that answers the question it is asking.
  const onPrivacyPage = pathname === privacyHref.split("#")[0];

  if (!ready || answered || onPrivacyPage) return null;

  return (
    <div
      role="region"
      aria-label={strings.label}
      className="fixed inset-x-0 bottom-0 z-40 animate-fade-in p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-2xl border border-border bg-surface-2 p-5 shadow-e2 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{strings.title}</p>
          <p className="mt-1.5 text-sm text-muted text-pretty">
            {/* On a phone the long version took 41% of the screen and sat on
                top of the hero. Same question, one sentence, and the full
                answer is one tap away in the link. */}
            <span className="sm:hidden">{strings.short}</span>
            <span className="hidden sm:inline">{strings.body}</span>{" "}
            <Link
              href={privacyHref}
              className="text-accent hover:underline hover:underline-offset-4"
            >
              {strings.more}
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="raised" onClick={() => acceptAll()}>
            {strings.accept}
          </Button>
          <Button variant="raised" onClick={() => declineAll()}>
            {strings.decline}
          </Button>
        </div>
      </div>
    </div>
  );
}
