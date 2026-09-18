import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/ProjectVisual";
import { services } from "@/lib/services";
import { featuredProjects, getProject } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.services,
    description: dict.services.subtitle,
    alternates: { canonical: `/${locale}/services` },
  };
}

export default async function ServicesPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.services;

  return (
    <>
      {/* 1 · HERO */}
      <Section field="stress" className="pb-14 pt-16 sm:pt-20">
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
              href={localizeHref(locale, "/projects")}
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · OFFERINGS */}
      <Section
        eyebrow={t.offeringsEyebrow}
        title={t.offeringsTitle}
        intro={t.offeringsIntro}
        className="pt-0"
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => {
            const o = t.offerings[s.key];
            if (!o) return null;
            const project = s.proof ? getProject(s.proof) : undefined;
            return (
              <Reveal key={s.key} delay={i * 70}>
                <Card className="flex h-full flex-col">
                  <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">{o.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{o.outcome}</p>
                  <p className="mt-3 text-sm leading-6 text-foreground">{o.who}</p>
                  {project && (
                    <Link
                      href={localizeHref(locale, `/about/founder/projects/${project.slug}`)}
                      className="link-sweep mt-4 w-fit text-sm font-medium text-accent"
                    >
                      {t.proofLabel} →
                    </Link>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3 · HOW WE WORK */}
      <section className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="eyebrow">{t.process.eyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">
            {t.process.title}
          </h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.process.steps.map((step, i) => (
              <li key={step.title} className="ticks relative rounded-2xl border border-border bg-background p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 font-mono text-sm font-bold text-ink-900">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 4 · PROOF */}
      <Section eyebrow={t.proof.eyebrow} title={t.proof.title} intro={t.proof.intro}>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuredProjects.map((p, i) => {
            const copy = dict.projects.items[p.slug];
            if (!copy) return null;
            return (
              <Reveal key={p.slug} delay={i * 70}>
                <Link
                  href={localizeHref(locale, `/about/founder/projects/${p.slug}`)}
                  className="block h-full"
                >
                  <Card interactive className="flex h-full flex-col bg-background">
                    <ProjectVisual
                      category={p.category}
                      index={i}
                      image={p.image}
                      alt={copy.title}
                      className="h-32 w-full"
                    />
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {copy.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{copy.outcome}</p>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8">
          <Link
            href={localizeHref(locale, "/projects")}
            className="link-sweep text-sm font-medium text-accent"
          >
            {t.proof.cta} →
          </Link>
        </div>
      </Section>

      {/* 5 · ENGAGEMENT MODELS */}
      <Section eyebrow={t.models.eyebrow} title={t.models.title} className="pt-0">
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {t.models.items.map((m) => (
            <div key={m.title} className="ticks relative rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-base font-semibold text-foreground">{m.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6 · CONVERSION */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
      />
    </>
  );
}
