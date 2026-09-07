import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
  // Empty by design (lib/careers.ts). The grid fills in automatically the
  // moment a real, paid role exists — nothing here is written in advance.
  const roles = openRoles();

  return (
    <>
      {/* 1 · HERO — `growth`: branching biomass. The last unclaimed field, and
          the right one: a team is the only structure on this site that grows
          rather than being drawn. */}
      <Section field="growth" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-display text-foreground">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={localizeHref(locale, "/community")} size="lg">
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

      {/* 2 · OPEN ROLES, or the honest zero. Same contract as the store and
          the blog: nothing is listed until something real exists. */}
      {roles.length > 0 ? (
        <Section eyebrow={t.rolesEyebrow} title={t.rolesTitle} className="pt-0">
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {roles.map((role, i) => (
              <Reveal key={role.slug} delay={i * 70}>
                <Link
                  href={role.href ?? localizeHref(locale, `/careers/${role.slug}`)}
                  className="block h-full"
                >
                  <Card interactive className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="amber">{t.kinds[role.kind]}</Badge>
                      <span className="readout">
                        {t.posted} {formatDate(role.posted, locale)}
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                      {/* Never the raw slug: an unlocalized "simulation-engineer"
                          is what a careers page must not ship. The title comes
                          from the dictionary, so a role cannot be posted in one
                          language only — the same contract the blog index uses. */}
                      {t.roles[role.slug]?.title ?? role.slug}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                      {t.roles[role.slug]?.summary ?? ""}
                    </p>
                    <p className="readout mt-3">
                      {role.location} · {t.commitments[role.commitment]}
                    </p>
                    <span className="link-sweep mt-4 w-fit text-sm font-medium text-accent">
                      {t.apply} →
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <Container className="pt-0">
          <Reveal>
            <EmptyState
              readout={t.emptyReadout}
              eyebrow={t.emptyEyebrow}
              title={t.emptyTitle}
              body={t.emptyBody}
            />
          </Reveal>
        </Container>
      )}

      {/* 3 · THE TERMS — committed to now, while committing still costs
          nothing. That is the only moment they are worth anything. */}
      <Section
        eyebrow={t.principlesEyebrow}
        title={t.principlesTitle}
        intro={t.principlesIntro}
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {hiringPrinciples.map((key, i) => {
            const copy = t.principles[key];
            if (!copy) return null;
            return (
              <Reveal key={key} delay={i * 70}>
                <Card className="flex h-full flex-col">
                  <span className="readout text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {copy.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 4 · THE DOORS THAT ARE OPEN — live surfaces, not a waiting list. */}
      <Section
        rhythm="compressed"
        eyebrow={t.entryEyebrow}
        title={t.entryTitle}
        intro={t.entryIntro}
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {entryPoints.map((point, i) => {
            const copy = t.entry[point.key];
            if (!copy) return null;
            const panel = (
              <Card interactive className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
                  {point.live && <Badge variant="amber">{t.live}</Badge>}
                </div>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                <span className="link-sweep mt-4 w-fit text-sm font-medium text-accent">
                  {copy.cta} →
                </span>
              </Card>
            );
            return (
              <Reveal key={point.key} delay={i * 80}>
                {point.external ? (
                  <a
                    href={point.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {panel}
                  </a>
                ) : (
                  <Link href={localizeHref(locale, point.href)} className="block h-full">
                    {panel}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 5 · CONVERSION */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
      />
    </>
  );
}
