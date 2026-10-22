import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LibraryFiles } from "@/components/LibraryFiles";
import { LIBRARY_PATH, episodePath, episodes, filesFor, findEpisode, neighbours } from "@/lib/lsdyna";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string; episode: string }> };

export function generateStaticParams() {
  return episodes.map((e) => ({ episode: e.slug }));
}

// Every episode is known at build time; anything else is a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, episode: slug } = await params;
  const episode = findEpisode(slug);
  if (!isLocale(locale) || !episode) return {};
  const dict = await getDictionary(locale);
  const description = episode.summary ?? dict.library.metaDescription;
  const share = { title: `${episode.title} · ${SITE_NAME}`, description };
  const url = `${SITE_URL}/${locale}${episodePath(slug)}`;
  return {
    title: episode.title,
    description,
    alternates: { canonical: `/${locale}${episodePath(slug)}` },
    openGraph: { ...share, type: "video.episode", siteName: SITE_NAME, url, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function EpisodePage({ params }: Params) {
  const { locale, episode: slug } = await params;
  if (!isLocale(locale)) notFound();
  const episode = findEpisode(slug);
  if (!episode) notFound();
  const dict = await getDictionary(locale);
  const t = dict.library;
  const seriesTitle = t.series[episode.series]?.title ?? "";
  const { prev, next } = neighbours(episode);

  return (
    <article className="pt-12 pb-20 sm:pt-16 sm:pb-28">
      <Container>
        <Link
          href={localizeHref(locale, LIBRARY_PATH)}
          className="readout transition-colors hover:text-accent"
        >
          ← {t.back}
        </Link>

        <header className="mt-6 max-w-4xl">
          <p className="eyebrow">
            {episode.number ? `${t.episode} ${episode.number} · ` : ""}
            {seriesTitle}
            {episode.length && ` · ${episode.length}`}
          </p>
          <h1 className="mt-3 text-display-sm text-foreground">{episode.title}</h1>
          {t.languageNote && <p className="readout mt-3">{t.languageNote}</p>}
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            <VideoPlayer
              videoId={episode.videoId}
              title={episode.title}
              chapters={episode.chapters}
              t={t}
            />
          </div>

          <aside className="min-w-0 space-y-10">
            {episode.summary && <p className="text-lead text-muted">{episode.summary}</p>}

            <LibraryFiles
              files={filesFor(episode)}
              t={t.files}
              waitlist={dict.waitlist}
              privacyHref={localizeHref(locale, "/privacy")}
            />

            {episode.learn && (
              <div>
                <h2 className="text-headline text-foreground">{t.learnTitle}</h2>
                <ul className="mt-4 space-y-3">
                  {episode.learn.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-foreground">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ArrowLink href={`https://www.youtube.com/watch?v=${episode.videoId}`}>{t.watchOnYoutube}</ArrowLink>
          </aside>
        </div>

        <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label={t.back}>
          {prev ? (
            <Link href={localizeHref(locale, episodePath(prev.slug))} className="group block">
              <span className="readout">← {t.prev}</span>
              <span className="mt-2 block font-medium text-foreground group-hover:text-accent">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={localizeHref(locale, episodePath(next.slug))} className="group block sm:text-right">
              <span className="readout">{t.next} →</span>
              <span className="mt-2 block font-medium text-foreground group-hover:text-accent">{next.title}</span>
            </Link>
          )}
        </nav>
      </Container>
    </article>
  );
}
