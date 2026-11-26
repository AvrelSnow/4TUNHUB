import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { EmailCaptureBand } from "@/components/EmailCaptureBand";
import { FREE_RESOURCES_PATH, freeResourceGroups } from "@/lib/free-resources";
import { LIBRARY_PATH } from "@/lib/lsdyna";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = (await getDictionary(locale)).freeResources;
  const share = { title: `${t.metaTitle} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${FREE_RESOURCES_PATH}` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${FREE_RESOURCES_PATH}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function FreeResourcesPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.freeResources;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
        <p className="readout mt-6 text-center">{t.rule}</p>
      </PageHero>

      {freeResourceGroups.map((g, gi) => {
        const copy = t.groups[g.key];
        if (!copy) return null;
        return (
          <Section
            key={g.key}
            id={g.key}
            tone={gi % 2 === 0 ? "surface" : "default"}
            rhythm="compressed"
            eyebrow={`${gi + 1} / ${freeResourceGroups.length}`}
            title={copy.title}
            intro={copy.body}
          >
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((r, i) => (
                <li key={r.url}>
                  <Reveal delay={(i % 3) * 60} className="h-full">
                    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-surface-2">
                      {r.preview && (
                        // The title below says what it is: the picture adds nothing for a screen reader.
                        <Media src={r.preview} alt="" className="aspect-video w-full" />
                      )}
                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="amber">{t.costs[r.cost]}</Badge>
                        {r.lang === "fr" && <Badge variant="outline">{t.langs.fr}</Badge>}
                        {r.facts?.map((f) => (
                          <Badge key={f} variant="outline">
                            {f}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-4 text-2xs font-semibold tracking-wide text-accent">{r.by}</p>
                      <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-foreground">
                        {r.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted">{locale === "fr" && r.noteFr ? r.noteFr : r.note}</p>
                      <div className="mt-auto pt-6">
                        {r.internal ? (
                          <ArrowLink href={localizeHref(locale, r.url)}>{t.open}</ArrowLink>
                        ) : (
                          <ArrowLink href={r.url} external>
                            {t.open}
                          </ArrowLink>
                        )}
                      </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <EmailCaptureBand
        t={dict.waitlist}
        band="academy"
        track="academy"
        privacyHref={localizeHref(locale, "/privacy")}
        moreHref={localizeHref(locale, "/waitlist")}
      />

      <CtaPanel
        title={t.ctaTitle}
        subtitle={t.ctaSubtitle}
        primary={{ label: t.ctaPrimary, href: localizeHref(locale, "/academy") }}
        secondary={{ label: t.ctaSecondary, href: localizeHref(locale, LIBRARY_PATH) }}
      />
    </>
  );
}
