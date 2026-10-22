import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LessonRunner } from "@/components/LessonRunner";
import { PATH_ROOT, findLesson, lessonIds, lessonPath } from "@/lib/engineering-thinking";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "../lesson.css";

type Params = { params: Promise<{ locale: string; lesson: string }> };

export function generateStaticParams() {
  return lessonIds.map((lesson) => ({ lesson }));
}

// Every lesson is known at build time; anything else is a 404.
export const dynamicParams = false;

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, lesson: id } = await params;
  const found = findLesson(id);
  if (!isLocale(locale) || !found) return {};
  const dict = await getDictionary(locale);
  const title = `${found.lesson.title} · ${dict.path.title}`;
  const share = { title: `${title} · ${SITE_NAME}`, description: dict.path.metaDescription };
  return {
    title,
    description: dict.path.metaDescription,
    alternates: { canonical: `/${locale}${lessonPath(id)}` },
    openGraph: { ...share, type: "article", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${lessonPath(id)}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function LessonPage({ params }: Params) {
  const { locale, lesson: id } = await params;
  if (!isLocale(locale)) notFound();
  const found = findLesson(id);
  if (!found) notFound();
  const dict = await getDictionary(locale);
  const t = dict.path;
  const { lesson, card, index, next } = found;
  const nextInCard = card.lessons[index + 1]?.id;

  return (
    <article className="pt-10 sm:pt-14">
      <Container className="max-w-3xl">
        <Link href={localizeHref(locale, PATH_ROOT)} className="readout transition-colors hover:text-accent">
          ← {t.lesson.back}
        </Link>

        <header className="mt-6 mb-8 flex items-start gap-4">
          <span
            aria-hidden="true"
            className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-surface text-lg font-extrabold tracking-tight text-foreground"
          >
            {card.number}.{index + 1}
          </span>
          <div className="min-w-0">
            <p className="eyebrow">
              {fmt(t.lesson.head, { c: card.number ?? "", i: index + 1, t: card.lessons.length, m: lesson.minutes })}
            </p>
            <h1 className="mt-2 text-display-sm text-foreground">{lesson.title}</h1>
            {t.languageNote && <p className="readout mt-2">{t.languageNote}</p>}
          </div>
        </header>

        <LessonRunner
          id={id}
          steps={lesson.steps}
          minutes={lesson.minutes}
          cardLessons={card.lessons.map((l) => l.id)}
          index={index}
          // Inside a card the next lesson; at its end, the next card's first.
          nextHref={nextInCard || next ? localizeHref(locale, lessonPath((nextInCard ?? next)!)) : undefined}
          pathHref={localizeHref(locale, PATH_ROOT)}
          lang={locale}
          t={{ ...t.lesson, check: t.check }}
        />
      </Container>
    </article>
  );
}
