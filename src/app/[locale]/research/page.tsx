import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { focusAreas } from "@/lib/research";
import { getProject, projectDetailPath } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { MEDIUM_URL, LINKEDIN_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

/** The field each area works in, photographed. */
const AREA_MEDIA: Record<string, { src: string; position?: string }> = {
  "renewable-energy": { src: "/images/projects/pedal-hero.webp", position: "50% 60%" },
  "sustainable-machinery": { src: "/images/projects/banana-hero.webp", position: "50% 40%" },
  "industrial-rd": { src: "/images/camrail/test-bench.webp" },
};

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
  const banana = dict.projects.galleries["banana-pseudostem-shredder"] ?? [];

  return (
    <>
      {/* 1 · HERO — a lab result, not an illustration of one. */}
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {t.primaryCta}
            </Button>
            <ArrowLink href={localizeHref(locale, "/projects")}>{t.secondaryCta}</ArrowLink>
          </>
        }
      >
        <figure className="mx-auto mt-16 max-w-5xl animate-fade-up [animation-delay:240ms] sm:mt-20">
          <Media
            src="/images/projects/banana-2.webp"
            alt={banana[1] ?? ""}
            doc
            priority
            className="aspect-[16/9] rounded-3xl border border-border"
          />
          <figcaption className="readout mt-3 text-center">{banana[1]}</figcaption>
        </figure>
      </PageHero>

      {/* 2 · FOCUS AREAS */}
      <Section tone="surface" eyebrow={t.focusEyebrow} title={t.focusTitle} intro={t.focusIntro}>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {focusAreas.map((area, i) => {
            const copy = t.areas[area.key];
            const media = AREA_MEDIA[area.key];
            if (!copy) return null;
            const project = area.proof ? getProject(area.proof) : undefined;
            return (
              <Reveal key={area.key} delay={i * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-surface-2">
                  {media && (
                    <Media
                      src={media.src}
                      alt={copy.title}
                      position={media.position}
                      responsive
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="aspect-[4/3]"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-8">
                    <h3 className="text-headline text-foreground">{copy.title}</h3>
                    <p className="mt-6 text-2xs font-semibold text-foreground">{t.whyLabel}</p>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{copy.why}</p>
                    <p className="mt-5 text-2xs font-semibold text-foreground">{t.doingLabel}</p>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{copy.doing}</p>
                    {project && (
                      <ArrowLink
                        href={localizeHref(locale, projectDetailPath(project.slug))}
                        className="mt-auto pt-6"
                      >
                        {t.proofLabel}
                      </ArrowLink>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3 · PUBLICATIONS — The REM, set like a masthead. */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">{t.pubEyebrow}</p>
            <p className="mt-6 text-display-lg text-foreground">The REM</p>
            <h2 className="mx-auto mt-6 max-w-2xl text-headline text-foreground">{t.pubTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lead text-muted">{t.pubBody}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <Button as="a" href={MEDIUM_URL} target="_blank" rel="noopener noreferrer" size="lg">
                {t.pubReadRem}
              </Button>
              <ArrowLink href={LINKEDIN_URL} external>
                {t.pubFollow}
              </ArrowLink>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 4 · INITIATIVES — one statement, given room. */}
      <section className="border-t border-border py-24 sm:py-32">
        <Container size="narrow">
          <Reveal className="text-center">
            <p className="eyebrow">{t.initiativesEyebrow}</p>
            <h2 className="mt-3 text-display-sm text-foreground">{t.initiativesTitle}</h2>
            <p className="mt-6 text-lead text-muted">{t.initiativesBody}</p>
          </Reveal>
        </Container>
      </section>

      {/* 5 · COLLABORATE */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
      />
    </>
  );
}
