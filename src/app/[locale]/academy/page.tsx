import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { CohortFeature } from "@/components/CohortFeature";
import { SessionCard } from "@/components/SessionCard";
import { EmailCaptureBand } from "@/components/EmailCaptureBand";
import { talks, TALKS_ARCHIVE_URL } from "@/lib/talks";
import { LIBRARY_PATH } from "@/lib/lsdyna";
import { FREE_RESOURCES_PATH } from "@/lib/free-resources";
import { PATH_ROOT } from "@/lib/engineering-thinking";
import { SHELF_PATH } from "@/lib/shelf";
import { COHORT_PATH, applicationsOpen } from "@/lib/cohort";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const startCards = [
  { key: "path", href: PATH_ROOT, image: "/images/previews/engineering-thinking.webp" },
  { key: "library", href: LIBRARY_PATH, image: "/images/previews/youtube-library.webp" },
  { key: "free", href: FREE_RESOURCES_PATH, image: "/images/previews/free-places.webp" },
] as const;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // A page-level openGraph replaces the layout's rather than merging, so it
  // carries everything a share needs: without it the Academy was shared
  // under the home page's title and address.
  // The title template does not reach openGraph, so the share title carries
  // the name itself.
  const share = { title: `${dict.routes.academy} · ${SITE_NAME}`, description: dict.academy.subtitle };
  return {
    title: dict.routes.academy,
    description: dict.academy.subtitle,
    alternates: { canonical: `/${locale}/academy` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}/academy`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function AcademyPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.academy;
  return (
    <div>
      {/* 1 · HERO */}
      <PageHero
        lit
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            {/* While Cohort 0 is recruiting, the hero sends people there. */}
            {applicationsOpen() ? (
              <Button as="a" href={localizeHref(locale, COHORT_PATH)} size="lg">
                {dict.home.cohort.cta}
              </Button>
            ) : (
              <Button as="a" href={localizeHref(locale, "/waitlist?track=academy")} size="lg">
                {t.primaryCta}
              </Button>
            )}
            <ArrowLink href="#start">{t.secondaryCta}</ArrowLink>
          </>
        }
      >
      </PageHero>

      <CohortFeature locale={locale} dict={dict} />

      {/* START HERE — three ways in, by what the visitor wants to do, each
          with a real preview: our own page, a thumbnail from the channel,
          covers of the resources on the list. Images are ours (the CSP
          allows none from elsewhere, and a third-party image would tell
          that third party who is reading). */}
      <Section
        id="start"
        rhythm="compressed"
        className="pt-0 sm:pt-0 lg:pt-0"
        eyebrow={t.start.eyebrow}
        title={t.start.title}
        intro={t.start.intro}
      >
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {startCards.map(({ key, href, image }, i) => {
            const copy = t.start.items[key];
            return (
              <Reveal key={key} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-surface">
                  <Media src={image} alt={copy.alt} className="aspect-video w-full" />
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <p className="eyebrow">{copy.goal}</p>
                    <h3 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground">
                      {copy.title}
                    </h3>
                    <p className="mt-3 text-muted">{copy.body}</p>
                    <div className="mt-auto pt-7">
                      <Button as="a" href={localizeHref(locale, href)}>
                        {copy.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* The shelf sits under the three ways in: one wide card. */}
        <Reveal>
          <div className="mt-5 flex flex-col gap-6 rounded-3xl bg-surface p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{t.shelf.eyebrow}</p>
              <h3 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground">
                {t.shelf.title}
              </h3>
              <p className="mt-3 text-muted">{t.shelf.body}</p>
            </div>
            <div className="shrink-0">
              <Button as="a" href={localizeHref(locale, SHELF_PATH)}>
                {t.shelf.cta}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 2b · HOSTED IN PUBLIC — each session as a card with its picture,
          its speaker and a pop-up player: the recording plays here, not on
          YouTube. Only sessions with a recording appear here.
          Dates, speakers and chapters are in talks.ts, taken from the event
          pages and the recordings' own descriptions. */}
      <Section eyebrow={t.sessions.eyebrow} title={t.sessions.title} intro={t.sessions.intro}>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {talks
            .filter((talk) => talk.lesson && talk.recording)
            .map((talk, i) => (
              <li key={talk.href}>
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <SessionCard
                    talk={talk}
                    roleLabel={dict.session.roles[talk.role]}
                    labels={dict.session}
                    playerLabels={dict.library}
                  />
                </Reveal>
              </li>
            ))}
        </ul>
        <div className="mt-9">
          <ArrowLink href={TALKS_ARCHIVE_URL} external>
            {t.sessions.archive}
          </ArrowLink>
        </div>
      </Section>

      {/* 5 · THE LIST — most people who read this page are not ready to
          buy a seat today. An address is what keeps them. */}
      <EmailCaptureBand
        t={dict.waitlist}
        band="academy"
        track="academy"
        privacyHref={localizeHref(locale, "/privacy")}
        moreHref={localizeHref(locale, "/waitlist")}
      />

      {/* 6 · ENROLMENT — with the list right above it, a second "join the
          waitlist" button would be asking twice for the same thing. While
          Cohort 0 is open the page closes on the seat instead. */}
      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={
          applicationsOpen()
            ? { label: dict.home.cohort.cta, href: localizeHref(locale, COHORT_PATH) }
            : { label: t.cta.primary, href: localizeHref(locale, "/waitlist?track=academy") }
        }
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
      />
    </div>
  );
}
