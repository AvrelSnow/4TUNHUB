import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
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
    alternates: { canonical: `/${locale}/store` },
  };
}

export default async function StorePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.store;
  // The catalog is empty by design until the first real item ships; this
  // view fills in automatically the moment one lands (commerce.ts).
  const items = storefront();

  return (
    <>
      {/* 1 · HERO */}
      <Section pattern="diamond" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={localizeHref(locale, "/products")} size="lg">
              {t.primaryCta}
            </Button>
            <Button
              as="a"
              href={localizeHref(locale, "/community")}
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · CATALOG (empty by design) or EMPTY STATE */}
      {items.length > 0 ? (
        <Section eyebrow={t.catalogEyebrow} title={t.catalogTitle} className="pt-0">
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.sku} delay={i * 70}>
                <Card interactive className="flex h-full flex-col">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.format}</p>
                  <p className="mt-4 font-mono text-sm font-semibold text-brand-800">
                    {t.priceFrom} {item.price.amount.toLocaleString()} {item.price.currency}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <Container className="pt-0">
          <Reveal>
            <div className="rounded-2xl border border-dashed border-ink-300 bg-surface p-8 sm:p-12">
              <Badge variant="outline" className="w-fit">
                {t.emptyEyebrow}
              </Badge>
              <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t.emptyTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{t.emptyBody}</p>
            </div>
          </Reveal>
        </Container>
      )}

      {/* 3 · WHERE COMMERCE LIVES */}
      <Section
        eyebrow={t.contextEyebrow}
        title={t.contextTitle}
        intro={t.contextIntro}
      >
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CONTEXT_PILLARS.map((key, i) => {
            const copy = t.context[key];
            if (!copy) return null;
            return (
              <Reveal key={key} delay={i * 70}>
                <Link href={localizeHref(locale, `/${key}`)} className="block h-full">
                  <Card interactive className="flex h-full flex-col">
                    <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                    <span className="link-sweep mt-5 inline-block text-sm font-medium text-brand-800">
                      {t.explore} →
                    </span>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 4 · CTA */}
      <Container className="pb-24">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
              {t.cta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button as="a" href={localizeHref(locale, "/community")} size="lg">
                {t.cta.primary}
              </Button>
              <Button
                as="a"
                href={localizeHref(locale, "/contact")}
                size="lg"
                variant="secondary"
              >
                {t.cta.secondary}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
