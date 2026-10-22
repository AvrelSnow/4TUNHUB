import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PathMap } from "@/components/PathMap";
import { PATH_ROOT, lessonPath, path } from "@/lib/engineering-thinking";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.path;
  const share = { title: `${t.metaTitle} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${PATH_ROOT}` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${PATH_ROOT}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function PathPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.path;
  const hrefs = Object.fromEntries(
    path.cards.flatMap((c) => c.lessons.map((l) => [l.id, localizeHref(locale, lessonPath(l.id))])),
  );
  // The route's own needs and outcomes come from the Lab, in English; the
  // French page leads with its own tagline and intro instead.
  const english = locale === "en";

  return (
    <section className="pt-12 pb-24 sm:pt-16">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{t.eyebrow}</p>
          <Badge variant="amber">{t.free}</Badge>
        </div>
        <h1 className="mt-3 text-display-sm text-foreground">{t.title}</h1>
        <p className="mt-3 text-lead text-foreground">{t.tagline}</p>
        <p className="mt-4 text-lead text-muted">{t.intro}</p>
        {t.languageNote && <p className="readout mt-3">{t.languageNote}</p>}

        {english && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { title: t.need, items: path.need },
              { title: t.able, items: path.able },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl bg-surface p-5">
                <h2 className="text-sm font-semibold text-muted">{b.title}</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-foreground">
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <PathMap cards={path.cards} hrefs={hrefs} t={t} />
        </div>
      </Container>
    </section>
  );
}
