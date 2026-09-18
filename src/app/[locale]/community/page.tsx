import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { communityChannels } from "@/lib/community";
import { WHATSAPP_COMMUNITY_URL, LINKEDIN_URL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.community,
    description: dict.community.subtitle,
    alternates: { canonical: `/${locale}/community` },
  };
}

export default async function CommunityPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.community;

  return (
    <>
      {/* 1 · HERO */}
      <Section field="network" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <Badge variant="amber" className="w-fit">
            {t.live}
          </Badge>
          <h1 className="mt-5 max-w-3xl text-display text-foreground">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              as="a"
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              {t.primaryCta}
            </Button>
            <Button
              as="a"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · CHANNELS */}
      <Section
        eyebrow={t.channelsEyebrow}
        title={t.channelsTitle}
        intro={t.channelsIntro}
        className="pt-0"
      >
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {communityChannels.map((channel, i) => {
            const copy = t.channels[channel.key];
            if (!copy) return null;
            return (
              <Reveal key={channel.key} delay={i * 70}>
                <Card
                  interactive
                  className={`flex h-full flex-col ${
                    channel.live ? "border-brand-500/40 bg-brand-500/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
                    {channel.live && <Badge variant="amber">{t.live}</Badge>}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep mt-5 inline-block text-sm font-medium text-accent"
                  >
                    {copy.action} →
                  </a>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3 · WHO'S HERE */}
      <section className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="eyebrow">{t.whoEyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">
            {t.whoTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t.whoBody}</p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-3">
            {t.whoStats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-display-sm text-accent">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 4 · ETHOS */}
      <Section eyebrow={t.ethosEyebrow} title={t.ethosTitle}>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {t.ethos.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="ticks relative h-full rounded-2xl border border-border bg-surface p-6">
                <span className="font-mono text-xs font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5 · CTA */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: WHATSAPP_COMMUNITY_URL, external: true }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/contact") }}
      />
    </>
  );
}
