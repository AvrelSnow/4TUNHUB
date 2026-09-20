import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { ApplyForm } from "@/components/ApplyForm";
import { EmailCaptureBand } from "@/components/EmailCaptureBand";
import {
  COHORT_PATH,
  HUB_LINKEDIN_URL,
  SWUG_BEVY_URL,
  SWUG_LINKEDIN_URL,
  SWUG_NAME,
  applicationsOpen,
} from "@/lib/cohort";
import { founder } from "@/lib/founder";
import { CONTACT_EMAIL, WHATSAPP_COMMUNITY_URL, YOUTUBE_URL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.cohort.metaTitle,
    description: dict.cohort.metaDescription,
    alternates: { canonical: `/${locale}${COHORT_PATH}` },
    openGraph: { title: dict.cohort.metaTitle, description: dict.cohort.metaDescription },
  };
}

export default async function CohortPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.cohort;
  const open = applicationsOpen();

  /**
   * The conditions of a seat: the words come from the dictionary, the
   * URLs from src/lib/cohort.ts. A URL that has not been filled in yet
   * renders as no link at all rather than as a dead one.
   */
  const seatSteps = [
    { key: "bevy" as const, links: [{ label: t.requirements.links.bevy, href: SWUG_BEVY_URL }] },
    {
      key: "swugLinkedin" as const,
      links: [{ label: t.requirements.links.swugLinkedin, href: SWUG_LINKEDIN_URL }],
    },
    {
      key: "follow" as const,
      links: [
        { label: t.requirements.links.hubLinkedin, href: HUB_LINKEDIN_URL },
        { label: t.requirements.links.youtube, href: YOUTUBE_URL },
      ],
    },
    {
      key: "proof" as const,
      links: [
        {
          label: t.requirements.links.proof,
          href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[Cohort 0] Screenshots")}`,
        },
      ],
    },
  ];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: t.metaTitle,
    description: t.metaDescription,
    inLanguage: "en",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "4TUN Hub", url: "https://4tunhub.com" },
    contributor: { "@type": "Organization", name: SWUG_NAME },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      startDate: "2026-10-07",
      endDate: "2026-10-30",
      instructor: { "@type": "Person", name: founder.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      {/* HERO */}
      <section className="pt-10 pb-16 sm:pt-14 sm:pb-24">
        <Container>
          <Link
            href={localizeHref(locale, "/academy")}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="rotate-180">
              <Chevron />
            </span>
            {t.back}
          </Link>

          <div className="mx-auto mt-12 max-w-4xl text-center">
            <p className="eyebrow animate-fade-in">{t.eyebrow}</p>
            <h1 className="mt-3 animate-fade-up text-display-lg text-foreground">{t.title}</h1>
            <p className="mt-4 animate-fade-up text-sm font-medium text-accent [animation-delay:40ms]">
              {t.partner}
            </p>
            <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lead text-muted [animation-delay:80ms]">
              {t.subtitle}
            </p>
            <div className="mt-10 flex animate-fade-up flex-col items-center gap-4 [animation-delay:160ms]">
              {open ? (
                <>
                  <Button as="a" href="#apply" size="lg">
                    {t.apply}
                  </Button>
                  <p className="text-sm text-muted">{t.closesOn}</p>
                </>
              ) : (
                <>
                  <p className="max-w-lg text-foreground">{t.closed}</p>
                  <Button
                    as="a"
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    {t.closedCta}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* The facts, at a glance. */}
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-3">
            {t.facts.map((f) => (
              <div key={f.label} className="bg-surface p-6">
                <dt className="text-2xs font-medium text-muted">{f.label}</dt>
                <dd className="mt-1.5 font-semibold tracking-tight text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* OUTCOME */}
      <section className="bg-surface py-24 sm:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="eyebrow">{t.outcome.eyebrow}</p>
              <h2 className="mt-3 text-display-sm text-foreground">{t.outcome.title}</h2>
              <p className="mt-6 text-lead text-muted">{t.outcome.body}</p>
            </Reveal>
            <Reveal delay={80}>
              <Media
                src="/images/projects/beans-7.webp"
                alt={dict.projects.galleries["beans-unwrapping-machine"]?.[6] ?? ""}
                doc
                className="aspect-[4/3] rounded-3xl"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* SYLLABUS */}
      <Section eyebrow={t.syllabus.eyebrow} title={t.syllabus.title}>
        <ol className="mt-10 divide-y divide-border border-y border-border">
          {t.syllabus.weeks.map((w) => (
            <li key={w.label} className="grid gap-4 py-8 lg:grid-cols-[10rem_1fr_1fr_1fr] lg:gap-8">
              <div>
                <p className="font-semibold text-foreground">{w.label}</p>
                <p className="figure mt-0.5 text-sm text-muted">{w.dates}</p>
              </div>
              <div>
                <p className="text-2xs font-medium text-muted">{t.syllabus.wednesday}</p>
                <p className="mt-1 text-foreground">{w.wed}</p>
              </div>
              <div>
                <p className="text-2xs font-medium text-muted">{t.syllabus.friday}</p>
                <p className="mt-1 text-foreground">{w.fri}</p>
              </div>
              <div>
                <p className="text-2xs font-medium text-muted">{t.syllabus.exercise}</p>
                <p className="mt-1 text-foreground">{w.ex}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* THE DEAL */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <div className="rounded-3xl bg-ink-900 p-8 text-white sm:p-12 lg:p-16">
              <p className="text-sm font-semibold text-brand-400">{t.deal.eyebrow}</p>
              <h2 className="mt-3 text-display-sm text-white">{t.deal.title}</h2>
              <p className="mt-5 max-w-2xl text-lead text-white/70">{t.deal.intro}</p>
              <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-3">
                {t.deal.items.map((item) => (
                  <li key={item.title} className="border-t border-white/25 pt-6">
                    <h3 className="text-headline text-white">{item.title}</h3>
                    <p className="mt-2 text-white/70">{item.desc}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-12 text-sm text-white/60">{t.deal.note}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* HOW TO GET A SEAT — the conditions, before the form asks for
          anything. Someone who reads this page and applies without joining
          the group has wasted their evening and ours. */}
      <Section
        eyebrow={t.requirements.eyebrow}
        title={t.requirements.title}
        intro={t.requirements.intro}
      >
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {seatSteps.map((step, i) => {
            const copy = t.requirements.steps[step.key];
            return (
              <li key={step.key}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col rounded-3xl bg-surface p-8">
                    <p className="figure text-sm font-semibold text-muted">{`0${i + 1}`}</p>
                    <h3 className="mt-3 text-headline text-foreground">{copy.title}</h3>
                    <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                    <div className="mt-6 flex flex-col items-start gap-2">
                      {step.links
                        .filter((l) => l.href)
                        .map((l) => (
                          <ArrowLink key={l.label} href={l.href} external className="text-sm">
                            {l.label}
                          </ArrowLink>
                        ))}
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* BEFORE YOU APPLY + KEY DATES */}
      <Section tone="surface" eyebrow={t.before.eyebrow} title={t.before.title}>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {t.before.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="h-full rounded-3xl bg-surface-2 p-8">
                <h3 className="text-headline text-foreground">{item.title}</h3>
                <p className="mt-3 text-muted">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="mt-20 text-sm font-semibold text-foreground">{t.timeline.eyebrow}</h3>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
          {t.timeline.items.map((item) => (
            <li key={item.date} className="bg-surface-2 p-6">
              <p className="figure text-lg font-semibold tracking-tight text-foreground">{item.date}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* APPLY */}
      <section id="apply" className="scroll-mt-20 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <h2 className="text-display-sm text-foreground">{t.form.heading}</h2>
              <p className="mt-5 text-lead text-muted">{t.form.intro}</p>

              <div className="mt-12 flex items-center gap-5 border-t border-border pt-8">
                <Media
                  src="/images/founder-portrait.webp"
                  alt={founder.name}
                  responsive
                  sizes="80px"
                  position="50% 18%"
                  className="h-20 w-20 shrink-0 rounded-full"
                />
                <div>
                  <p className="text-2xs font-medium text-muted">{t.instructor.eyebrow}</p>
                  <p className="font-semibold text-foreground">{t.instructor.title}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted">{t.instructor.body}</p>
              <ArrowLink href={localizeHref(locale, "/about/founder")} className="mt-4 text-sm">
                {t.instructor.cta}
              </ArrowLink>
            </div>

            <div className="rounded-3xl bg-surface p-6 sm:p-10">
              {open ? (
                <ApplyForm t={t} privacyHref={localizeHref(locale, "/privacy")} />
              ) : (
                <p className="py-10 text-center text-foreground">{t.closed}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Twenty seats, and more applicants than that if the launch works.
          The ones who miss out are the warmest audience Cohort 1 will
          ever have — they don't leave this page without being asked. */}
      <EmailCaptureBand
        t={dict.waitlist}
        band="cohort"
        track="academy"
        privacyHref={localizeHref(locale, "/privacy")}
        moreHref={localizeHref(locale, "/waitlist")}
        className="border-t border-border"
      />
    </>
  );
}
