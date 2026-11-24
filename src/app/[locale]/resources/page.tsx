import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
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
        <span className="mt-6 inline-flex items-center gap-1 font-semibold text-accent underline decoration-brand-500 decoration-2 underline-offset-4">
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

      {/* FREE SOFTWARE — an offer from SOLIDWORKS, not something we publish.
          The official logotype is used as supplied (unaltered, standalone,
          with clear space, above 115px, with the asterisk and the
          "A Dassault Systèmes brand" line in the fine print). Dassault's
          graphics charter asks for written permission; the owner chose to
          proceed without it. */}
      <Section rhythm="compressed">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-surface">
            <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-12">
              <div className="flex flex-col">
                <div className="mb-10 flex items-start gap-1">
                  <Image
                    src="/images/logos/solidworks-3ds-red.png"
                    alt="SOLIDWORKS, a Dassault Systèmes brand"
                    width={790}
                    height={147}
                    className="h-auto w-56"
                    unoptimized
                  />
                  <span aria-hidden className="text-lg leading-none font-semibold text-foreground">
                    *
                  </span>
                </div>
                <p className="eyebrow">{t.studentOffer.eyebrow}</p>
                <h2 className="mt-3 text-4xl leading-tight font-bold tracking-tight text-foreground">
                  {t.studentOffer.title}
                </h2>
                <p className="mt-4 text-lead text-muted">{t.studentOffer.body}</p>
                <div className="mt-8">
                  <Button
                    as="a"
                    href="https://www.solidworks.com/product/students/design-standard"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    {t.studentOffer.cta}
                  </Button>
                </div>
                <div className="mt-8 border-t border-border pt-6">
                  <p className="text-sm font-semibold text-foreground">{t.studentOffer.factsTitle}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                    {t.studentOffer.facts.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <ol className="grid content-start gap-4">
                {t.studentOffer.steps.map((s) => (
                  <li key={s.n} className="flex gap-5 rounded-2xl bg-surface-2 p-6">
                    <span className="readout shrink-0 text-3xl font-bold text-accent">{s.n}</span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">{s.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <p className="border-t border-border px-8 py-4 text-2xs leading-5 text-muted sm:px-10 lg:px-12">
              {t.studentOffer.legal}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section tone="surface" eyebrow={t.availableEyebrow} title={t.availableTitle} intro={t.availableIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {availableResources.map((resource, i) => (
            <Reveal key={resource.key} delay={i * 70}>
              <ResourceCard resource={resource} locale={locale} t={t} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.plannedEyebrow} title={t.plannedTitle} intro={t.plannedIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
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
