/**
 * Analytics — counted visitors, not tracked people.
 *
 * The rule this file exists to keep: the privacy note says "no cookies,
 * nothing that follows you between sites", and it has to stay true. So
 * only cookieless, no-personal-data analytics belong here, and nothing
 * loads at all unless the host is configured for it.
 *
 * Configure on the host (Netlify → Site configuration → Environment
 * variables), then **redeploy** — these are read when the pages are
 * built, not when they are served:
 *
 *   ANALYTICS_PROVIDER  "umami" or "plausible". Unset = no analytics,
 *                       no script, no third-party origin in the CSP.
 *   ANALYTICS_SITE_ID   Umami: the website ID from its dashboard.
 *                       Plausible: the domain, e.g. "4tunhub.com".
 *   ANALYTICS_HOST      Optional. The origin of a self-hosted instance,
 *                       e.g. "https://stats.4tunhub.com". Defaults to
 *                       the provider's own cloud.
 *
 * No import belongs in this file: `next.config.ts` imports it to add the
 * chosen origin to the Content-Security-Policy, and a config is loaded
 * outside the app's module graph.
 */

export const ANALYTICS_PROVIDERS = ["umami", "plausible"] as const;
export type AnalyticsProvider = (typeof ANALYTICS_PROVIDERS)[number];

/** The named events live in `track.ts`, next to the code that sends them. */

export type AnalyticsConfig = {
  provider: AnalyticsProvider;
  /** The script to load. */
  src: string;
  /** Origin to allow in script-src and connect-src. */
  origin: string;
  /** Provider-specific attributes on the <script> tag. */
  attrs: Record<string, string>;
};

const defaultHost: Record<AnalyticsProvider, string> = {
  umami: "https://cloud.umami.is",
  plausible: "https://plausible.io",
};

/** Trailing slashes make `${host}/script.js` a 404 on some hosts. */
function origin(host: string): string {
  return host.replace(/\/+$/, "");
}

/**
 * Resolves the host's environment into a script to load, or null.
 * Null is the normal state in development and on any deploy that hasn't
 * been given an ID — the site simply renders no analytics.
 */
export function analyticsConfig(
  env: Record<string, string | undefined> = process.env,
): AnalyticsConfig | null {
  const provider = env.ANALYTICS_PROVIDER?.trim().toLowerCase();
  if (!provider) return null;
  if (!ANALYTICS_PROVIDERS.includes(provider as AnalyticsProvider)) {
    console.warn(`[analytics] Unknown ANALYTICS_PROVIDER "${provider}" — analytics disabled.`);
    return null;
  }

  const id = env.ANALYTICS_SITE_ID?.trim();
  if (!id) {
    console.warn("[analytics] ANALYTICS_SITE_ID is missing — analytics disabled.");
    return null;
  }

  const p = provider as AnalyticsProvider;
  const host = origin(env.ANALYTICS_HOST?.trim() || defaultHost[p]);

  return p === "umami"
    ? { provider: p, origin: host, src: `${host}/script.js`, attrs: { "data-website-id": id } }
    : { provider: p, origin: host, src: `${host}/js/script.js`, attrs: { "data-domain": id } };
}
