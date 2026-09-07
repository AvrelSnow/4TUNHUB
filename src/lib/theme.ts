/**
 * ============================================================
 * THEME — night is home, day is the sheet.
 * ============================================================
 * The site runs two grounds and the visitor's own clock decides
 * which. Between DAY_START and DAY_END local time the instrument
 * becomes a drafting sheet; outside those hours it is the dark
 * measurement surface it has always been. The palettes, and the
 * argument for having two at all, live in src/app/globals.css.
 *
 * WHY THE CLOCK AND NOT `prefers-color-scheme`
 * The OS preference is a stated preference and it wins whenever the
 * visitor states one here — that is what `ThemePreference` is for.
 * But the majority of people never touch that setting, so on their
 * machines it reports a default rather than a wish, and a site that
 * obeys it is obeying a factory setting. The clock at least tracks
 * something real about the room they are in.
 *
 * WHY THESE HOURS
 * 06:00–18:00. Not a guess and not a US-office default: 4TUN Hub's
 * audience is in Cameroon, three degrees off the equator, where
 * sunrise sits near 06:00 and sunset near 18:20 in every month of
 * the year. The boundary is genuinely accurate for the people the
 * site is for, and merely conventional for everyone else — which is
 * the right way round.
 *
 * WHY IT IS NOT COMPUTED ON THE SERVER
 * Every page is statically rendered per locale, and a static page
 * cannot know a visitor's local hour. So no markup ever depends on
 * the theme: the resolver only sets an attribute on <html>, before
 * first paint, and CSS does the rest. Nothing to hydrate, nothing to
 * mismatch, and no flash of the wrong ground.
 *
 * NIGHT IS THE FALLBACK IN EVERY FAILURE MODE — no JavaScript,
 * storage blocked, an exception thrown. That is deliberate: dark is
 * the art direction's home, so the degraded state is the designed
 * state rather than a compromise.
 */

/** What the visitor asked for. `auto` hands the decision to the clock. */
export type ThemePreference = "auto" | "light" | "dark";

/** What actually renders. */
export type Theme = "light" | "dark";

export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 18;

/** localStorage key. Namespaced so it cannot collide on a shared origin. */
export const THEME_STORAGE_KEY = "4tun.theme";

/** The ground that renders when nothing else can be determined. */
export const FALLBACK_THEME: Theme = "dark";

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

/** The ground to render, given a stated preference and a moment. */
export function resolveTheme(
  preference: ThemePreference,
  now: Date = new Date(),
): Theme {
  return preference === "auto" ? themeForHour(now.getHours()) : preference;
}

/**
 * Milliseconds until the clock next changes its verdict. Used to flip the
 * ground under a reader who is still on the page at 18:00 — the alternative
 * is a site that is only correct at the moment it loaded.
 *
 * Computed from a real Date rather than by arithmetic on the current time,
 * so it stays right across a DST shift, where "12 hours from now" and
 * "06:00 tomorrow" are not the same instant.
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
 * The pre-paint resolver, as source. This runs as a blocking inline script
 * in <head> — before the stylesheet paints anything and long before React
 * arrives — because a theme applied after first paint is a flash of the
 * wrong ground, which is worse than having no day theme at all.
 *
 * It is built from the constants above so the hours cannot drift out of
 * step with the rest of the module, and it is deliberately tiny and
 * dependency-free: it must survive a failed bundle. Everything it touches
 * is in a try/catch, because reading localStorage throws outright in some
 * privacy modes, and the catch lands on night.
 */
export const themeResolverScript = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(p!=="light"&&p!=="dark")p="auto";var t=p;if(p==="auto"){var h=new Date().getHours();t=(h>=${DAY_START_HOUR}&&h<${DAY_END_HOUR})?"light":"dark"}var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
  FALLBACK_THEME,
)})}})()`;
