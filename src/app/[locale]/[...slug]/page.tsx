import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { flattenTree } from "@/lib/sitemap";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { RoutePlaceholder } from "@/components/RoutePlaceholder";

/**
 * Catch-all placeholder. Renders a localized "in progress" page for any
 * route that exists in the sitemap but isn't built yet, and 404s for
 * unknown paths. One file keeps every ecosystem link alive — no per-route
 * stub files. More specific routes (/[locale]/blueprint) take precedence.
 */

type Params = { params: Promise<{ locale: string; slug: string[] }> };

/**
 * Routes that now have real pages — excluded so they don't collide with
 * this catch-all's static params. Add to this as each pillar ships.
 */
const BUILT_ROUTES = new Set([
  "projects",
  "services",
  "about",
  "contact",
  "blueprint",
  "academy",
  "research",
  "products",
]);

/** Pre-render every remaining sitemap path (× each locale via the parent). */
export function generateStaticParams() {
  const seen = new Set<string>();
  const params: { slug: string[] }[] = [];
  for (const node of flattenTree()) {
    if (node.href === "/" || node.href.includes("#")) continue;
    const slug = node.href.replace(/^\//, "").split("/");
    const key = slug.join("/");
    if (seen.has(key) || BUILT_ROUTES.has(slug[0])) continue;
    seen.add(key);
    params.push({ slug });
  }
  return params;
}

function findNode(slug: string[]) {
  const path = "/" + slug.join("/");
  return flattenTree().find((n) => n.href === path);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const node = findNode(slug);
  if (!node) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes[node.key] ?? node.label,
    // Placeholder pages carry no real content yet — keep them out of search.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${locale}/${slug.join("/")}` },
  };
}

export default async function CatchAll({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const node = findNode(slug);
  if (!node) notFound();
  const dict = await getDictionary(locale);
  return <RoutePlaceholder locale={locale} dict={dict} node={node} />;
}
