import Link from "next/link";
import { Container } from "./ui/Container";
import { Reveal } from "./ui/Reveal";
import { Chevron } from "./ui/ArrowLink";
import { COHORT_PATH, applicationsOpen } from "@/lib/cohort";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

/**
 * Cohort 0, announced. A dark panel in both themes: the one block on a page
 * that asks for an action with a deadline, so it is allowed to be the
 * darkest thing there. Amber on #1d1d1f measures ~10:1. Renders nothing
 * once applications have closed at build time.
 */
export function CohortFeature({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  if (!applicationsOpen()) return null;
  const t = dict.home.cohort;
  const facts = dict.cohort.facts.slice(0, 3);
  const href = localizeHref(locale, COHORT_PATH);

  return (
    <section className="py-6 sm:py-10">
      <Container>
        <Reveal>
          <div className="grid gap-10 overflow-hidden rounded-3xl bg-ink-900 p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:p-16">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-500" />
                {t.eyebrow}
              </p>
              <h2 className="mt-4 text-display-sm text-white">{t.title}</h2>
              <p className="mt-5 max-w-xl text-lead text-white/70">{t.body}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href={`${href}#apply`}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-base font-medium tracking-tight text-ink-900 transition-colors hover:bg-brand-100"
                >
                  {t.cta}
                </Link>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-1 font-medium text-brand-400 hover:underline hover:underline-offset-4"
                >
                  {t.more}
                  <Chevron />
                </Link>
              </div>
            </div>
            <dl className="grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {facts.map((f) => (
                // A row on phones (label left, value right), a stacked fact above.
                <div key={f.label} className="flex items-baseline justify-between gap-4 sm:block">
                  <dt className="text-2xs font-medium text-white/60">{f.label}</dt>
                  <dd className="figure text-right text-lg font-semibold tracking-tight text-white sm:mt-1 sm:text-left sm:text-2xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
