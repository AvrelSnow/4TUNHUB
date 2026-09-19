import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { storefront } from "@/lib/commerce";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

/** Pillars where purchasable items live, in the order shown. */
const CONTEXT_PILLARS = ["academy", "resources", "products"] as const;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.store,
    description: dict.store.subtitle,
    // An empty shop has nothing to rank. While `catalog` holds no sellable
    // item the page is followed but not indexed. Derived from the same call
    // the sitemap uses (src/app/sitemap.ts), so the two can never disagree.
    robots: storefront().length > 0 ? undefined : { index: false, follow: true },
    alternates: { canonical: `/${locale}/store` },
  };
}

export default async function StorePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.store;
  // Empty by design until the first real item ships; fills in automatically.
  const items = storefront();

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            <Button as="a" href={localizeHref(locale, "/products")} size="lg">
              {t.primaryCta}
            </Button>
            <ArrowLink href={localizeHref(locale, "/community")}>{t.secondaryCta}</ArrowLink>
          </>
        }
      />

      {items.length > 0 ? (
        <Section tone="surface" eyebrow={t.catalogEyebrow} title={t.catalogTitle}>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.sku} delay={i * 70}>
                <Card tone="raised" interactive className="flex h-full flex-col">
                  <h3 className="text-headline text-foreground">{item.title}</h3>
                  <p className="mt-3 flex-1 text-muted">{item.format}</p>
                  <p className="figure mt-6 font-semibold text-foreground">
                    {t.priceFrom} {item.price.amount.toLocaleString()} {item.price.currency}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <section className="pb-8">
          <Container>
            <Reveal>
              <EmptyState eyebrow={t.emptyEyebrow} title={t.emptyTitle} body={t.emptyBody} />
            </Reveal>
          </Container>
        </section>
      )}

      <Section eyebrow={t.contextEyebrow} title={t.contextTitle} intro={t.contextIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {CONTEXT_PILLARS.map((key, i) => {
            const copy = t.context[key];
            if (!copy) return null;
            return (
              <Reveal key={key} delay={i * 70}>
                <Link href={localizeHref(locale, `/${key}`)} className="group block h-full">
                  <Card interactive className="flex h-full flex-col">
                    <h3 className="text-headline text-foreground">{copy.title}</h3>
                    <p className="mt-3 flex-1 text-muted">{copy.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-1 font-medium text-accent">
                      {t.explore}
                      <Chevron />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/community") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/contact") }}
      />
    </>
  );
}
