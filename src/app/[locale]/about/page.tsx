import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
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

  return (
    <>
      {/* Hero */}
      <Section pattern="grid" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.lead}</p>
        </Reveal>
      </Section>

      {/* Mission & Vision */}
      <section className="border-y border-border bg-surface">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
          <div id="mission">
            <p className="eyebrow">{t.missionEyebrow}</p>
            <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight text-foreground">
              {t.mission}
            </p>
          </div>
          <div id="vision">
            <p className="eyebrow">{t.visionEyebrow}</p>
            <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight text-foreground">
              {t.vision}
            </p>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <Section eyebrow={t.principlesEyebrow} title={t.principlesTitle}>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {t.principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-border bg-surface p-6">
                <span className="font-mono text-xs font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Founder teaser — org first, founder as proof */}
      <Container className="pb-24">
        <Reveal>
          <div className="grid items-center gap-8 rounded-2xl border border-border bg-surface p-8 sm:grid-cols-[auto_1fr] sm:p-10">
            <span className="plate block h-28 w-28 shrink-0 rounded-xl border border-border sm:h-32 sm:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={founder.portrait}
                alt={founder.name}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <p className="eyebrow">{t.founderEyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {t.founderTitle}
              </h2>
              <p className="mt-2 text-sm text-muted">{founder.name} · {founder.title[locale]}</p>
              <div className="mt-5">
                <Button as="a" href={localizeHref(locale, "/about/founder")} size="md">
                  {t.founderCta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
