import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/ui/Logo";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Counter } from "@/components/ui/Counter";
import { flattenTree } from "@/lib/sitemap";
import { projects, featuredProjects } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

const OFFERING_PILLARS = ["services", "academy", "research", "community"] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.home;
  const byKey = new Map(flattenTree().map((n) => [n.key, n]));
  const href = (key: string) => localizeHref(locale, byKey.get(key)?.href ?? "/");

  return (
    <>
      {/* 1 · HERO — cinematic rhythm. The headline runs to the top of the
          display scale and the CFD result is the full-bleed evidence
          underneath it, framed as an instrument viewport rather than
          floated beside the text as an illustration. */}
      <Section
        field="flow"
        rhythm="cinematic"
        className="pt-20 pb-0 sm:pt-28"
      >
        <div className="copy-scrim max-w-5xl">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flow-rule h-px w-10 shrink-0" />
            <p className="eyebrow">{t.eyebrow}</p>
          </div>
          {/* `display`, not `display-lg`: the headline is a full sentence and
              the French copy is longer again. display-lg is held in reserve
              for short statements, where it belongs. */}
          <h1 className="mt-7 text-display text-foreground">
            {t.titleLead}
            <span className="flow-text">{t.titleAccent}</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {t.primaryCta}
            </Button>
            <Button as="a" href={localizeHref(locale, "/services")} size="lg" variant="secondary">
              {t.secondaryCta}
            </Button>
          </div>
        </div>

        {/* Simulation viewport — the instrument frame: hairline, corner
            ticks, mono readouts in the gutter.

            `bg-surface`, not `bg-ink-975`. The old value was the night
            ground itself, chosen so the frame dissolved into the page — and
            it did not follow the ground, so on the day sheet the gutter
            readouts below measured 2.39:1 and 3.27:1, dark ink on a
            near-black plate, on the most important element of the most
            important page. `surface` is what every other panel on the site
            already uses, so the frame now reads as a panel on both grounds
            and the CFD render keeps its own black inside it — which is what
            a viewport onto a simulation should look like anyway. */}
        <figure className="ticks relative mt-16 overflow-hidden rounded-xl border border-border bg-surface p-4 sm:mt-20 sm:p-6">
          <div
            aria-hidden="true"
            className="flow-rule absolute inset-x-0 top-0 h-px"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cfd-vehicle.webp"
            alt="Computational fluid dynamics pressure distribution across a race-car body"
            width={1000}
            height={941}
            fetchPriority="high"
            className="relative mx-auto h-auto w-full max-w-3xl"
          />
          <figcaption className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
            <span className="readout">{t.heroCaption}</span>
            <span className="readout text-accent">4TUN HUB</span>
          </figcaption>
        </figure>
      </Section>

      {/* 2 · TRUST STRIP — compressed rhythm, but the figures are the
          largest mono on the site. This is the rarest material we have;
          it gets treated as the headline it is. */}
      <section className="border-y border-border bg-surface">
        <Container className="py-14 sm:py-16">
          <div className="flex items-center gap-3">
            <p className="eyebrow shrink-0">{t.trust.label}</p>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {t.trust.stats.map((s) => (
              <div key={s.label} className="relative pt-5">
                <span
                  aria-hidden="true"
                  className="flow-rule absolute inset-x-0 top-0 h-0.5 w-10"
                />
                <dt className="flex items-baseline gap-1.5">
                  <span className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-foreground sm:text-5xl">
                    <Counter value={s.value} />
                  </span>
                  {s.unit && (
                    <span className="font-mono text-sm font-medium text-accent">{s.unit}</span>
                  )}
                </dt>
                <dd className="mt-3 text-sm leading-5 text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 3 · WHAT WE DO */}
      <Section eyebrow={t.doEyebrow} title={t.doTitle} intro={t.doIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERING_PILLARS.map((key, i) => (
            <Reveal key={key} delay={i * 70}>
              <Link href={href(key)} className="group block h-full">
                <Card interactive className="flex h-full flex-col">
                  <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {dict.routes[key]}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                    {t.pillars[key]}
                  </p>
                  <span className="link-sweep mt-4 w-fit text-sm font-medium text-accent">
                    {t.learnMore} →
                  </span>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 4 · PROOF */}
      <section className="border-t border-border bg-surface/50">
        <Container className="py-32 sm:py-44">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">{t.proof.eyebrow}</p>
              <h2 className="mt-5 text-display-sm text-foreground">
                {t.proof.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted">{t.proof.intro}</p>
            </div>
            <Link
              href={localizeHref(locale, "/projects")}
              className="link-sweep text-sm font-medium text-accent"
            >
              {t.proof.viewAll} →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredProjects.map((p, i) => {
              const copy = dict.projects.items[p.slug];
              if (!copy) return null;
              return (
                <Reveal key={p.slug} delay={i * 80}>
                  <Link
                    href={localizeHref(locale, `/about/founder/projects/${p.slug}`)}
                    className="block h-full"
                  >
                    <Card interactive className="flex h-full flex-col bg-background">
                      <ProjectVisual
                        category={p.category}
                        index={projects.indexOf(p)}
                        image={p.image}
                        alt={copy.title}
                        className="h-32 w-full"
                      />
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Badge variant="amber">
                          {dict.projects.categories[p.category]}
                        </Badge>
                        <span className="font-mono text-3xs text-muted">{p.year}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-foreground">
                        {copy.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{copy.outcome}</p>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5 · FOUNDER TEASER (org-first, one line) */}
      <Section rhythm="compressed">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-2xl">
              <p className="eyebrow">{t.founder.eyebrow}</p>
              <p className="mt-3 text-xl leading-8 text-foreground">{t.founder.line}</p>
              <Link
                href={localizeHref(locale, "/about/founder")}
                className="link-sweep mt-4 inline-block text-sm font-medium text-accent"
              >
                {t.founder.cta} →
              </Link>
            </div>
            <Logo href={null} variant="mark" size="lg" className="shrink-0" />
          </div>
        </Reveal>
      </Section>

      {/* 7 · CONVERSION — the ticked instrument panel every pillar page
          closes on. It replaced a stock ridged-texture photo. */}
      <CtaPanel
        title={t.conversion.title}
        subtitle={t.conversion.subtitle}
        primary={{ label: t.conversion.primaryCta, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.conversion.secondaryCta, href: localizeHref(locale, "/services") }}
      />
    </>
  );
}
