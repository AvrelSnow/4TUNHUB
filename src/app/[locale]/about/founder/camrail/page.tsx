import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Zoomable } from "@/components/Zoomable";
import { camrail } from "@/lib/camrail";
import { founder } from "@/lib/founder";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: camrail.title[locale],
    description: camrail.intro[locale],
    alternates: { canonical: `/${locale}/about/founder/camrail` },
    openGraph: { title: camrail.title[locale], description: camrail.intro[locale], type: "article" },
  };
}

export default async function CamrailPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = camrail;

  return (
    <>
      {/* Hero */}
      <Section field="kinematic" className="pb-14 pt-14 sm:pt-16">
        <Link
          href={localizeHref(locale, "/about/founder")}
          className="link-sweep text-sm font-medium text-accent"
        >
          ← {founder.name}
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow">{t.eyebrow[locale]}</p>
            <h1 className="mt-5 text-display text-foreground">
              {t.title[locale]}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t.intro[locale]}</p>
            <dl className="mt-8 grid grid-cols-3 gap-5">
              {t.stats.map((st) => (
                <div key={st.value}>
                  <dt className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                    {st.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-muted">{st.label[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure>
            <Zoomable
              src={t.portrait}
              alt={founder.name}
              label={dict.founderPage.sections.experience}
              closeLabel={dict.projects.detail.close}
              className="aspect-[3/4] w-full max-w-sm rounded-2xl border border-border bg-ink-950 sm:mx-auto"
            />
            <figcaption className="mt-2 font-mono text-3xs uppercase tracking-widest text-muted">
              {t.portraitCaption[locale]}
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* Overview */}
      <section className="border-y border-border bg-surface">
        <Container className="py-16">
          <p className="eyebrow">{t.overviewEyebrow[locale]}</p>
          <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">
            {t.overviewTitle[locale]}
          </h2>
          <div className="mt-6 grid max-w-4xl gap-5 lg:grid-cols-2">
            {t.overview.map((p, i) => (
              <p key={i} className="text-base leading-7 text-muted">
                {p[locale]}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* Case studies */}
      <Section eyebrow={t.caseStudiesEyebrow[locale]} title={t.caseStudiesTitle[locale]}>
        <div className="mt-10 space-y-14">
          {t.cases.map((c) => (
            <article key={c.n} className="border-t border-border pt-8">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-2xl font-bold text-brand-500">{c.n}</span>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {c.title[locale]}
                </h3>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-3">
                {c.blocks.map((b) => (
                  <div key={b.label.en}>
                    <p className="font-mono text-3xs uppercase tracking-wider text-accent">
                      {b.label[locale]}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{b.body[locale]}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Gallery */}
      <section className="border-t border-border bg-surface/50">
        <Container className="py-16">
          <p className="eyebrow">{t.galleryEyebrow[locale]}</p>
          <h2 className="mt-5 text-display-sm text-foreground">
            {t.galleryTitle[locale]}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.gallery.map((g, i) => (
              <Reveal key={g.img} delay={i * 50}>
                <figure className="overflow-hidden rounded-2xl border border-border bg-ink-950">
                  <Zoomable
                    src={g.img}
                    alt={g.caption[locale]}
                    label={dict.projects.detail.zoom}
                    closeLabel={dict.projects.detail.close}
                    className="aspect-[4/3] w-full"
                  />
                  <figcaption className="border-t border-border bg-background px-4 py-3 text-sm text-muted">
                    {g.caption[locale]}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <Container className="py-16">
        <div className="ticks relative rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t.ctaTitle[locale]}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">{t.ctaBody[locale]}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {dict.founderPage.contactCta}
            </Button>
            <Button as="a" href={localizeHref(locale, "/projects")} size="lg" variant="secondary">
              {dict.projects.detail.back}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
