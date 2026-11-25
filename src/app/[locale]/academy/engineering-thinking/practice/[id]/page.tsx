import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ChallengeRunner } from "@/components/practice/ChallengeRunner";
import { PRACTICE_ROOT, challengeIds, challengePath, challengeView } from "@/lib/practice/data";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "../practice.css";

type Params = { params: Promise<{ locale: string; id: string }> };

export function generateStaticParams() {
  return challengeIds.map((id) => ({ id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale) || !challengeIds.includes(id)) return {};
  const t = (await getDictionary(locale)).practice;
  const title = `${challengeView(id, locale).title} · ${t.metaTitle}`;
  const share = { title: `${title} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${challengePath(id)}` },
    openGraph: { ...share, type: "article", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${challengePath(id)}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function ChallengePage({ params }: Params) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !challengeIds.includes(id)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.practice;
  const challenge = challengeView(id, locale);

  return (
    <article className="pt-10 pb-24 sm:pt-14">
      <Container className="max-w-3xl">
        <Link href={localizeHref(locale, PRACTICE_ROOT)} className="readout transition-colors hover:text-accent">
          ← {t.back}
        </Link>
        <p className="eyebrow mt-6">{id.slice(0, 1) === "p" ? id.slice(0, 4).toUpperCase() : t.finalEyebrow}</p>
        <h1 className="mt-2 text-display-sm text-foreground">{challenge.title}</h1>
        <ChallengeRunner challenge={challenge} lang={locale} t={{ ...t.run, check: dict.path.check }} />
      </Container>
    </article>
  );
}
