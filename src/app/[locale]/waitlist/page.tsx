import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { WaitlistForm } from "@/components/WaitlistForm";
import { TRACK_VALUES } from "@/lib/waitlist";
import { COHORT_PATH, applicationsOpen } from "@/lib/cohort";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.waitlist,
    description: dict.waitlist.subtitle,
    alternates: { canonical: `/${locale}/waitlist` },
  };
}

export default async function WaitlistPage({ params, searchParams }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.waitlist;

  // `/waitlist?track=lab` arrives from a Lab post or a pillar page and
  // ticks that box. Anything unrecognised is simply ignored.
  const raw = (await searchParams).track;
  const asked = Array.isArray(raw) ? raw[0] : raw;
  const defaultTrack = TRACK_VALUES.find((k) => k === asked);

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.subtitle} />

      {/* Whatever someone came to wait for, one thing is open today. It
          would be perverse to take an address for December and say nothing
          about the seat they could take this week. */}
      {applicationsOpen() && (
        <section className="pb-14">
          <Container size="narrow">
            <Reveal>
              {/* Dark in both themes, so it carries its own colours the way
                  the cohort panel does — amber on #1d1d1f, not the accent. */}
              <div className="flex flex-col gap-5 rounded-3xl bg-ink-900 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="inline-flex items-center gap-2 text-2xs font-semibold text-brand-400">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {t.openNow.badge}
                  </p>
                  <p className="mt-2.5 text-lg font-semibold tracking-tight text-white">
                    {t.openNow.title}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{t.openNow.body}</p>
                </div>
                <Link
                  href={localizeHref(locale, COHORT_PATH)}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-medium tracking-tight text-ink-900 transition-colors hover:bg-brand-100"
                >
                  {t.openNow.cta}
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="pb-24 sm:pb-32">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-3xl bg-surface p-6 sm:p-10">
              <WaitlistForm
                t={t}
                privacyHref={localizeHref(locale, "/privacy")}
                defaultTrack={defaultTrack}
              />
            </div>
          </Reveal>

          <div className="mt-10 text-center">
            <ArrowLink href={localizeHref(locale, "/contact")}>{t.insteadCta}</ArrowLink>
          </div>
        </Container>
      </section>
    </>
  );
}
