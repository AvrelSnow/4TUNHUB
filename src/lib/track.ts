"use client";

import { useEffect } from "react";

/**
 * The events worth a name. Everything else — pages, referrers, countries —
 * the provider counts by itself; these are the three moments that say
 * whether the site is working. They live here, in the client module, so
 * nothing on a page has to import the server-side config to send one.
 */
export const ANALYTICS_EVENTS = {
  waitlist: "Waitlist signup",
  application: "Cohort 0 application",
  contact: "Contact message",
} as const;

/**
 * Sending an event — the client half of `analytics.ts`.
 *
 * Three rules:
 *  1. Never break a form. If the script was blocked, never loaded, or
 *     throws, the visitor must not be able to tell.
 *  2. Never send anything personal. An event is a name and, at most, a
 *     word like "academy" — never an address, never free text.
 *  3. Work with whatever provider is configured, or with none.
 */

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
    plausible?: ((event: string, opts?: { props: Record<string, string> }) => void) & {
      q?: unknown[];
    };
  }
}

export function track(event: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, props);
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics is never worth an error in front of a person.
  }
}

/**
 * Fires once, when `when` first becomes true — for the moment a form
 * flips to its success state. `props` is read at that moment and is
 * deliberately not a dependency: a new object every render would fire
 * the event on every render.
 */
export function useTrackOnce(
  when: boolean,
  event: string,
  props?: Record<string, string>,
): void {
  useEffect(() => {
    if (!when) return;
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when, event]);
}
