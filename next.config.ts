import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { analyticsConfig } from "./src/lib/analytics";

const isProd = process.env.NODE_ENV === "production";

/** `ANALYZE=true npm run build` opens an interactive bundle treemap. */
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Security headers — applied to every route.
 * The CSP is production-only because Next dev mode needs eval/inline for HMR.
 * At launch, tighten script-src with nonces if any inline scripts remain.
 *
 * Analytics is the one third party allowed anywhere near the page, and only
 * when the host has configured it: `analytics` is null otherwise and the
 * policy below stays first-party. See src/lib/analytics.ts.
 */
const analytics = analyticsConfig();
const analyticsOrigin = analytics ? ` ${analytics.origin}` : "";

const securityHeaders = [
  // Never let browsers guess MIME types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The site must never be framed (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Send only the origin cross-site; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // We use none of these browser capabilities — say so explicitly.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Force HTTPS for 2 years once live (ignored over plain HTTP in dev).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  ...(isProd
    ? [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            `script-src 'self' 'unsafe-inline'${analyticsOrigin}`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "font-src 'self'",
            `connect-src 'self'${analyticsOrigin}`,
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
            "upgrade-insecure-requests",
          ].join("; "),
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // don't advertise the framework
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default process.env.ANALYZE === "true"
  ? bundleAnalyzer(nextConfig)
  : nextConfig;
