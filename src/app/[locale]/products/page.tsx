import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/lib/products";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.products,
    description: dict.products.subtitle,
    alternates: { canonical: `/${locale}/products` },
  };
}

export default async function ProductsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.products;

  return (
    <>
      {/* 1 · HERO */}
      <Section field="signal" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-display text-foreground">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {t.primaryCta}
            </Button>
            <Button
              as="a"
              href={localizeHref(locale, "/contact")}
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · PRODUCT CARDS */}
      <Section
        id="future"
        eyebrow={t.cardsEyebrow}
        title={t.cardsTitle}
        intro={t.cardsIntro}
        className="pt-0"
      >
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((p, i) => {
            const copy = t.items[p.key];
            if (!copy) return null;
            return (
              <Reveal key={p.key} delay={i * 70}>
                <Card className="flex h-full flex-col">
                  <Badge variant={p.status === "in-development" ? "amber" : "neutral"}>
                    {t.statuses[p.status]}
                  </Badge>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">{copy.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{copy.desc}</p>

                  <p className="mt-5 font-mono text-3xs uppercase tracking-wider text-muted">
                    {t.problemLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-foreground">{copy.problem}</p>

                  <p className="mt-4 font-mono text-3xs uppercase tracking-wider text-muted">
                    {t.whoLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-foreground">{copy.who}</p>

                  <Link
                    href={localizeHref(locale, `/products/${p.slug}`)}
                    className="link-sweep mt-auto w-fit pt-5 text-sm font-medium text-accent"
                  >
                    {t.primaryCta} →
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3 · ROADMAP / HOW WE SHIP */}
      <section className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="eyebrow">{t.roadmapEyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">
            {t.roadmapTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t.roadmapBody}</p>
        </Container>
      </section>

      {/* 4 · EARLY-ACCESS CTA */}
      <Container className="py-24">
        <Reveal>
          <div className="ticks relative rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
            <h2 className="mx-auto max-w-3xl text-display-sm text-foreground">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
              {t.cta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
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
