import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { availableResources, plannedResources, type Resource } from "@/lib/resources";
import { MEDIUM_URL } from "@/lib/site";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.resources,
    description: dict.resources.subtitle,
    alternates: { canonical: `/${locale}/resources` },
  };
}

function ResourceCard({
  resource,
  locale,
  t,
}: {
  resource: Resource;
  locale: Locale;
  t: Dictionary["resources"];
}) {
  const copy = t.items[resource.key];
  if (!copy) return null;
  const available = resource.status === "available";
  const href =
    resource.href && (resource.external ? resource.href : localizeHref(locale, resource.href));

  return (
    <Card
      interactive={available}
      className={`flex h-full flex-col ${available ? "" : "border-dashed"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Badge variant="neutral">{t.kinds[resource.kind]}</Badge>
        <Badge variant={available ? "amber" : "outline"}>
          {available ? t.availableBadge : t.plannedBadge}
        </Badge>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{copy.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
      {available && href && (
        resource.external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-sweep mt-5 inline-block text-sm font-medium text-accent"
          >
            {t.open} →
          </a>
        ) : (
          <Link
            href={href}
            className="link-sweep mt-5 inline-block text-sm font-medium text-accent"
          >
            {t.open} →
          </Link>
        )
      )}
    </Card>
  );
}

export default async function ResourcesPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.resources;

  return (
    <>
      {/* 1 · HERO */}
      <Section field="draft" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-display text-foreground">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={MEDIUM_URL} target="_blank" rel="noopener noreferrer" size="lg">
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

      {/* 2 · AVAILABLE NOW */}
      <Section
        eyebrow={t.availableEyebrow}
        title={t.availableTitle}
        intro={t.availableIntro}
        className="pt-0"
      >
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {availableResources.map((resource, i) => (
            <Reveal key={resource.key} delay={i * 70}>
              <ResourceCard resource={resource} locale={locale} t={t} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 3 · ON THE WAY */}
      <section className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="eyebrow">{t.plannedEyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">
            {t.plannedTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t.plannedIntro}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {plannedResources.map((resource, i) => (
              <Reveal key={resource.key} delay={i * 70}>
                <ResourceCard resource={resource} locale={locale} t={t} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 · COMMERCE NOTE */}
      <Section eyebrow={t.commerceNote.eyebrow} title={t.commerceNote.title}>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t.commerceNote.body}</p>
        <Link
          href={localizeHref(locale, "/store")}
          className="link-sweep mt-5 inline-block text-sm font-medium text-accent"
        >
          {t.commerceNote.cta} →
        </Link>
      </Section>

      {/* 5 · CTA */}
      <Container className="pb-24">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
            <h2 className="mx-auto max-w-3xl text-display-sm text-foreground">
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
                href={MEDIUM_URL}
                target="_blank"
                rel="noopener noreferrer"
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
