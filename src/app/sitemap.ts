import type { MetadataRoute } from "next";
import { flattenTree } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/site";
import { storefront } from "@/lib/commerce";
import { locales, defaultLocale } from "@/lib/i18n/config";

/**
 * sitemap.xml — one entry per active route PER LOCALE, with hreflang
 * alternates so search engines serve the right language. Generated from
 * the same source of truth as the navigation (src/lib/sitemap.ts).
 *
 * An "active" route can still have nothing to rank. /store is the case:
 * the catalog is empty by design until the first real item ships
 * (commerce.ts), so submitting it asks Google to index a shop with no
 * stock — the same dishonesty as listing a product nobody can buy, aimed
 * at the search result instead of the page. It re-enters the sitemap
 * automatically the moment `catalog` holds one sellable item; the page's
 * own `robots` directive is derived from the same check, so the two can
 * never disagree.
 */
const emptyPillars = (): string[] => (storefront().length === 0 ? ["/store"] : []);

export default function sitemap(): MetadataRoute.Sitemap {
  const withheld = new Set(emptyPillars());
  const paths = new Set<string>();
  for (const node of flattenTree()) {
    if (node.status !== "active" || node.hidden) continue;
    if (node.href.includes("#")) continue;
    if (withheld.has(node.href)) continue;
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
