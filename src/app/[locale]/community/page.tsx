import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { communityChannels } from "@/lib/community";
import { WHATSAPP_COMMUNITY_URL, LINKEDIN_URL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

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
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            <Button
              as="a"
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              {t.primaryCta}
            </Button>
            <ArrowLink href={LINKEDIN_URL} external>
              {t.secondaryCta}
            </ArrowLink>
          </>
        }
      />

      {/* 2 · WHO'S HERE, in numbers. */}
      <section className="border-y border-border py-16 sm:py-20">
        <Container>
          <dl className="grid gap-12 text-center sm:grid-cols-3 sm:divide-x sm:divide-border">
            {t.whoStats.map((stat) => (
              <div key={stat.label} className="px-4">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="figure block text-display-sm text-foreground">{stat.value}</span>
                  <span className="mx-auto mt-3 block max-w-52 text-sm leading-6 text-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 3 · CHANNELS — the live one first and largest. */}
      <Section eyebrow={t.channelsEyebrow} title={t.channelsTitle} intro={t.channelsIntro}>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {communityChannels.map((channel, i) => {
            const copy = t.channels[channel.key];
            if (!copy) return null;
            return (
              <Reveal key={channel.key} delay={i * 80}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex h-full flex-col rounded-3xl p-8 transition-[transform,box-shadow] duration-500 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1 hover:shadow-e2 sm:p-10",
                    // The live channel is a dark tile in both themes, so its amber
                    // action keeps ~10:1 whatever the page behind it is doing.
                    channel.live ? "bg-ink-900 text-white" : "bg-surface",
                  )}
                >
                  {channel.live && (
                    <span className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-2xs font-medium text-brand-300">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      {t.live}
                    </span>
                  )}
                  <h3
                    className={cn(
                      "text-headline",
                      channel.live ? "text-white" : "text-foreground",
                    )}
                  >
                    {copy.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 flex-1",
                      channel.live ? "text-white/70" : "text-muted",
                    )}
                  >
                    {copy.desc}
                  </p>
                  <span
                    className={cn(
                      "mt-8 inline-flex items-center gap-1 font-medium",
                      channel.live ? "text-brand-400" : "text-accent",
                    )}
                  >
                    {copy.action}
                    <Chevron external />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 4 · WHO IT'S FOR */}
      <section className="bg-surface py-24 sm:py-32">
        <Container size="narrow">
          <Reveal className="text-center">
            <p className="eyebrow">{t.whoEyebrow}</p>
            <h2 className="mt-3 text-display-sm text-foreground">{t.whoTitle}</h2>
            <p className="mt-6 text-lead text-muted">{t.whoBody}</p>
          </Reveal>
        </Container>
      </section>

      {/* 5 · ETHOS */}
      <Section eyebrow={t.ethosEyebrow} title={t.ethosTitle}>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-3">
          {t.ethos.map((item) => (
            <div key={item.title} className="border-t border-foreground pt-6">
              <h3 className="text-headline text-foreground">{item.title}</h3>
              <p className="mt-3 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6 · CTA */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: WHATSAPP_COMMUNITY_URL, external: true }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/contact") }}
      />
    </>
  );
}
