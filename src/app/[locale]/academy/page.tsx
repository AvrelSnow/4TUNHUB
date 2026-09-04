import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { courses } from "@/lib/academy";
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
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {t.primaryCta}
            </Button>
            <Button
              as="a"
              href={localizeHref(locale, "/about/founder")}
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · CATALOG */}
      <Section
        eyebrow={t.catalogEyebrow}
        title={t.catalogTitle}
        intro={t.catalogIntro}
        className="pt-0"
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {courses.map((c, i) => {
            const copy = t.courses[c.key];
            if (!copy) return null;
            return (
              <Reveal key={c.key} delay={i * 70}>
                <Card className="flex h-full flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="amber">{t.levels[c.level]}</Badge>
                    <Badge>{t.formats[c.format]}</Badge>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">{copy.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{copy.outcome}</p>
                  <p className="mt-3 text-sm leading-6 text-foreground">{copy.who}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
                    <Button as="a" href={localizeHref(locale, "/contact")}>
                      {t.primaryCta}
                    </Button>
                    {c.proof && (
                      <Link
                        href={localizeHref(locale, `/about/founder/projects/${c.proof}`)}
                        className="link-sweep text-sm font-medium text-accent"
                      >
                        {t.proofLabel} →
                      </Link>
                    )}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3 · FORMATS */}
      <section className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="eyebrow">{t.formatsEyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">
            {t.formatsTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {t.formatsList.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-background p-6">
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 · INSTRUCTOR CREDIBILITY */}
      <Section eyebrow={t.instructorEyebrow} title={t.instructorTitle} className="pb-0">
        <div className="mt-6 max-w-2xl">
          <p className="text-lg leading-8 text-muted">{t.instructorBody}</p>
          <Link
            href={localizeHref(locale, "/about/founder")}
            className="link-sweep mt-6 inline-block text-sm font-medium text-accent"
          >
            {t.instructorCta} →
          </Link>
        </div>
      </Section>

      {/* 5 · ENROLLMENT CTA */}
      <Container className="py-24">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
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
