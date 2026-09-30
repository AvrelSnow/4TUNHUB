"use client";

import Script from "next/script";
import type { AnalyticsConfig } from "@/lib/analytics";
import { useConsent } from "./consent-store";

/**
 * The gate in front of the only third-party origin this site contacts.
 *
 * It is here rather than inside the consent module on purpose: this is
 * the one place a request leaves for someone else's server, so it is the
 * one place that can be wrong about permission. No consent, no <Script>,
 * no request — not a script that loads and then promises to behave.
 *
 * `afterInteractive`: the count matters, but never before the page is
 * usable. A blocked or failed script changes nothing on the page.
 */
export function AnalyticsScripts({ config }: { config: AnalyticsConfig }) {
  const { state } = useConsent();

  if (!state.analytics) return null;

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
