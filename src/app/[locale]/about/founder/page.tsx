import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { FounderConnect } from "@/components/FounderConnect";
import { ResumeMenu } from "@/components/ResumeMenu";
import { founder } from "@/lib/founder";
import { projects, projectDetailPath } from "@/lib/projects";
import { talks, TALKS_ARCHIVE_URL, TALKS_VIDEO_URL } from "@/lib/talks";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: founder.name,
    description: founder.bio[locale],
    alternates: { canonical: `/${locale}/about/founder` },
    openGraph: { title: founder.name, description: founder.bio[locale], type: "profile" },
  };
}

export default async function FounderPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.founderPage;
  const s = t.sections;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.title.en,
    description: founder.bio.en,
    url: `${SITE_URL}/${locale}/about/founder`,
    worksFor: { "@type": "Organization", name: "4TUN Hub", url: SITE_URL },
    alumniOf: "ENSET Douala",
    knowsAbout: [...founder.skills.technical, ...founder.skills.software],
    sameAs: founder.links.filter((l) => l.href.startsWith("http")).map((l) => l.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO — the person, plainly. */}
      <section className="pt-10 pb-20 sm:pt-14 sm:pb-28">
        <Container>
          <Link
            href={localizeHref(locale, "/about")}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="rotate-180">
              <Chevron />
            </span>
            {t.back}
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="eyebrow">{founder.title[locale]}</p>
              <h1 className="mt-3 animate-fade-up text-display text-foreground">{founder.name}</h1>
              <p className="mt-3 text-muted">{founder.location[locale]}</p>
              <p className="mt-7 max-w-xl text-lead text-muted">{founder.bio[locale]}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
                  {t.contactCta}
                </Button>
                <ResumeMenu
                  label={t.resumeCta}
                  items={founder.resumes.map((r) => ({
                    key: r.key,
                    label: r.label[locale],
                    href: r.href,
                    external: r.external,
                  }))}
                />
              </div>
            </div>
            <Media
              src={founder.portrait}
              alt={founder.name}
              priority
              responsive
              sizes="(min-width: 1024px) 45vw, 100vw"
              position="50% 18%"
              className="order-1 aspect-[4/5] animate-fade-up rounded-3xl lg:order-2"
            />
          </div>

          <dl className="mt-20 grid grid-cols-2 gap-y-10 border-t border-border pt-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
            {founder.stats.map((st) => (
              <div key={st.label.en} className="lg:px-6 lg:first:pl-0">
                <dt className="sr-only">{st.label[locale]}</dt>
                <dd>
                  <span className="figure block text-display-sm text-foreground">{st.value}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{st.label[locale]}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* EXPERIENCE — the CAMRAIL years, with their own page. */}
      <section className="bg-surface py-24 sm:py-32">
        <Container>
          <h2 className="eyebrow">{s.experience}</h2>
          <Reveal>
            <Link
              href={localizeHref(locale, "/about/founder/camrail")}
              className="group mt-6 grid overflow-hidden rounded-3xl bg-surface-2 lg:grid-cols-[1.3fr_1fr]"
            >
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <h3 className="text-display-sm text-foreground">{founder.camrail.role[locale]}</h3>
                <p className="mt-5 max-w-2xl text-lead text-muted">{founder.camrail.blurb[locale]}</p>
                <span className="mt-7 inline-flex items-center gap-1 font-medium text-accent">
                  {founder.camrail.cta[locale]}
                  <Chevron />
                </span>
              </div>
              <Media
                src="/images/camrail/portrait.webp"
                alt=""
                zoom
                responsive
                sizes="(min-width: 1024px) 40vw, 100vw"
                position="50% 30%"
                className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[26rem]"
              />
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* EDUCATION */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-display-sm text-foreground">{s.education}</h2>
          <ul className="divide-y divide-border border-y border-border">
            {founder.education.map((ed) => (
              <li key={ed.period} className="grid gap-1 py-6 sm:grid-cols-[1fr_auto] sm:gap-8">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {ed.degree[locale]}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {ed.school} · {ed.note}
                  </p>
                </div>
                <span className="figure text-sm text-muted sm:text-right">{ed.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* TALKS — the public record: what he has run, co-hosted and been
          invited onto, each one linked to the page that proves it. This is
          the part of the founder page a search engine can actually read,
          and the part a stranger can check. */}
      <Section title={t.talks.title} intro={t.talks.intro}>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {talks.map((talk) => (
            <li key={`${talk.title}-${talk.org}`}>
              <a
                href={talk.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="w-32 shrink-0 text-2xs font-semibold tracking-wide text-accent">
                  {t.talks.roles[talk.role]}
                </span>
                <span className="flex-1">
                  <span className="font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                    {talk.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {talk.org}
                    {talk.date ? ` · ${talk.date}` : ""}
                  </span>
                  {talk.note && (
                    <span className="mt-2 block max-w-2xl text-sm leading-6 text-muted">
                      {talk.note}
                    </span>
                  )}
                </span>
                <span className="hidden shrink-0 text-muted sm:block">
                  <Chevron external />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
          <ArrowLink href={TALKS_ARCHIVE_URL} external>
            {t.talks.archive}
          </ArrowLink>
          <ArrowLink href={TALKS_VIDEO_URL} external>
            {t.talks.videos}
          </ArrowLink>
        </div>
      </Section>

      {/* PORTFOLIO */}
      <Section
        tone="surface"
        eyebrow={s.portfolio}
        title={dict.routes.projects}
        intro={t.portfolioIntro}
      >
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const copy = dict.projects.items[p.slug];
            if (!copy) return null;
            return (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <Link href={localizeHref(locale, projectDetailPath(p.slug))} className="group block">
                  {p.image && (
                    <Media
                      src={p.image}
                      alt={copy.title}
                      zoom
                      responsive
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] rounded-3xl"
                    />
                  )}
                  <p className="mt-5 text-2xs font-medium text-muted">
                    {dict.projects.categories[p.category]} · <span className="figure">{p.year}</span>
                  </p>
                  <h3 className="mt-1.5 text-headline text-foreground">{copy.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{copy.outcome}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    {t.viewProject}
                    <Chevron />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* SKILLS · AWARDS · CERTIFICATIONS · CONNECT */}
      <Section>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-display-sm text-foreground">{s.skills}</h2>
            <div className="mt-8 space-y-7">
              {(["software", "technical", "workshop"] as const).map((group) => (
                <div key={group}>
                  <p className="text-sm font-semibold text-foreground">{t.skillGroups[group]}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {founder.skills[group].map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full bg-surface px-3.5 py-1.5 text-sm text-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="mt-16 text-display-sm text-foreground">{s.awards}</h2>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {founder.awards.map((a) => (
                <li key={a.title.en + a.year} className="flex items-baseline justify-between gap-4 py-4">
                  <span>
                    <span className="font-medium text-foreground">{a.title[locale]}</span>
                    <span className="block text-sm text-muted">{a.place}</span>
                  </span>
                  <span className="figure shrink-0 text-sm text-muted">{a.year}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-display-sm text-foreground">{s.certifications}</h2>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {founder.certifications.map((c) => (
                <li
                  key={c.name + c.issuer}
                  className="flex items-baseline justify-between gap-4 py-4"
                >
                  <span>
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="block text-sm text-muted">{c.issuer}</span>
                  </span>
                  <span className="figure shrink-0 text-sm text-muted">{c.year}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-16 text-display-sm text-foreground">{s.connect}</h2>
            <FounderConnect className="mt-8" links={founder.links} />
          </div>
        </div>
      </Section>
    </>
  );
}
