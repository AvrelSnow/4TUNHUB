import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { CtaPanel } from "@/components/ui/CtaPanel";
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

  const body = (
    <Card
      tone={available ? "raised" : "outline"}
      interactive={available}
      className="flex h-full flex-col"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={available ? "amber" : "outline"}>
          {available ? t.availableBadge : t.plannedBadge}
        </Badge>
        <span className="text-2xs text-muted">{t.kinds[resource.kind]}</span>
      </div>
      <h3 className="mt-6 text-headline text-foreground">{copy.title}</h3>
      <p className="mt-3 flex-1 text-muted">{copy.desc}</p>
      {available && href && (
        <span className="mt-6 inline-flex items-center gap-1 font-medium text-accent">
          {t.open}
          <Chevron external={resource.external} />
        </span>
      )}
    </Card>
  );

  if (!available || !href) return body;
  return resource.external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {body}
    </a>
  ) : (
    <Link href={href} className="group block h-full">
      {body}
    </Link>
  );
}

export default async function ResourcesPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.resources;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            <Button as="a" href={MEDIUM_URL} target="_blank" rel="noopener noreferrer" size="lg">
              {t.primaryCta}
            </Button>
            <ArrowLink href={localizeHref(locale, "/community")}>{t.secondaryCta}</ArrowLink>
          </>
        }
      />

      <Section tone="surface" eyebrow={t.availableEyebrow} title={t.availableTitle} intro={t.availableIntro}>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {availableResources.map((resource, i) => (
            <Reveal key={resource.key} delay={i * 70}>
              <ResourceCard resource={resource} locale={locale} t={t} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.plannedEyebrow} title={t.plannedTitle} intro={t.plannedIntro}>
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {plannedResources.map((resource, i) => (
            <Reveal key={resource.key} delay={i * 70}>
              <ResourceCard resource={resource} locale={locale} t={t} />
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="border-t border-border py-24 sm:py-32">
        <Container size="narrow">
          <Reveal className="text-center">
            <p className="eyebrow">{t.commerceNote.eyebrow}</p>
            <h2 className="mt-3 text-display-sm text-foreground">{t.commerceNote.title}</h2>
            <p className="mt-6 text-lead text-muted">{t.commerceNote.body}</p>
            <ArrowLink href={localizeHref(locale, "/store")} className="mt-7">
              {t.commerceNote.cta}
            </ArrowLink>
          </Reveal>
        </Container>
      </section>

      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/community") }}
        secondary={{ label: t.cta.secondary, href: MEDIUM_URL, external: true }}
      />
    </>
  );
}
