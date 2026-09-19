import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { services } from "@/lib/services";
import { getProject, projectDetailPath } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type Params = { params: Promise<{ locale: string }> };

/**
 * The picture for each offering: the evidence that it has been done.
 * `doc` marks a drawing or plot, shown whole on white.
 */
const OFFERING_MEDIA: Record<string, { src: string; doc?: boolean; position?: string }> = {
  "mechanical-design": { src: "/images/projects/banana-hero.webp", position: "50% 40%" },
  simulation: { src: "/images/projects/pedal-9.webp", doc: true },
  "reverse-engineering": { src: "/images/projects/braking-hero.webp", position: "50% 45%" },
  "energy-consulting": { src: "/images/projects/pedal-hero.webp", position: "50% 55%" },
};

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
  const braking = dict.projects.galleries["locomotive-braking-analysis"] ?? [];

  return (
    <>
      {/* 1 · HERO — the title's claim, shown: a drawing, and the part built from it. */}
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
        <div className="mt-16 grid animate-fade-up gap-4 [animation-delay:240ms] sm:mt-20 sm:grid-cols-2">
          <figure>
            <Media
              src="/images/projects/braking-3.webp"
              alt={braking[2] ?? ""}
              doc
              priority
              className="aspect-[4/3] rounded-3xl"
            />
            <figcaption className="readout mt-3 text-center">{braking[2]}</figcaption>
          </figure>
          <figure>
            <Media
              src="/images/projects/braking-2.webp"
              alt={braking[1] ?? ""}
              className="aspect-[4/3] rounded-3xl"
            />
            <figcaption className="readout mt-3 text-center">{braking[1]}</figcaption>
          </figure>
        </div>
      </PageHero>

      {/* 2 · OFFERINGS — one row each, the picture alternating sides. */}
      <Section
        tone="surface"
        eyebrow={t.offeringsEyebrow}
        title={t.offeringsTitle}
        intro={t.offeringsIntro}
      >
        <div className="mt-16 space-y-6">
          {services.map((s, i) => {
            const o = t.offerings[s.key];
            const media = OFFERING_MEDIA[s.key];
            if (!o) return null;
            const project = s.proof ? getProject(s.proof) : undefined;
            const flip = i % 2 === 1;
            return (
              <Reveal key={s.key}>
                <article className="grid items-center overflow-hidden rounded-3xl bg-surface-2 lg:grid-cols-2">
                  {media && (
                    <Media
                      src={media.src}
                      alt={o.title}
                      doc={media.doc}
                      responsive={!media.doc}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      position={media.position}
                      className={cn("aspect-[4/3] lg:h-full", flip && "lg:order-2")}
                    />
                  )}
                  <div className="p-8 sm:p-12 lg:p-14">
                    <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                      {o.title}
                    </h3>
                    <p className="mt-4 text-lead text-muted">{o.outcome}</p>
                    <p className="mt-5 border-t border-border pt-5 text-sm leading-6 text-foreground">
                      {o.who}
                    </p>
                    {project && (
                      <ArrowLink
                        href={localizeHref(locale, projectDetailPath(project.slug))}
                        className="mt-6"
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
        <div className="mt-12 text-center">
          <ArrowLink href={localizeHref(locale, "/projects")}>{t.proof.cta}</ArrowLink>
        </div>
      </Section>

      {/* 3 · HOW WE WORK — four steps, in order, because they happen in order. */}
      <Section eyebrow={t.process.eyebrow} title={t.process.title}>
        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.steps.map((step, i) => (
            <li key={step.title} className="border-t border-foreground pt-6">
              <p className="figure text-sm font-medium text-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-headline text-foreground">{step.title}</h3>
              <p className="mt-3 text-muted">{step.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4 · WAYS TO ENGAGE */}
      <Section eyebrow={t.models.eyebrow} title={t.models.title} className="pt-0 sm:pt-0 lg:pt-0">
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {t.models.items.map((m, i) => (
            <Reveal key={m.title} delay={i * 70}>
              <div className="h-full rounded-3xl bg-surface p-8">
                <h3 className="text-headline text-foreground">{m.title}</h3>
                <p className="mt-3 text-muted">{m.desc}</p>
              </div>
            </Reveal>
          ))}
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
