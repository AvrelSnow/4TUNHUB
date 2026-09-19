import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Chevron } from "@/components/ui/ArrowLink";
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
    <section className="flex-1 pt-10 pb-24 sm:pt-14 sm:pb-32">
      <Container>
        <Link
          href={localizeHref(locale, "/products")}
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <span className="rotate-180">
            <Chevron />
          </span>
          {t.detail.backToProducts}
        </Link>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <Badge variant={product.status === "in-development" ? "amber" : "outline"}>
            {t.detail.status}: {t.statuses[product.status]}
          </Badge>
          <h1 className="mt-6 animate-fade-up text-display text-foreground">{copy.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lead text-muted">{copy.desc}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-surface p-8">
            <p className="text-sm font-semibold text-foreground">{t.problemLabel}</p>
            <p className="mt-2 text-muted">{copy.problem}</p>
          </div>
          <div className="rounded-3xl bg-surface p-8">
            <p className="text-sm font-semibold text-foreground">{t.whoLabel}</p>
            <p className="mt-2 text-muted">{copy.who}</p>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-xl text-center">
          <p className="text-muted">{t.detail.body}</p>
          <Button as="a" href={localizeHref(locale, "/contact")} size="lg" className="mt-8">
            {t.detail.waitlist}
          </Button>
        </div>
      </Container>
    </section>
  );
}
