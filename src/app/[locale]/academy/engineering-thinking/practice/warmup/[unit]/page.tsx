import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LessonRunner } from "@/components/LessonRunner";
import { PRACTICE_ROOT, warmupPath, warmupUnits } from "@/lib/practice/data";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import "../../../lesson.css";

/** The bracket's learn units from the Lab, in the guided path's own runner. */

type Params = { params: Promise<{ locale: string; unit: string }> };

export function generateStaticParams() {
  return warmupUnits("en").map((u) => ({ unit: u.id.replace("warmup-", "") }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, unit } = await params;
  if (!isLocale(locale)) return {};
  const found = warmupUnits(locale).find((u) => u.id === `warmup-${unit}`);
  if (!found) return {};
  const t = (await getDictionary(locale)).practice;
  return {
    title: `${found.title} · ${t.warmup.title}`,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${warmupPath(found.id)}` },
  };
}

export default async function WarmupPage({ params }: Params) {
  const { locale, unit } = await params;
  if (!isLocale(locale)) notFound();
  const units = warmupUnits(locale);
  const index = units.findIndex((u) => u.id === `warmup-${unit}`);
  if (index < 0) notFound();
  const found = units[index];
  const next = units[index + 1];
  const dict = await getDictionary(locale);
  const t = dict.practice;

  return (
    <article className="pt-10 sm:pt-14">
      <Container className="max-w-3xl">
        <Link href={localizeHref(locale, PRACTICE_ROOT)} className="readout transition-colors hover:text-accent">
          ← {t.back}
        </Link>
        <header className="mt-6 mb-8">
          <p className="eyebrow">{t.warmup.title}</p>
          <h1 className="mt-2 text-display-sm text-foreground">{found.title}</h1>
        </header>
        <LessonRunner
          id={found.id}
          steps={found.steps}
          minutes={found.minutes}
          cardLessons={units.map((u) => u.id)}
          index={index}
          nextHref={next ? localizeHref(locale, warmupPath(next.id)) : undefined}
          pathHref={localizeHref(locale, PRACTICE_ROOT)}
          lang={locale}
          t={{
            ...dict.path.lesson,
            back: t.warmup.title,
            done: t.warmup.done,
            cardDone: t.warmup.allDone,
            next: t.warmup.next,
            toPath: t.back,
            check: dict.path.check,
          }}
        />
      </Container>
    </article>
  );
}
