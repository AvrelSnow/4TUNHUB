import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { founder } from "@/lib/founder";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.about,
    description: dict.about.lead,
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.about;
  const c = dict.home.conversion;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.lead} />

      {/* Mission and vision. The label sits in its own rail so the sentence
          itself gets the full width of the page: three lines across, not
          seven down a narrow column — and the longer French keeps the shape. */}
      <section className="bg-surface py-20 sm:py-28">
        <Container size="wide" className="divide-y divide-border">
          {[
            { id: "mission", label: t.missionEyebrow, body: t.mission },
            { id: "vision", label: t.visionEyebrow, body: t.vision },
          ].map((item) => (
            <Reveal key={item.id}>
              <div
                id={item.id}
                className="grid gap-3 py-10 lg:grid-cols-[8rem_1fr] lg:gap-12 lg:py-14"
              >
                <p className="eyebrow lg:pt-4">{item.label}</p>
                <p className="text-4xl leading-[1.14] font-bold tracking-tight text-foreground sm:text-5xl">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Principles */}
      <Section eyebrow={t.principlesEyebrow} title={t.principlesTitle}>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-3">
          {t.principles.map((p) => (
            <div key={p.title} className="border-t border-foreground pt-6">
              <h3 className="text-headline text-foreground">{p.title}</h3>
              <p className="mt-3 text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The founder: the organisation's proof, second. */}
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <Reveal>
          <div className="grid items-center overflow-hidden rounded-3xl bg-surface lg:grid-cols-2">
            <Media
              src={founder.portrait}
              alt={founder.name}
              responsive
              sizes="(min-width: 1024px) 50vw, 100vw"
              position="50% 20%"
              className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[30rem]"
            />
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="eyebrow">{t.founderEyebrow}</p>
              <h2 className="mt-3 text-display-sm text-foreground">{t.founderTitle}</h2>
              <p className="mt-4 text-lead text-muted">
                {founder.name} · {founder.title[locale]}
              </p>
              <ArrowLink href={localizeHref(locale, "/about/founder")} className="mt-7">
                {t.founderCta}
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaPanel
        title={c.title}
        subtitle={c.subtitle}
        primary={{ label: c.primaryCta, href: localizeHref(locale, "/contact") }}
        secondary={{ label: c.secondaryCta, href: localizeHref(locale, "/services") }}
      />
    </>
  );
}
