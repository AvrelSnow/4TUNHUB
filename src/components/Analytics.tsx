import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics";

/**
 * The analytics tag — or nothing at all, which is what it renders until
 * the host sets ANALYTICS_PROVIDER and ANALYTICS_SITE_ID. See
 * `src/lib/analytics.ts` for the contract and why it stays cookieless.
 *
 * `afterInteractive`: the count matters, but never before the page is
 * usable. A blocked or failed script changes nothing on the page.
 */
export function Analytics() {
  const config = analyticsConfig();
  if (!config) return null;

  return (
    <>
      {/* Plausible's own snippet: custom events called before the script
          finishes loading are queued, not lost. Umami needs no equivalent. */}
      {config.provider === "plausible" && (
        <Script
          id="analytics-queue"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}",
          }}
        />
      )}
      <Script src={config.src} strategy="afterInteractive" defer {...config.attrs} />
    </>
  );
}
