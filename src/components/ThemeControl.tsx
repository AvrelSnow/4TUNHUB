"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  DEFAULT_PREFERENCE,
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
 * THEME CONTROL — Auto · Light · Dark, and the clockwork.
 * ============================================================
 * First paint is already decided by the blocking resolver in
 * src/lib/theme.ts. On mount this component reconciles with it rather
 * than re-deciding, so there is never a second flip. While the
 * preference is `auto` it wakes once at the next 06:00 or 18:00 and
 * turns the page, instead of polling.
 */

/** Apply a resolved theme. */
function paint(theme: Theme) {
  const root = document.documentElement;
  if (root.getAttribute("data-theme") !== theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }

  // The server ships the day colour in <meta name="theme-color">; keep the
  // browser chrome in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const ground = getComputedStyle(root).getPropertyValue("--color-background").trim();
    if (ground && meta.getAttribute("content") !== ground) {
      meta.setAttribute("content", ground);
    }
  }
}

export type ThemeStrings = {
  /** Accessible name of the control group, e.g. "Appearance". */
  label: string;
  options: Record<ThemePreference, string>;
  /** Explains what `auto` follows, for the tooltip. */
  autoHint: string;
};

/**
 * The preference lives in localStorage and is read as an external store,
 * so this tab, other tabs and the pre-paint resolver all look at one value.
 */
const PREFERENCE_EVENT = "4tun:theme";

/** Where the choice lives when storage refuses it (private windows). */
let inMemoryPreference: ThemePreference = DEFAULT_PREFERENCE;

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : inMemoryPreference;
  } catch {
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
  // `storage` fires in other tabs only, so same-tab writes announce
  // themselves with a custom event.
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFERENCE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFERENCE_EVENT, onChange);
  };
}

const serverPreference = (): ThemePreference => DEFAULT_PREFERENCE;

function Icon({ kind }: { kind: ThemePreference }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "light") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" {...common}>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
      </svg>
    );
  }
  if (kind === "dark") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" {...common}>
        <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" {...common}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 2.25v11.5A5.75 5.75 0 0 0 8 2.25Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ThemeControl({ strings }: { strings: ThemeStrings }) {
  const preference = useSyncExternalStore(
    subscribePreference,
    readPreference,
    serverPreference,
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The clockwork: only for `auto`. Wake exactly once at the next boundary,
  // repaint, and re-arm. A pinned preference has no boundary to cross.
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

    // A laptop that slept through 18:00 fires the timer late or not at all.
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

  const choose = useCallback((chosen: ThemePreference) => {
    writePreference(chosen);
    paint(resolveTheme(chosen));
    window.dispatchEvent(new Event(PREFERENCE_EVENT));
  }, []);

  return (
    <div
      role="group"
      aria-label={strings.label}
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5"
    >
      {THEME_PREFERENCES.map((option) => {
        const active = option === preference;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={strings.options[option]}
            onClick={() => choose(option)}
            title={option === "auto" ? strings.autoHint : undefined}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-2xs font-medium transition-colors duration-200",
              active
                ? "bg-surface-2 text-foreground shadow-e2"
                : "text-muted hover:text-foreground",
            )}
          >
            <Icon kind={option} />
            {strings.options[option]}
          </button>
        );
      })}
    </div>
  );
}
