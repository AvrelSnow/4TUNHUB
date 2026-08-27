import type { MetadataRoute } from "next";
import { flattenTree } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/site";
import { locales, defaultLocale } from "@/lib/i18n/config";

/**
 * sitemap.xml — one entry per active route PER LOCALE, with hreflang
 * alternates so search engines serve the right language. Generated from
 * the same source of truth as the navigation (src/lib/sitemap.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>();
  for (const node of flattenTree()) {
    if (node.status !== "active") continue;
    if (node.href.includes("#")) continue;
    paths.add(node.href === "/" ? "" : node.href);
  }

  const url = (locale: string, path: string) => `${SITE_URL}/${locale}${path}`;

  return [...paths].flatMap((path) =>
    locales.map((locale) => ({
      url: url(locale, path),
      lastModified: new Date(),
      changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, url(l, path)]),
          ["x-default", url(defaultLocale, path)],
        ]),
      },
    })),
  );
}
