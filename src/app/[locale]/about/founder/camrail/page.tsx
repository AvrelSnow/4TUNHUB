import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Chevron } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
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
      {/* HERO */}
      <section className="pt-10 pb-20 sm:pt-14 sm:pb-28">
        <Container>
          <Link
            href={localizeHref(locale, "/about/founder")}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="rotate-180">
              <Chevron />
            </span>
            {founder.name}
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{t.eyebrow[locale]}</p>
              <h1 className="mt-3 animate-fade-up text-display text-foreground">{t.title[locale]}</h1>
              <p className="mt-7 max-w-xl text-lead text-muted">{t.intro[locale]}</p>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
                {t.stats.map((st) => (
                  <div key={st.value}>
                    <dt className="sr-only">{st.label[locale]}</dt>
                    <dd>
                      <span className="figure block text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {st.value}
                      </span>
                      <span className="mt-1.5 block text-sm leading-5 text-muted">{st.label[locale]}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure>
              <Zoomable
                src={t.portrait}
                alt={founder.name}
                label={t.portraitCaption[locale]}
                closeLabel={dict.projects.detail.close}
                position="50% 30%"
                className="aspect-[4/5] rounded-3xl"
              />
              <figcaption className="readout mt-3 text-center">{t.portraitCaption[locale]}</figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* OVERVIEW */}
      <section className="bg-surface py-24 sm:py-32">
        <Container size="narrow">
          <Reveal>
            <p className="eyebrow">{t.overviewEyebrow[locale]}</p>
            <h2 className="mt-3 text-display-sm text-foreground">{t.overviewTitle[locale]}</h2>
            <div className="mt-8 space-y-6">
              {t.overview.map((p, i) => (
                <p key={i} className="text-lead text-muted">
                  {p[locale]}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CASE STUDIES */}
      <Section eyebrow={t.caseStudiesEyebrow[locale]} title={t.caseStudiesTitle[locale]}>
        <div className="mt-12 space-y-20">
          {t.cases.map((c) => (
            <Reveal key={c.n}>
              <article>
                <p className="figure text-sm font-medium text-muted">{c.n}</p>
                <h3 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-foreground">
                  {c.title[locale]}
                </h3>
                <div className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-3">
                  {c.blocks.map((b) => (
                    <div key={b.label.en} className="border-t border-foreground pt-5">
                      <p className="text-sm font-semibold text-foreground">{b.label[locale]}</p>
                      <p className="mt-2 text-muted">{b.body[locale]}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* GALLERY */}
      <Section
        eyebrow={t.galleryEyebrow[locale]}
        title={t.galleryTitle[locale]}
        className="border-t border-border"
      >
        <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {t.gallery.map((g, i) => (
            <Reveal key={g.img} delay={(i % 3) * 60}>
              <figure>
                <Zoomable
                  src={g.img}
                  alt={g.caption[locale]}
                  label={dict.projects.detail.zoom}
                  closeLabel={dict.projects.detail.close}
                  className="aspect-[4/3] rounded-3xl"
                />
                <figcaption className="mt-3 text-sm leading-6 text-muted">{g.caption[locale]}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaPanel
        title={t.ctaTitle[locale]}
        subtitle={t.ctaBody[locale]}
        primary={{ label: dict.founderPage.contactCta, href: localizeHref(locale, "/contact") }}
        secondary={{ label: dict.projects.detail.back, href: localizeHref(locale, "/projects") }}
      />
    </>
  );
}
