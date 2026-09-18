import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/ProjectVisual";
import { FounderConnect } from "@/components/FounderConnect";
import { ResumeMenu } from "@/components/ResumeMenu";
import { founder } from "@/lib/founder";
import { projects } from "@/lib/projects";
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

      {/* Hero */}
      <Section field="kinematic" className="pb-14 pt-14 sm:pt-16">
        <Link
          href={localizeHref(locale, "/about")}
          className="link-sweep text-sm font-medium text-accent"
        >
          ← {t.back}
        </Link>
        <div className="mt-8 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
          <span className="plate block h-36 w-36 shrink-0 rounded-xl border border-border sm:h-44 sm:w-44">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={founder.portrait}
              alt={founder.name}
              width={176}
              height={176}
              className="h-full w-full object-cover"
            />
          </span>
          <div>
            <h1 className="text-display text-foreground">
              {founder.name}
            </h1>
            <p className="mt-3 font-mono text-sm text-accent">{founder.title[locale]}</p>
            <p className="mt-1 text-sm text-muted">{founder.location[locale]}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{founder.bio[locale]}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as="a" href={localizeHref(locale, "/contact")} size="md">
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
        </div>

        {/* Stats */}
        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 lg:grid-cols-4">
          {founder.stats.map((st) => (
            <div key={st.label.en}>
              <dt className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                {st.value}
              </dt>
              <dd className="mt-1 text-sm text-muted">{st.label[locale]}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Experience — CAMRAIL flagship, links to the dedicated deep page */}
      <section className="border-y border-border bg-surface">
        <Container className="py-16">
          <h2 className="eyebrow">{s.experience}</h2>
          <Reveal>
            <Link
              href={localizeHref(locale, "/about/founder/camrail")}
              className="mt-8 block"
            >
              <div className="ticks relative group grid gap-8 overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-brand-500/60 hover:shadow-e2 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {founder.camrail.role[locale]}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                    {founder.camrail.blurb[locale]}
                  </p>
                  <span className="link-sweep mt-4 inline-block text-sm font-medium text-accent">
                    {founder.camrail.cta[locale]} →
                  </span>
                </div>
                <span className="plate hidden h-40 w-32 shrink-0 rounded-xl border border-border sm:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/camrail/portrait.webp"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* Education */}
      <Section className="pb-0">
        <h2 className="eyebrow">{s.education}</h2>
        <ul className="mt-8 space-y-5">
          {founder.education.map((ed) => (
            <li key={ed.period} className="grid gap-1 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-base font-semibold text-foreground">{ed.degree[locale]}</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {ed.school} · {ed.note}
                </p>
              </div>
              <span className="font-mono text-xs text-muted sm:text-right">{ed.period}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Portfolio — every project on /projects, linked */}
      <Section eyebrow={s.portfolio} title={dict.routes.projects} intro={t.portfolioIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const copy = dict.projects.items[p.slug];
            if (!copy) return null;
            return (
              <Reveal key={p.slug} delay={i * 60}>
                <Link href={localizeHref(locale, `/about/founder/projects/${p.slug}`)} className="block h-full">
                  <div className="ticks relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-e2">
                    <ProjectVisual
                      category={p.category}
                      index={i}
                      image={p.image}
                      alt={copy.title}
                      className="h-40 w-full"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="amber">{dict.projects.categories[p.category]}</Badge>
                        <span className="font-mono text-3xs text-muted">{p.year}</span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-foreground">{copy.title}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">{copy.outcome}</p>
                      <span className="link-sweep mt-3 w-fit text-sm font-medium text-accent">
                        {t.viewProject} →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Skills + Certifications + Awards */}
      <section className="border-t border-border bg-surface/50">
        <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="eyebrow">{s.skills}</h2>
            <div className="mt-6 space-y-5">
              {(["software", "technical", "workshop"] as const).map((group) => (
                <div key={group}>
                  <p className="text-sm font-semibold text-foreground">{t.skillGroups[group]}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {founder.skills[group].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-border bg-background px-3 py-1 text-xs text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="eyebrow mt-10">{s.awards}</h2>
            <ul className="mt-5 space-y-3">
              {founder.awards.map((a) => (
                <li key={a.title.en + a.year} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-foreground">
                    <span className="font-medium">{a.title[locale]}</span>
                    <span className="text-muted"> · {a.place}</span>
                  </span>
                  <span className="font-mono text-xs text-muted">{a.year}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow">{s.certifications}</h2>
            <ul className="mt-6 space-y-3">
              {founder.certifications.map((c) => (
                <li
                  key={c.name + c.issuer}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0"
                >
                  <span className="text-sm">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="text-muted"> — {c.issuer}</span>
                  </span>
                  <span className="font-mono text-xs text-muted">{c.year}</span>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-10">{s.connect}</h2>
            <FounderConnect className="mt-5" links={founder.links} />
          </div>
        </Container>
      </section>
    </>
  );
}
