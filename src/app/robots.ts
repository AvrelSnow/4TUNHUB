import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { locales } from "@/lib/i18n/config";

/**
 * robots.txt — the internal /blueprint spec is kept out of search
 * across every locale.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: locales.map((l) => `/${l}/blueprint`),
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
