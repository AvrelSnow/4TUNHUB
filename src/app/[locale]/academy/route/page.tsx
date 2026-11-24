import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { RouteBoard, type BoardStage } from "@/components/RouteBoard";
import { ROUTE_PATH, foundationOrder, routeStages } from "@/lib/route";
import { FREE_RESOURCES_PATH } from "@/lib/free-resources";
import { lessonPath } from "@/lib/engineering-thinking";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = (await getDictionary(locale)).route;
  const share = { title: `${t.metaTitle} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${ROUTE_PATH}` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${ROUTE_PATH}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function RoutePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.route;

  // Internal addresses are localised here, on the server; external ones stay as they are.
  const stages: BoardStage[] = routeStages.map((s) => ({
    ...s,
    hrefs: Object.fromEntries(
      s.items
        .filter((i) => i.href)
        .map((i) => [i.id, i.external ? (i.href as string) : localizeHref(locale, i.href as string)]),
    ),
  }));
  const lessonHrefs = foundationOrder.map((l) => ({
    id: l.id,
    minutes: l.minutes,
    href: localizeHref(locale, lessonPath(l.id)),
  }));

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
        <p className="readout mt-6 text-center">{t.honesty}</p>
      </PageHero>

      <Section rhythm="compressed" className="pt-0 sm:pt-0 lg:pt-0">
        <RouteBoard stages={stages} firstLessonHref={lessonHrefs[0].href} lessonHrefs={lessonHrefs} t={t} />
        <p className="readout mt-10">{t.labels.lessonsEnglish}</p>
      </Section>

      <CtaPanel
        title={t.ctaTitle}
        subtitle={t.ctaSubtitle}
        primary={{ label: t.ctaPrimary, href: localizeHref(locale, "/academy") }}
        secondary={{ label: t.ctaSecondary, href: localizeHref(locale, FREE_RESOURCES_PATH) }}
      />
    </>
  );
}
