import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { focusAreas } from "@/lib/research";
import { getProject } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { MEDIUM_URL, LINKEDIN_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.research,
    description: dict.research.subtitle,
    alternates: { canonical: `/${locale}/research` },
  };
}

export default async function ResearchPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.research;

  return (
    <>
      {/* 1 · HERO */}
      <Section field="wave" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {t.primaryCta}
            </Button>
            <Button
              as="a"
              href={localizeHref(locale, "/projects")}
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · FOCUS AREAS */}
      <Section
        eyebrow={t.focusEyebrow}
        title={t.focusTitle}
        intro={t.focusIntro}
        className="pt-0"
      >
        <div className="mt-10 grid gap-6">
          {focusAreas.map((area, i) => {
            const copy = t.areas[area.key];
            if (!copy) return null;
            const project = area.proof ? getProject(area.proof) : undefined;
            return (
              <Reveal key={area.key} delay={i * 70}>
                <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-semibold text-foreground">{copy.title}</h2>
                  </div>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-3xs uppercase tracking-wider text-muted">
                        {t.whyLabel}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">{copy.why}</p>
                    </div>
                    <div>
                      <p className="font-mono text-3xs uppercase tracking-wider text-muted">
                        {t.doingLabel}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">{copy.doing}</p>
                    </div>
                  </div>
                  {project && (
                    <Link
                      href={localizeHref(locale, `/about/founder/projects/${project.slug}`)}
                      className="link-sweep mt-5 inline-block text-sm font-medium text-accent"
                    >
                      {t.proofLabel} →
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3 · PUBLICATIONS — The REM */}
      <section className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="eyebrow">{t.pubEyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.pubTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t.pubBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              as="a"
              href={MEDIUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              {t.pubReadRem}
            </Button>
            <Button
              as="a"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="secondary"
            >
              {t.pubFollow}
            </Button>
          </div>
        </Container>
      </section>

      {/* 4 · INITIATIVES */}
      <Section eyebrow={t.initiativesEyebrow} title={t.initiativesTitle}>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t.initiativesBody}</p>
      </Section>

      {/* 5 · COLLABORATE CTA */}
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
              <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
                {t.cta.primary}
              </Button>
              <Button
                as="a"
                href={localizeHref(locale, "/projects")}
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
