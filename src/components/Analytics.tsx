import { analyticsConfig } from "@/lib/analytics";
import { AnalyticsScripts } from "./AnalyticsScripts";

/**
 * Analytics renders nothing at all until TWO separate things are true:
 *
 *   1. the host is configured — ANALYTICS_PROVIDER and ANALYTICS_SITE_ID,
 *      read when the site is BUILT, which is why this stays a server
 *      component: `process.env` is not a thing the browser can be handed;
 *   2. the visitor has said yes — which only the browser can know, and is
 *      decided one component further down, in `AnalyticsScripts`.
 *
 * See `src/lib/analytics.ts` for why it stays cookieless, and
 * `src/lib/consent.ts` for why the answer is opt-in.
 */
export function Analytics() {
  const config = analyticsConfig();
  if (!config) return null;

  return <AnalyticsScripts config={config} />;
}
