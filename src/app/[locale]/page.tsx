import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/ui/Logo";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Counter } from "@/components/ui/Counter";
import { flattenTree } from "@/lib/sitemap";
import { projects, featuredProjects } from "@/lib/projects";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

const OFFERING_PILLARS = ["services", "academy", "research", "products"] as const;

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
            ticks, mono readouts in the gutter. */}
        <figure className="ticks relative mt-16 overflow-hidden rounded-xl border border-border bg-ink-975 p-4 sm:mt-20 sm:p-6">
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

      {/* 6 · ECOSYSTEM OUTLOOK — ambient mech watermark, kept far from text */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/mech-figure.webp"
          alt=""
          aria-hidden="true"
          width={700}
          height={1227}
          className="pointer-events-none absolute -right-16 bottom-0 hidden h-[480px] w-auto opacity-[0.06] lg:block"
        />
        <Section eyebrow={t.outlook.eyebrow} title={t.outlook.title} intro={t.outlook.intro} className="relative pt-0">
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {t.outlook.items.map((o, i) => {
              const isCommunity = o.key === "community";
              const card = (
                <div
                  className={`h-full rounded-2xl border p-6 transition-colors ${
                    isCommunity
                      ? "border-brand-500/40 bg-brand-500/10/50 hover:border-brand-500"
                      : "border-dashed border-hairline hover:border-hairline"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{o.title}</h3>
                    <Badge variant={isCommunity ? "amber" : "outline"}>
                      {isCommunity ? dict.community.live : dict.stub.badge}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{o.desc}</p>
                  <span className="link-sweep mt-4 inline-block text-sm font-medium text-accent">
                    {isCommunity ? dict.community.join : t.learnMore} →
                  </span>
                </div>
              );
              return (
                <Reveal key={o.key} delay={i * 70}>
                  {isCommunity ? (
                    <a
                      href={WHATSAPP_COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {card}
                    </a>
                  ) : (
                    <Link href={href(o.key)} className="block h-full">
                      {card}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </Section>
      </div>

      {/* 7 · CONVERSION BAND — ridged texture + heavy overlay so white
          bold type keeps a very high contrast ratio. */}
      <Container className="pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/texture-ridges.webp"
              alt=""
              aria-hidden="true"
              width={1920}
              height={1280}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink-950/85" aria-hidden="true" />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl text-display text-white">
                {t.conversion.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-7 text-white/90">
                {t.conversion.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
                  {t.conversion.primaryCta}
                </Button>
                <Button
                  as="a"
                  href={localizeHref(locale, "/services")}
                  size="lg"
                  variant="secondary"
                  className="border-white/40 bg-transparent text-white hover:border-brand-500 hover:bg-white/5 hover:text-brand-400"
                >
                  {t.conversion.secondaryCta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
