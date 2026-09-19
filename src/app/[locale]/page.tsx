import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { Rail, RailItem } from "@/components/ui/Rail";
import { SectionHeader } from "@/components/ui/Section";
import { CohortFeature } from "@/components/CohortFeature";
import { flattenTree } from "@/lib/sitemap";
import { projects, featuredProjects, projectDetailPath } from "@/lib/projects";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The hero is a fan of five real photographs: machines designed and built
 * by the founder, and the founder on site. No render, no stock: the first
 * thing a visitor sees is evidence. Offsets make the row read as a set
 * rather than a grid; phones keep the middle three.
 */
const HERO_SHOTS = [
  { src: "/images/projects/banana-hero.webp", key: "banana-pseudostem-shredder", offset: "lg:mt-20", mobile: false },
  { src: "/images/projects/pedal-hero.webp", key: "pedal-power-charger", offset: "mt-8 lg:mt-8", mobile: true },
  { src: "/images/projects/braking-hero.webp", key: "locomotive-braking-analysis", offset: "mt-0", mobile: true },
  { src: "/images/projects/beans-hero.webp", key: "beans-unwrapping-machine", offset: "mt-8 lg:mt-8", mobile: true },
  { src: "/images/camrail/portrait.webp", key: "founder", offset: "lg:mt-20", mobile: false },
] as const;

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

  // Featured work first, then the rest. Reference photos (a project with no
  // photograph of its own) stay on their case study, out of the proof rail.
  const ordered = [...featuredProjects, ...projects.filter((p) => !p.featured)].filter(
    (p) => p.image && !p.imageIllustrative,
  );

  return (
    <>
      {/* 1 · HERO */}
      <section className="overflow-hidden pt-16 sm:pt-24">
        <Container>
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow animate-fade-in">{t.eyebrow}</p>
            <h1 className="mt-4 animate-fade-up text-display-lg text-foreground">{t.title}</h1>
            <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lead text-muted [animation-delay:90ms]">
              {t.subtitle}
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-x-7 gap-y-4 [animation-delay:180ms]">
              <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
                {t.primaryCta}
              </Button>
              <ArrowLink href={localizeHref(locale, "/services")}>{t.secondaryCta}</ArrowLink>
            </div>
          </div>
        </Container>

        <div className="mx-auto mt-16 max-w-7xl px-3 sm:mt-20 sm:px-6">
          <div className="grid grid-cols-3 items-start gap-2.5 sm:gap-4 lg:grid-cols-5">
            {HERO_SHOTS.map((shot, i) => {
              const alt =
                shot.key === "founder"
                  ? dict.about.founderTitle
                  : dict.projects.items[shot.key]?.title ?? "";
              return (
                <div
                  key={shot.src}
                  className={cn(
                    "animate-fade-up",
                    shot.offset,
                    !shot.mobile && "hidden lg:block",
                  )}
                  style={{ animationDelay: `${240 + Math.abs(2 - i) * 90}ms` }}
                >
                  <Media
                    src={shot.src}
                    alt={alt}
                    priority={i === 2}
                    responsive
                    sizes="(min-width: 1024px) 20vw, 33vw"
                    className="aspect-[3/4] rounded-2xl sm:rounded-3xl"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2 · COHORT 0, while applications are open. */}

      <CohortFeature locale={locale} dict={dict} />

      

      {/* 3 · TRACK RECORD */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <p className="text-center text-sm font-medium text-muted">{t.trust.label}</p>
            <dl className="mt-10 grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:divide-x lg:divide-border">
              {t.trust.stats.map((s) => (
                <div key={s.label} className="px-4 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="figure block text-display-sm text-foreground">
                      {s.value}
                      {s.unit}
                    </span>
                    <span className="mx-auto mt-3 block max-w-44 text-sm leading-6 text-muted">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* 3 · WHAT WE DO — tiles, each with its own evidence. */}
      <section className="bg-surface py-24 sm:py-32">
        <Container>
          <SectionHeader eyebrow={t.doEyebrow} title={t.doTitle} intro={t.doIntro} />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {/* Services: wide, the stress plot beside the words. */}
            <Reveal className="lg:col-span-2">
              <Link
                href={href("services")}
                className="group grid h-full overflow-hidden rounded-3xl bg-surface-2 lg:grid-cols-2"
              >
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <p className="eyebrow">{dict.routes.services}</p>
                  <h3 className="mt-3 text-display-sm text-foreground">{dict.services.title}</h3>
                  <p className="mt-4 max-w-md text-muted">{t.pillars.services}</p>
                  <span className="mt-6 inline-flex items-center gap-1 font-medium text-accent">
                    {t.learnMore}
                    <Chevron />
                  </span>
                </div>
                <Media
                  src="/images/projects/pedal-9.webp"
                  alt={dict.projects.galleries["pedal-power-charger"]?.[8] ?? ""}
                  doc
                  zoom
                  className="aspect-[4/3] lg:aspect-auto lg:h-full"
                />
              </Link>
            </Reveal>

            <PillarTile
              href={href("academy")}
              eyebrow={dict.routes.academy}
              title={dict.academy.title}
              body={t.pillars.academy}
              cta={t.learnMore}
              image="/images/projects/beans-8.webp"
              alt={dict.projects.galleries["beans-unwrapping-machine"]?.[7] ?? ""}
            />
            <PillarTile
              href={href("research")}
              eyebrow={dict.routes.research}
              title={dict.research.title}
              body={t.pillars.research}
              cta={t.learnMore}
              image="/images/projects/banana-2.webp"
              alt={dict.projects.galleries["banana-pseudostem-shredder"]?.[1] ?? ""}
              delay={80}
            />

            {/* Community: the one pillar that is live today says so. */}
            <Reveal className="lg:col-span-2">
              <div className="flex flex-col gap-8 rounded-3xl bg-surface-2 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3">
                    <p className="eyebrow">{dict.routes.community}</p>
                    <Badge variant="amber">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      {dict.community.live}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-display-sm text-foreground">{dict.community.cta.title}</h3>
                  <p className="mt-4 text-muted">{t.pillars.community}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Button
                    as="a"
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    {dict.community.join}
                  </Button>
                  <ArrowLink href={href("community")}>{t.learnMore}</ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4 · PROOF — a rail of real projects. */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader eyebrow={t.proof.eyebrow} title={t.proof.title} intro={t.proof.intro} />
            <ArrowLink href={localizeHref(locale, "/projects")}>{t.proof.viewAll}</ArrowLink>
          </div>
        </Container>

        <Rail
          className="mt-12"
          labels={{ previous: dict.a11y.previous, next: dict.a11y.next, region: t.proof.eyebrow }}
        >
          {ordered.map((p) => {
            const copy = dict.projects.items[p.slug];
            if (!copy || !p.image) return null;
            return (
              <RailItem key={p.slug}>
                <Link href={localizeHref(locale, projectDetailPath(p.slug))} className="group block">
                  <Media
                    src={p.image}
                    alt={copy.title}
                    zoom
                    responsive
                    sizes="(min-width: 1024px) 384px, 78vw"
                    className="aspect-[4/5] rounded-3xl"
                  />
                  <p className="mt-5 text-2xs font-medium text-muted">
                    {dict.projects.categories[p.category]} · <span className="figure">{p.year}</span>
                  </p>
                  <h3 className="mt-1.5 text-headline text-foreground">{copy.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{copy.outcome}</p>
                </Link>
              </RailItem>
            );
          })}
        </Rail>
      </section>

      {/* 5 · FOUNDER — org first, the person second, but a real person. */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-surface lg:grid-cols-2 lg:gap-0">
              <Media
                src="/images/founder-portrait.webp"
                alt="Donfack Fortune"
                responsive
                sizes="(min-width: 1024px) 50vw, 100vw"
                position="50% 20%"
                className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
              />
              <div className="px-8 pb-10 sm:px-12 lg:py-16">
                <p className="eyebrow">{t.founder.eyebrow}</p>
                <p className="mt-4 text-2xl leading-snug font-medium tracking-tight text-foreground">{t.founder.line}</p>
                <ArrowLink href={localizeHref(locale, "/about/founder")} className="mt-7">
                  {t.founder.cta}
                </ArrowLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 6 · CONVERSION */}
      <CtaPanel
        title={t.conversion.title}
        subtitle={t.conversion.subtitle}
        primary={{ label: t.conversion.primaryCta, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.conversion.secondaryCta, href: localizeHref(locale, "/services") }}
      />
    </>
  );
}

function PillarTile({
  href,
  eyebrow,
  title,
  body,
  cta,
  image,
  alt,
  delay = 0,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  image: string;
  alt: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface-2"
      >
        <div className="p-8 sm:p-12 sm:pb-8">
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="mt-3 text-headline text-foreground">{title}</h3>
          <p className="mt-3 text-muted">{body}</p>
          <span className="mt-5 inline-flex items-center gap-1 font-medium text-accent">
            {cta}
            <Chevron />
          </span>
        </div>
        <Media src={image} alt={alt} doc zoom className="mt-auto aspect-[16/10]" />
      </Link>
    </Reveal>
  );
}
