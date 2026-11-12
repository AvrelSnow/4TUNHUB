import { Fragment } from "react";
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
import { Testimonials } from "@/components/Testimonials";
import { BeamLab } from "@/components/BeamLab";
import { flattenTree } from "@/lib/sitemap";
import { projects, featuredProjects, projectDetailPath } from "@/lib/projects";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site";
import { founderAffiliations, partners } from "@/lib/trust";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The home page is one continuous experience (docs/visual-experience.md):
 *
 *   workshop light → the claim → the evidence fanned out → the disciplines
 *   ticking past → the four pillars → a beam you can
 *   load yourself → the machines that shipped → what people say → the
 *   person behind it all, with his record → the closing band and footer
 *   where every page ends.
 *
 * The hero is a fan of five real photographs — machines that were
 * designed, simulated and built. No render, no stock: the first thing a
 * visitor sees is evidence. The founder appears once, below, as the proof
 * behind the work, never as the work itself (positioning: an ecosystem,
 * not a portfolio).
 */
const HERO_SHOTS = [
  { src: "/images/projects/banana-hero.webp", key: "banana-pseudostem-shredder", offset: "lg:mt-20", mobile: false },
  { src: "/images/projects/pedal-hero.webp", key: "pedal-power-charger", offset: "mt-8 lg:mt-8", mobile: true },
  { src: "/images/projects/braking-hero.webp", key: "locomotive-braking-analysis", offset: "mt-0", mobile: true },
  { src: "/images/projects/beans-hero.webp", key: "beans-unwrapping-machine", offset: "mt-8 lg:mt-8", mobile: true },
  { src: "/images/projects/fsae-hero.webp", key: "fsae-race-car", offset: "lg:mt-20", mobile: false },
] as const;

/** The marquee's dots alternate the logo's amber and black. */
const DOTS = ["bg-dot-red", "bg-dot-blue", "bg-dot-green", "bg-brand-500", "bg-dot-violet"] as const;

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
      {/* 1 · HERO — workshop light behind the claim, then the evidence.
          The atmosphere fades out at its foot, so the hero hands over to
          the page instead of ending on an edge. */}
      <section className="relative overflow-hidden pt-16 sm:pt-24">
        <div aria-hidden="true" className="atmosphere atmosphere-fade" />
        <Container className="relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow animate-fade-in">{t.eyebrow}</p>
            <h1 className="mt-5 text-display-lg text-foreground">
              <HeroTitle text={t.title} />
            </h1>
            <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lead text-muted [animation-delay:420ms]">
              {t.subtitle}
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-x-7 gap-y-4 [animation-delay:520ms]">
              <Button as="a" href={localizeHref(locale, "/contact")} size="lg" data-magnetic="">
                {t.primaryCta}
              </Button>
              <ArrowLink href={localizeHref(locale, "/services")}>{t.secondaryCta}</ArrowLink>
            </div>
          </div>
        </Container>

        <div className="relative mx-auto mt-16 max-w-7xl px-3 sm:mt-20 sm:px-6">
          <div className="fan grid grid-cols-3 items-start gap-2.5 sm:gap-4 lg:grid-cols-5">
            {HERO_SHOTS.map((shot, i) => {
              const alt = dict.projects.items[shot.key]?.title ?? "";
              return (
                <div key={shot.src} className={cn(shot.offset, !shot.mobile && "hidden lg:block")}>
                  <div
                    className="animate-fade-up"
                    style={{ animationDelay: `${560 + Math.abs(2 - i) * 90}ms` }}
                  >
                    <Media
                      src={shot.src}
                      alt={alt}
                      priority={i === 2}
                      responsive
                      sizes="(min-width: 1024px) 20vw, 33vw"
                      className="aspect-[3/4] rounded-2xl shadow-e2 sm:rounded-3xl"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The disciplines behind the work, as a ticker. The second copy
            only makes the loop seamless, so assistive tech skips it. */}
        <div className="marquee relative mt-14 py-6 sm:mt-20">
          {[false, true].map((dup) => (
            <ul
              key={String(dup)}
              aria-hidden={dup ? "true" : undefined}
              className="marquee-track items-center gap-x-10 pr-10 text-lg font-semibold tracking-tight text-muted sm:text-xl"
            >
              {t.disciplines.map((d, i) => (
                <li key={d} className="flex items-center gap-10 whitespace-nowrap">
                  {d}
                  <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", DOTS[i % DOTS.length])} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* 2 · WHERE THE WORK HAS BEEN DONE — a logo strip (after Fapshi),
          worded for what it is. These are the founder's employers and the
          schools he taught at, not clients or partners of the Hub, and the
          label says so; the Hub's own partner sits apart under its own
          name. Every logo links to the organisation, so it can be checked. */}
      <section aria-labelledby="strip-label" className="pt-6 pb-16 sm:pb-20">
        <Container>
          <p id="strip-label" className="text-center text-sm font-medium text-muted">
            {t.strip.founder}
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {founderAffiliations.filter((a) => a.logo).map((a) => (
              <li key={a.name}>
                <LogoChip name={a.name} logo={a.logo!} href={a.href} />
              </li>
            ))}
          </ul>
          {partners.length > 0 && (
            <p className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              <span>{t.strip.partner}</span>
              {partners.filter((a) => a.logo).map((a) => (
                <LogoChip key={a.name} name={a.name} logo={a.logo!} href={a.href} wide />
              ))}
            </p>
          )}
        </Container>
      </section>

      {/* COHORT 0, while applications are open. */}
      <CohortFeature locale={locale} dict={dict} />

      {/* 3 · WHAT WE DO — four tiles, four hues. Each tile answers the
          pointer with light in its pillar's colour and carries its own
          evidence. */}
      <section className="bg-surface py-24 sm:py-32">
        <Container>
          <SectionHeader eyebrow={t.doEyebrow} title={t.doTitle} intro={t.doIntro} />

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Reveal className="lg:col-span-2">
              <Link
                href={href("services")}
                className="spotlight lift group grid h-full grid-cols-1 overflow-hidden rounded-3xl bg-surface-2 lg:grid-cols-2"
              >
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <PillarName>{dict.routes.services}</PillarName>
                  <h3 className="mt-3 text-display-sm text-foreground">{dict.services.title}</h3>
                  <p className="mt-4 max-w-md text-muted">{t.pillars.services}</p>
                  <span className="text-hue mt-6 inline-flex items-center gap-1 font-semibold underline decoration-brand-500 decoration-2 underline-offset-4">
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
            />

            {/* Community: the one pillar that is live today says so. */}
            <Reveal className="lg:col-span-2">
              <div className="spotlight flex flex-col gap-8 rounded-3xl bg-surface-2 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3">
                    <PillarName>{dict.routes.community}</PillarName>
                    <Badge variant="amber">
                      <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
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
                    variant="ink"
                    className="text-center max-sm:h-auto max-sm:min-h-12 max-sm:whitespace-normal max-sm:py-3"
                  >
                    {dict.community.join}
                  </Button>
                  <ArrowLink href={href("community")}>{t.communityMore}</ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5 · TRY IT — the page's one interactive engineering graphic. A
          visitor does what a student does on day one, and sees the numbers
          answer. */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader eyebrow={t.beam.eyebrow} title={t.beam.title} intro={t.beam.intro} />
              <ArrowLink href={href("academy")}>{t.beam.cta}</ArrowLink>
            </div>
          </Reveal>
          <div className="mt-12">
            <BeamLab t={t.beam} locale={locale} />
          </div>
        </Container>
      </section>

      {/* 6 · PROOF — a rail of real projects. */}
      <section className="pb-24 sm:pb-32">
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
                <Link href={localizeHref(locale, projectDetailPath(p.slug))} className="group block rounded-3xl">
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

      {/* 7 · WHAT PEOPLE SAY — renders nothing until there are real,
          named quotes to print. */}
      <Testimonials t={t.testimonials} />

      {/* 8 · FOUNDER — org first, the person second, but a real person.
          His track record sits with him, because it is his: the Hub is
          young, and the page says so by putting the numbers here rather
          than under the hero. */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-3xl bg-surface lg:grid-cols-[5fr_7fr]">
              <Media
                src="/images/founder-portrait.webp"
                alt="Donfack Fortune"
                responsive
                sizes="(min-width: 1024px) 42vw, 100vw"
                position="50% 20%"
                className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[34rem]"
              />
              <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:py-16">
                <p className="eyebrow">{t.founder.eyebrow}</p>
                <p className="mt-4 text-2xl leading-snug font-medium tracking-tight text-foreground">{t.founder.line}</p>
                <ArrowLink href={localizeHref(locale, "/about/founder")} className="mt-7">
                  {t.founder.cta}
                </ArrowLink>

                <dl
                  aria-label={t.trust.label}
                  className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-hairline pt-8 sm:grid-cols-4"
                >
                  {t.trust.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd>
                        <span className="figure block text-3xl font-extrabold tracking-tight text-foreground [font-stretch:118%]">
                          {s.value}
                          {s.unit}
                        </span>
                        <span className="mt-1.5 block text-2xs leading-4 text-muted">{s.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 9 · CONVERSION — the night band every page ends on. */}
      <CtaPanel
        title={t.conversion.title}
        subtitle={t.conversion.subtitle}
        primary={{ label: t.conversion.primaryCta, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.conversion.secondaryCta, href: localizeHref(locale, "/services") }}
        quote={false}
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
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  image: string;
  alt: string;
}) {
  return (
    <Reveal>
      <Link
        href={href}
        className="spotlight lift group flex h-full flex-col overflow-hidden rounded-3xl bg-surface-2"
      >
        <div className="p-8 sm:p-12 sm:pb-8">
          <PillarName>{eyebrow}</PillarName>
          <h3 className="mt-3 text-headline text-foreground">{title}</h3>
          <p className="mt-3 text-muted">{body}</p>
          <span className="text-hue mt-5 inline-flex items-center gap-1 font-semibold underline decoration-brand-500 decoration-2 underline-offset-4">
            {cta}
            <Chevron />
          </span>
        </div>
        <Media src={image} alt={alt} doc zoom className="mt-auto aspect-[16/10]" />
      </Link>
    </Reveal>
  );
}

/** One organisation's logo on a white chip, linked to its own site. */
function LogoChip({ name, logo, href, wide = false }: { name: string; logo: string; href?: string; wide?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  const art = <img src={logo} alt={name} loading="lazy" />;
  const cls = cn("chip-logo lift", wide && "chip-logo-wide");
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={name} className={cls}>
      {art}
    </a>
  ) : (
    <span title={name} className={cls}>
      {art}
    </span>
  );
}

/** A pillar's name in the deep amber, with an amber dot beside it. */
function PillarName({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow text-hue inline-flex items-center gap-2">
      <span aria-hidden="true" className="bg-hue h-2 w-2 rounded-full" />
      {children}
    </p>
  );
}

/**
 * The hero sentence, word by word (`.words` in globals.css). The first
 * sentence is the ink; the answer after it is the accent: indigo by day,
 * amber by night. Screen readers and search engines get it whole.
 */
function HeroTitle({ text }: { text: string }) {
  const cut = text.indexOf(". ");
  const parts = cut > 0 ? [text.slice(0, cut + 1), text.slice(cut + 2)] : [text];
  let i = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="words">
        {parts.map((part, p) =>
          part.split(" ").map((w, k) => (
            <Fragment key={`${p}-${k}`}>
              <span
                style={{ "--i": i++ } as React.CSSProperties}
                className={p === 1 ? "text-brand-500" : undefined}
              >
                {w}
              </span>{" "}
            </Fragment>
          )),
        )}
      </span>
    </>
  );
}
