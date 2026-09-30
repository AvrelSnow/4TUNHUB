"use client";

import { cn } from "@/lib/cn";
import { activeCategories, type ConsentCategory } from "@/lib/consent";
import { setCategory, useConsent } from "./consent-store";

export type ConsentControlStrings = {
  /** Accessible name of the whole block. */
  label: string;
  categories: Record<ConsentCategory, { name: string; desc: string }>;
  allow: string;
  refuse: string;
  /** "You chose this on" — the date is appended. */
  chosenOn: string;
  /** Shown when the visitor has never answered. */
  notChosen: string;
  /** Shown when the browser is sending a Global Privacy Control signal. */
  gpc: string;
};

/**
 * The permanent version of the question the bar asks once.
 *
 * Withdrawing permission has to be as easy as giving it, which means it
 * cannot live only in a bar that disappears the moment it is answered.
 * This block sits on the privacy page, is linked from the footer of every
 * page, and takes effect on the next page view — the analytics script is
 * mounted by the same store these buttons write to, so switching it off
 * stops it being loaded again.
 *
 * A Global Privacy Control signal wins over the buttons and says so: the
 * visitor has already refused, at browser level, and a site that lets you
 * click "Allow" over the top of that is ignoring the refusal it just
 * acknowledged.
 */
export function ConsentControl({ strings }: { strings: ConsentControlStrings }) {
  const { state, record, gpc, ready } = useConsent();
  const categories = activeCategories();

  return (
    <div role="group" aria-label={strings.label} className="mt-8 rounded-2xl border border-border bg-surface p-6">
      {categories.map((id) => (
        <div key={id} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{strings.categories[id].name}</p>
            <p className="mt-1 text-sm text-muted text-pretty">{strings.categories[id].desc}</p>
          </div>
          <div
            role="group"
            aria-label={strings.categories[id].name}
            className="inline-flex shrink-0 items-center self-start rounded-full border border-border bg-surface-2 p-0.5"
          >
            {[true, false].map((allowed) => {
              const active = ready && !gpc && state[id] === allowed && Boolean(record);
              return (
                <button
                  key={String(allowed)}
                  type="button"
                  aria-pressed={active}
                  disabled={gpc}
                  onClick={() => {
                    const wasAllowed = Boolean(record) && state[id];
                    setCategory(id, allowed);
                    // Withdrawing has to stop it NOW, not on the next page.
                    // The script was injected into this document; unmounting
                    // the component that asked for it does not remove it, so
                    // the only honest way to end the session is to reload.
                    if (wasAllowed && !allowed) window.location.reload();
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {allowed ? strings.allow : strings.refuse}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="mt-5 border-t border-border pt-5 text-sm text-muted">
        {gpc
          ? strings.gpc
          : record
            ? `${strings.chosenOn} ${new Date(record.at).toLocaleDateString()}.`
            : strings.notChosen}
      </p>
    </div>
  );
}
