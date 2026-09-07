"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  isThemePreference,
  msUntilNextSwitch,
  resolveTheme,
  type Theme,
  type ThemePreference,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * ============================================================
 * THEME CONTROL — the clock's override, and its clockwork.
 * ============================================================
 * One component owns both halves on purpose. The scheduling has no
 * UI of its own and the button is useless without it, so splitting
 * them would only mean two client components and two mount costs
 * for one behaviour.
 *
 * WHY A MANUAL OVERRIDE EXISTS AT ALL
 * "Light by day" is a good default and a terrible law. Someone
 * reading a CFD render at noon in a dark workshop, or anyone who
 * simply prefers the instrument ground, must be able to say so and
 * be obeyed — otherwise the site is telling a visitor it knows their
 * room better than they do. `auto` is the default; the other two are
 * a stated preference and outrank the clock permanently.
 *
 * WHAT IT DOES NOT DO
 * It does not decide the theme on first paint. That already happened,
 * in the blocking resolver from src/lib/theme.ts, before this file was
 * downloaded. On mount this component reconciles with what the
 * resolver did rather than re-deciding it, so there is never a second
 * flip a few hundred milliseconds into the page.
 */

/** Apply a resolved ground. Kept in one place; called from three. */
function paint(theme: Theme) {
  const root = document.documentElement;

  // Only write the attribute when it actually changes. Field.tsx watches
  // `data-theme` and re-initialises its canvas on every mutation, and
  // setting an attribute to the value it already holds still fires a
  // MutationObserver — so a blind write would re-seed every simulation on
  // the page each time the tab regained focus, for no change at all.
  if (root.getAttribute("data-theme") !== theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }

  // The meta is written unconditionally, because on first mount the
  // attribute is ALREADY correct — the pre-paint resolver set it — while the
  // meta still carries the server's night value. Skipping it here alongside
  // the attribute would leave the browser chrome advertising a dark page
  // behind a pale one, on exactly the load where it matters most.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const ground = getComputedStyle(root).getPropertyValue("--color-background").trim();
    if (ground && meta.getAttribute("content") !== ground) {
      meta.setAttribute("content", ground);
    }
  }
}

export type ThemeStrings = {
  /** Accessible name of the control, e.g. "Theme". */
  label: string;
  /** Visible mono readout + accessible name per preference. */
  options: Record<ThemePreference, string>;
  /** Appended to the accessible name: "… Switch to {next}." */
  next: string;
  /** Explains what `auto` follows, for the tooltip. */
  autoHint: string;
};

/**
 * The stated preference lives in localStorage, not in React state, so it is
 * read as an external store rather than copied into state by an effect.
 * That is what keeps the three readers — this tab, another tab, and the
 * blocking resolver that ran before React existed — looking at one value
 * instead of three drifting copies.
 */
const PREFERENCE_EVENT = "4tun:theme";

/**
 * Where the preference lives when storage refuses to hold it. Without this
 * the control is genuinely stuck in a private window: the write is thrown
 * away, the next read returns the old value, and every press computes the
 * same "next" — a button that visibly does nothing on the second click.
 * Here the choice survives the session and is simply forgotten on the next
 * page load, which is the most a browser that refuses storage will allow.
 */
let inMemoryPreference: ThemePreference = "auto";

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : inMemoryPreference;
  } catch {
    // Storage throws outright in some privacy modes.
    return inMemoryPreference;
  }
}

function writePreference(chosen: ThemePreference) {
  inMemoryPreference = chosen;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, chosen);
  } catch {
    // Costs the preference on the next page load, nothing on this one.
  }
}

function subscribePreference(onChange: () => void) {
  // `storage` fires in OTHER tabs only, so same-tab writes announce
  // themselves. Changing the ground in one tab and leaving the rest
  // disagreeing is the kind of thing only the person who built it misses.
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFERENCE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFERENCE_EVENT, onChange);
  };
}

/**
 * The server has no clock and no storage, so it renders `auto` — the
 * default — and React swaps in the real value on the client. Only this
 * control's own label is involved; no page content depends on the ground.
 */
const serverPreference = (): ThemePreference => "auto";

export function ThemeControl({ strings }: { strings: ThemeStrings }) {
  const preference = useSyncExternalStore(
    subscribePreference,
    readPreference,
    serverPreference,
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The clockwork. While the preference is `auto`, wake exactly once at the
  // next boundary, repaint, and re-arm from the new time — never a polling
  // interval, which would wake a backgrounded tab all night to learn
  // nothing. A stated preference cancels it: there is no boundary to cross.
  useEffect(() => {
    const clear = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };

    if (preference !== "auto") {
      clear();
      paint(preference);
      return clear;
    }

    const tick = () => {
      paint(resolveTheme("auto"));
      timer.current = setTimeout(tick, msUntilNextSwitch());
    };

    paint(resolveTheme("auto"));
    timer.current = setTimeout(tick, msUntilNextSwitch());

    // A laptop that slept through 18:00 fires the timer late or not at all,
    // so re-resolve whenever the tab comes back to the foreground.
    const onVisible = () => {
      if (document.hidden) return;
      paint(resolveTheme("auto"));
      clear();
      timer.current = setTimeout(tick, msUntilNextSwitch());
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clear();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [preference]);

  const cycle = useCallback(() => {
    const current = readPreference();
    const i = THEME_PREFERENCES.indexOf(current);
    const chosen = THEME_PREFERENCES[(i + 1) % THEME_PREFERENCES.length];
    writePreference(chosen);
    // Paint here rather than waiting for the effect: the visitor pressed a
    // button and is entitled to see it act, whatever storage decided.
    paint(resolveTheme(chosen));
    window.dispatchEvent(new Event(PREFERENCE_EVENT));
  }, []);

  const i = THEME_PREFERENCES.indexOf(preference);
  const upcoming = THEME_PREFERENCES[(i + 1) % THEME_PREFERENCES.length];

  return (
    <button
      type="button"
      onClick={cycle}
      // The visible text is the state, so the accessible name has to carry
      // the state AND the action — a bare "Theme" on a cycling control tells
      // a screen-reader user nothing about what pressing it will do.
      aria-label={`${strings.label}: ${strings.options[preference]}. ${strings.next} ${strings.options[upcoming]}.`}
      title={preference === "auto" ? strings.autoHint : undefined}
      // `readout` is the system's mono gutter label — the control states the
      // ground the way every other instrument on the page states a value.
      className={cn(
        "readout inline-flex h-8 items-center rounded-lg border border-border px-2.5",
        "transition-colors hover:border-hairline hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {strings.options[preference]}
    </button>
  );
}
