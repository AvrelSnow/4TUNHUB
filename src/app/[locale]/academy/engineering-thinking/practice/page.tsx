import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PathSwitch } from "@/components/practice/PathSwitch";
import { ChallengeState, UnitState } from "@/components/practice/PracticeState";
import {
  BRACKET_ID,
  GROUPS,
  PRACTICE_ROOT,
  challengePath,
  summaries,
  warmupPath,
  warmupUnits,
} from "@/lib/practice/data";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = (await getDictionary(locale)).practice;
  const share = { title: `${t.metaTitle} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${PRACTICE_ROOT}` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${PRACTICE_ROOT}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

const CARD =
  "flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2 p-4 shadow-e1 transition-colors hover:bg-surface";

export default async function PracticePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.practice;
  const all = summaries(locale);

  const row = (id: string) => (
    <li key={id}>
      <Link href={localizeHref(locale, challengePath(id))} className={CARD}>
        <span className="min-w-0">
          <span className="block font-semibold text-foreground">
            {id.slice(0, 4).toUpperCase()} · {all[id].title}
          </span>
          <span className="readout">{fmt(t.steps, { n: all[id].steps.length })}</span>
        </span>
        <ChallengeState id={id} steps={all[id].steps} t={t.state} />
      </Link>
    </li>
  );

  return (
    <section className="pt-12 pb-24 sm:pt-16">
      <Container className="max-w-3xl">
        <PathSwitch locale={locale} here="practice" t={t.switch} />
        <h1 className="text-display-sm text-foreground">{t.title}</h1>
        <p className="mt-3 text-lead text-muted">{t.intro}</p>

        <div className="mt-8 rounded-3xl bg-ink-900 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-brand-500">{t.finalEyebrow}</p>
          <h2 className="mt-1 text-headline">{all[BRACKET_ID].title}</h2>
          <p className="mt-2 text-sm text-white/70">{t.finalBody}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={localizeHref(locale, challengePath(BRACKET_ID))}
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              {t.finalCta}
            </Link>
            <span className="rounded-full bg-white">
              <ChallengeState id={BRACKET_ID} steps={all[BRACKET_ID].steps} t={t.state} />
            </span>
          </div>
        </div>

        {(["calculator", "cad"] as const).map((group) => (
          <section key={group} className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{t.groups[group].title}</h2>
            <p className="mt-1 text-sm text-muted">{t.groups[group].body}</p>
            <ul className="mt-4 grid gap-3">{GROUPS[group].map(row)}</ul>
          </section>
        ))}

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t.warmup.title}</h2>
          <p className="mt-1 text-sm text-muted">{t.warmup.body}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {warmupUnits(locale).map((u) => (
              <li key={u.id}>
                <Link href={localizeHref(locale, warmupPath(u.id))} className={CARD}>
                  <span>
                    <span className="block font-semibold text-foreground">{u.title}</span>
                    <span className="readout">{t.warmup.questions}</span>
                  </span>
                  <UnitState id={u.id} t={t.state} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="readout mt-10">{t.honesty}</p>
      </Container>
    </section>
  );
}
