/**
 * ============================================================
 * THEME — light by day, dark by night.
 * ============================================================
 * Every visitor starts on `auto`: the light page from DAY_START to
 * DAY_END on their own clock, the dark page the rest of the time.
 * Anyone can pin Light or Dark from the footer and is then obeyed
 * permanently.
 *
 * WHY THE CLOCK AND NOT `prefers-color-scheme`
 * Most people never touch the OS setting, so it reports a factory
 * default rather than a wish. The clock tracks something real about
 * the room the visitor is reading in.
 *
 * WHY THESE HOURS
 * 06:00–18:00. The audience is in Cameroon, near the equator, where
 * sunrise sits near 06:00 and sunset near 18:20 all year.
 *
 * WHY IT IS DECIDED IN THE BROWSER
 * Pages are static per locale and cannot know a visitor's local hour.
 * A blocking inline script sets `data-theme` on <html> before first
 * paint, and CSS does the rest. No markup depends on the theme, so
 * nothing hydrates differently and nothing flashes.
 *
 * If the script cannot run, the page stays light: the base tokens in
 * globals.css are the day values.
 */

/** What the visitor asked for. `auto` hands the decision to the clock. */
export type ThemePreference = "auto" | "light" | "dark";

/** What actually renders. */
export type Theme = "light" | "dark";

export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 18;

/** localStorage key. Namespaced so it cannot collide on a shared origin. */
export const THEME_STORAGE_KEY = "4tun.theme";

/** The page that renders when nothing else can be determined. */
export const FALLBACK_THEME: Theme = "light";

/** What a visitor who has never chosen gets. */
export const DEFAULT_PREFERENCE: ThemePreference = "auto";

/** Order of the segmented control in the footer. */
export const THEME_PREFERENCES: readonly ThemePreference[] = [
  "auto",
  "light",
  "dark",
] as const;

export function isThemePreference(v: unknown): v is ThemePreference {
  return v === "auto" || v === "light" || v === "dark";
}

/** The clock's verdict for a given local hour. */
export function themeForHour(hour: number): Theme {
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR ? "light" : "dark";
}

/** The page to render, given a stated preference and a moment. */
export function resolveTheme(
  preference: ThemePreference,
  now: Date = new Date(),
): Theme {
  return preference === "auto" ? themeForHour(now.getHours()) : preference;
}

/**
 * Milliseconds until the clock next changes its verdict, so a reader still
 * on the page at 18:00 sees it turn. Built from a real Date rather than by
 * arithmetic, so it stays right across a DST shift.
 */
export function msUntilNextSwitch(now: Date = new Date()): number {
  const hour = now.getHours();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);

  if (hour < DAY_START_HOUR) next.setHours(DAY_START_HOUR);
  else if (hour < DAY_END_HOUR) next.setHours(DAY_END_HOUR);
  else {
    next.setDate(next.getDate() + 1);
    next.setHours(DAY_START_HOUR);
  }

  // A backwards DST jump can leave `next` in the past; never return <= 0.
  return Math.max(60_000, next.getTime() - now.getTime());
}

/**
 * The pre-paint resolver, as source. Runs as a blocking inline script in
 * <head>, before the stylesheet paints. Built from the constants above so
 * the hours cannot drift, dependency-free so it survives a failed bundle,
 * and wrapped in try/catch because reading localStorage throws in some
 * privacy modes.
 */
export const themeResolverScript = `(function(){var r=document.documentElement;try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(p!=="light"&&p!=="dark"&&p!=="auto")p=${JSON.stringify(DEFAULT_PREFERENCE)};var t=p;if(p==="auto"){var h=new Date().getHours();t=(h>=${DAY_START_HOUR}&&h<${DAY_END_HOUR})?"light":"dark"}r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){var n=new Date().getHours();var f=(n>=${DAY_START_HOUR}&&n<${DAY_END_HOUR})?"light":"dark";r.setAttribute("data-theme",f);r.style.colorScheme=f}})()`;
