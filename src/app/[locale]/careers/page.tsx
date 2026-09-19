import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { openRoles, entryPoints, hiringPrinciples } from "@/lib/careers";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/i18n/format";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.careers,
    description: dict.careers.subtitle,
    alternates: { canonical: `/${locale}/careers` },
  };
}

export default async function CareersPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.careers;
  // Empty by design (lib/careers.ts): the grid fills in the moment a real,
  // paid role exists. Nothing here is written in advance.
  const roles = openRoles();

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            <Button as="a" href={localizeHref(locale, "/community")} size="lg">
              {t.primaryCta}
            </Button>
            <ArrowLink href={localizeHref(locale, "/contact")}>{t.secondaryCta}</ArrowLink>
          </>
        }
      />

      {roles.length > 0 ? (
        <Section tone="surface" eyebrow={t.rolesEyebrow} title={t.rolesTitle}>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {roles.map((role, i) => (
              <Reveal key={role.slug} delay={i * 70}>
                <Link
                  href={role.href ?? localizeHref(locale, `/careers/${role.slug}`)}
                  className="group block h-full"
                >
                  <Card tone="raised" interactive className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="amber">{t.kinds[role.kind]}</Badge>
                      <span className="readout">
                        {t.posted} {formatDate(role.posted, locale)}
                      </span>
                    </div>
                    {/* Never the raw slug: the title comes from the dictionary, so a
                        role cannot be posted in one language only. */}
                    <h2 className="mt-6 text-headline text-foreground">
                      {t.roles[role.slug]?.title ?? role.slug}
                    </h2>
                    <p className="mt-3 flex-1 text-muted">{t.roles[role.slug]?.summary ?? ""}</p>
                    <p className="readout mt-4">
                      {role.location} · {t.commitments[role.commitment]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 font-medium text-accent">
                      {t.apply}
                      <Chevron />
                    </span>
                  </Card>
                </Link>
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

      {/* The terms, committed to now, while committing still costs nothing. */}
      <Section eyebrow={t.principlesEyebrow} title={t.principlesTitle} intro={t.principlesIntro}>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {hiringPrinciples.map((key) => {
            const copy = t.principles[key];
            if (!copy) return null;
            return (
              <div key={key} className="border-t border-foreground pt-6">
                <h3 className="text-headline text-foreground">{copy.title}</h3>
                <p className="mt-3 text-muted">{copy.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* The doors that are open today. */}
      <Section tone="surface" eyebrow={t.entryEyebrow} title={t.entryTitle} intro={t.entryIntro}>
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {entryPoints.map((point, i) => {
            const copy = t.entry[point.key];
            if (!copy) return null;
            const panel = (
              <Card tone="raised" interactive className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-headline text-foreground">{copy.title}</h3>
                  {point.live && <Badge variant="amber">{t.live}</Badge>}
                </div>
                <p className="mt-3 flex-1 text-muted">{copy.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-medium text-accent">
                  {copy.cta}
                  <Chevron external={point.external} />
                </span>
              </Card>
            );
            return (
              <Reveal key={point.key} delay={i * 80}>
                {point.external ? (
                  <a href={point.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
                    {panel}
                  </a>
                ) : (
                  <Link href={localizeHref(locale, point.href)} className="group block h-full">
                    {panel}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
        className="border-t border-border"
      />
    </>
  );
}
