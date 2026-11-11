/**
 * The pillar hues (docs/visual-experience.md, "Colour"). One place maps a
 * sitemap key to its hue, so the nav, the footer and the home tiles can
 * never disagree. Keys without a hue are neutral.
 */
export type Hue = "indigo" | "amber" | "green" | "laterite";

export const pillarHue: Partial<Record<string, Hue>> = {
  services: "indigo",
  academy: "amber",
  research: "green",
  community: "laterite",
};

/** The `.hue-*` class for a key, or "" when the key is neutral. */
export function hueClass(key: string): string {
  const h = pillarHue[key];
  return h ? `hue-${h}` : "";
}
