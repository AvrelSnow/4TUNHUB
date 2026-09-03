import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { products } from "@/lib/products";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** One placeholder detail page per product (× each locale). */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  const dict = await getDictionary(locale);
  const copy = dict.products.items[product.key];
  if (!copy) return {};
  return {
    title: copy.title,
    description: copy.desc,
    // Pre-launch product pages carry no shippable content — keep them out of search.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${locale}/products/${slug}` },
  };
}

export default async function ProductDetail({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  const dict = await getDictionary(locale);
  const t = dict.products;
  const copy = t.items[product.key];
  if (!copy) notFound();

  return (
    <Section field="signal" className="flex flex-1 flex-col py-20 sm:py-24">
      <Link
        href={localizeHref(locale, "/products")}
        className="link-sweep text-sm font-medium text-accent"
      >
        ← {t.detail.backToProducts}
      </Link>

      <Badge
        variant={product.status === "in-development" ? "amber" : "neutral"}
        className="mt-8 w-fit"
      >
        {t.detail.status}: {t.statuses[product.status]}
      </Badge>

      <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {copy.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{copy.desc}</p>

      <div className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-mono text-3xs uppercase tracking-wider text-muted">
            {t.problemLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">{copy.problem}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-mono text-3xs uppercase tracking-wider text-muted">
            {t.whoLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">{copy.who}</p>
        </div>
      </div>

      <p className="mt-8 max-w-xl text-base leading-7 text-muted">{t.detail.body}</p>

      <div className="mt-6">
        <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
          {t.detail.waitlist}
        </Button>
      </div>
    </Section>
  );
}
