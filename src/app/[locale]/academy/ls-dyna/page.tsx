import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { EmailCaptureBand } from "@/components/EmailCaptureBand";
import { LIBRARY_PATH, episodePath, episodes, filesFor, series } from "@/lib/lsdyna";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL, YOUTUBE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.library;
  const share = { title: `${t.metaTitle} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${LIBRARY_PATH}` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${LIBRARY_PATH}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function LibraryPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.library;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.intro}
        actions={
          <>
            <Button as="a" href={localizeHref(locale, episodePath(episodes[0].slug))} size="lg">
              {t.startHere}
            </Button>
            <ArrowLink href={YOUTUBE_URL}>{t.subscribe}</ArrowLink>
          </>
        }
      >
        {t.languageNote && <p className="readout mt-6 text-center">{t.languageNote}</p>}
      </PageHero>

      {series.map((s, si) => {
        const copy = t.series[s.key];
        const list = episodes.filter((e) => e.series === s.key);
        if (!copy || list.length === 0) return null;
        return (
          <Section
            key={s.key}
            tone={si % 2 === 0 ? "surface" : "default"}
            rhythm="compressed"
            eyebrow={`${si + 1} / ${series.length}`}
            title={copy.title}
            intro={copy.body}
          >
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e, i) => (
                <Reveal key={e.slug} delay={(i % 3) * 60}>
                  <li className="h-full">
                    <Link
                      href={localizeHref(locale, episodePath(e.slug))}
                      className="group flex h-full flex-col rounded-3xl bg-surface-2 p-6 shadow-e1 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="readout">
                          {e.number ? `${t.episode} ${e.number}` : copy.title}
                          {e.length && ` · ${e.length}`}
                        </span>
                        {filesFor(e).length > 0 && <Badge variant="amber">{t.withFiles}</Badge>}
                      </div>
                      <h3 className="mt-4 text-lg leading-snug font-semibold tracking-tight text-foreground group-hover:text-accent">
                        {e.title}
                      </h3>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Section>
        );
      })}

      <EmailCaptureBand
        t={dict.waitlist}
        band="lsdyna"
        track="lsdyna"
        privacyHref={localizeHref(locale, "/privacy")}
        moreHref={localizeHref(locale, "/waitlist")}
      />
    </>
  );
}
