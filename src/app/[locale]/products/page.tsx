import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Chevron } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { CtaPanel } from "@/components/ui/CtaPanel";
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
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
            {t.primaryCta}
          </Button>
        }
      />

      <Section id="future" tone="surface" eyebrow={t.cardsEyebrow} title={t.cardsTitle} intro={t.cardsIntro}>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {products.map((p, i) => {
            const copy = t.items[p.key];
            if (!copy) return null;
            return (
              <Reveal key={p.key} delay={i * 80}>
                <Link
                  href={localizeHref(locale, `/products/${p.slug}`)}
                  className="group flex h-full flex-col rounded-3xl bg-surface-2 p-8 transition-[transform,box-shadow] duration-500 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1 hover:shadow-e2"
                >
                  <Badge variant={p.status === "in-development" ? "amber" : "outline"} className="w-fit">
                    {t.statuses[p.status]}
                  </Badge>
                  <h3 className="mt-6 text-headline text-foreground">{copy.title}</h3>
                  <p className="mt-3 text-muted">{copy.desc}</p>
                  <p className="mt-6 text-2xs font-semibold text-foreground">{t.problemLabel}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted">{copy.problem}</p>
                  <p className="mt-4 text-2xs font-semibold text-foreground">{t.whoLabel}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted">{copy.who}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 font-medium text-accent">
                    {t.primaryCta}
                    <Chevron />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <section className="py-24 sm:py-32">
        <Container size="narrow">
          <Reveal className="text-center">
            <p className="eyebrow">{t.roadmapEyebrow}</p>
            <h2 className="mt-3 text-display-sm text-foreground">{t.roadmapTitle}</h2>
            <p className="mt-6 text-lead text-muted">{t.roadmapBody}</p>
          </Reveal>
        </Container>
      </section>

      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/contact") }}
      />
    </>
  );
}
