import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { COHORT_PATH, SWUG_BEVY_URL, SWUG_LINKEDIN_URL, applicationsOpen } from "@/lib/cohort";
import { CONTACT_EMAIL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.cohort.screenshots.title,
    description: dict.cohort.screenshots.intro,
    // A step inside an application, useful to one person at one moment.
    // It has no business competing with the cohort page in search.
    robots: { index: false, follow: true },
  };
}

/**
 * "Send the screenshots", as a page rather than a mailto.
 *
 * It used to be a bare `mailto:` on the confirmation screen and in step
 * four. That fails the people it most needs to reach: a phone with no
 * mail client configured opens nothing at all, and even when it works the
 * applicant is staring at an empty message with no idea what counts as
 * proof. A page can show them — what the two screenshots must contain,
 * where to get them, what to write, and what happens if they never send.
 *
 * It is also a link that can be pasted into WhatsApp, which is where most
 * of this conversation actually happens.
 */
export default async function ScreenshotsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.cohort.screenshots;

  const subject = `[Cohort 0] ${t.mailSubject}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    t.mailBody,
  )}`;

  const shots = [
    { key: "bevy" as const, href: SWUG_BEVY_URL },
    { key: "linkedin" as const, href: SWUG_LINKEDIN_URL },
  ];

  return (
    <section className="pt-10 pb-24 sm:pt-14 sm:pb-32">
      <Container size="narrow">
        <Link
          href={localizeHref(locale, COHORT_PATH)}
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <span className="rotate-180">
            <Chevron />
          </span>
          {t.back}
        </Link>

        <p className="eyebrow mt-12">{t.eyebrow}</p>
        <h1 className="mt-3 text-display text-foreground">{t.title}</h1>
        <p className="mt-6 text-lead text-muted">{t.intro}</p>

        {/* The two things, each with the place to go and get it. */}
        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {shots.map((shot, i) => {
            const copy = t.shots[shot.key];
            return (
              <li key={shot.key}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col rounded-3xl bg-surface p-8">
                    <p className="figure text-sm font-semibold text-muted">{`0${i + 1}`}</p>
                    <h2 className="mt-3 text-headline text-foreground">{copy.title}</h2>
                    <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                    {shot.href && (
                      <ArrowLink href={shot.href} external className="mt-6 text-sm">
                        {copy.cta}
                      </ArrowLink>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* Where they go. One address, pre-addressed, with the subject set. */}
        <div className="mt-12 rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
          <h2 className="text-display-sm text-white">{t.send.title}</h2>
          <p className="mt-4 max-w-xl text-white/70">{t.send.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button as="a" href={mailto} size="lg" variant="raised">
              {t.send.cta}
            </Button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm font-medium text-brand-400 hover:underline hover:underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {t.notes.map((note) => (
            <div key={note.title} className="grid gap-3 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
              <h3 className="font-semibold text-foreground">{note.title}</h3>
              <p className="text-muted">{note.body}</p>
            </div>
          ))}
        </div>

        {applicationsOpen() && (
          <div className="mt-12 text-center">
            <ArrowLink href={localizeHref(locale, COHORT_PATH)}>{t.notApplied}</ArrowLink>
          </div>
        )}
      </Container>
    </section>
  );
}
