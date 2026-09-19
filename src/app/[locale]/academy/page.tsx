import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { CohortFeature } from "@/components/CohortFeature";
import { courses } from "@/lib/academy";
import { projectDetailPath } from "@/lib/projects";
import { COHORT_PATH, applicationsOpen } from "@/lib/cohort";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.academy,
    description: dict.academy.subtitle,
    alternates: { canonical: `/${locale}/academy` },
  };
}

export default async function AcademyPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.academy;
  const beans = dict.projects.galleries["beans-unwrapping-machine"] ?? [];
  const beansTitle = dict.projects.items["beans-unwrapping-machine"]?.title ?? "";

  // What a student learns to do, shown on one real machine: the drawing,
  // the model, the thing that was built.
  const sequence = [
    { src: "/images/projects/beans-3.webp", caption: beans[2] ?? "", doc: true },
    { src: "/images/projects/beans-7.webp", caption: beans[6] ?? "", doc: true },
    { src: "/images/projects/beans-hero.webp", caption: beansTitle, doc: false },
  ];

  return (
    <>
      {/* 1 · HERO */}
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            {/* While Cohort 0 is recruiting, the hero sends people there. */}
            {applicationsOpen() ? (
              <Button as="a" href={localizeHref(locale, COHORT_PATH)} size="lg">
                {dict.home.cohort.cta}
              </Button>
            ) : (
              <Button as="a" href={localizeHref(locale, "/waitlist?track=academy")} size="lg">
                {t.primaryCta}
              </Button>
            )}
            <ArrowLink href={localizeHref(locale, "/about/founder")}>{t.secondaryCta}</ArrowLink>
          </>
        }
      >
        <div className="mt-12 grid animate-fade-up gap-4 [animation-delay:240ms] sm:mt-14 sm:grid-cols-3">
          {sequence.map((s, i) => (
            <figure key={s.src}>
              <Media
                src={s.src}
                alt={s.caption}
                doc={s.doc}
                responsive={!s.doc}
                sizes="(min-width: 640px) 33vw, 100vw"
                priority={i === 0}
                className="aspect-[4/3] rounded-3xl"
              />
              <figcaption className="readout mt-3 text-center">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </PageHero>

      <CohortFeature locale={locale} dict={dict} />

      

      {/* 2 · CATALOG */}
      <Section tone="surface" eyebrow={t.catalogEyebrow} title={t.catalogTitle} intro={t.catalogIntro}>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {courses.map((c, i) => {
            const copy = t.courses[c.key];
            if (!copy) return null;
            return (
              <Reveal key={c.key} delay={(i % 2) * 80}>
                <article className="flex h-full flex-col rounded-3xl bg-surface-2 p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="amber">{t.levels[c.level]}</Badge>
                    <Badge variant="outline">{t.formats[c.format]}</Badge>
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">{copy.title}</h3>
                  <p className="mt-3 text-lead text-muted">{copy.outcome}</p>
                  <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-foreground">
                    {copy.who}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                    <Button as="a" href={localizeHref(locale, "/waitlist?track=academy")}>
                      {t.primaryCta}
                    </Button>
                    {c.proof && (
                      <ArrowLink href={localizeHref(locale, projectDetailPath(c.proof))}>
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

      {/* 3 · HOW YOU LEARN */}
      <Section eyebrow={t.formatsEyebrow} title={t.formatsTitle}>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-3">
          {t.formatsList.map((f) => (
            <div key={f.title} className="border-t border-foreground pt-6">
              <h3 className="text-headline text-foreground">{f.title}</h3>
              <p className="mt-3 text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 · WHO TEACHES */}
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <Reveal>
          <div className="grid items-center overflow-hidden rounded-3xl bg-surface lg:grid-cols-[minmax(0,0.8fr)_1fr]">
            <Media
              src="/images/founder-portrait.webp"
              alt="Donfack Fortune"
              responsive
              sizes="(min-width: 1024px) 40vw, 100vw"
              position="50% 20%"
              className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[24rem]"
            />
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="eyebrow">{t.instructorEyebrow}</p>
              <h2 className="mt-3 text-4xl leading-tight font-bold tracking-tight text-foreground">
                {t.instructorTitle}
              </h2>
              <p className="mt-4 text-lead text-muted">{t.instructorBody}</p>
              <ArrowLink href={localizeHref(locale, "/about/founder")} className="mt-6">
                {t.instructorCta}
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 5 · ENROLMENT */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/waitlist?track=academy") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
      />
    </>
  );
}
