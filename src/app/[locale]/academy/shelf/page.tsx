import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { ShelfBrowser, type ShelfCard } from "@/components/ShelfBrowser";
import { SHELF_PATH, shelfItems } from "@/lib/shelf";
import { paymentUrl } from "@/lib/commerce";
import { FREE_RESOURCES_PATH } from "@/lib/free-resources";
import { isLocale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { ACADEMY_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = (await getDictionary(locale)).shelf;
  const share = { title: `${t.metaTitle} · ${SITE_NAME}`, description: t.metaDescription };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}${SHELF_PATH}` },
    openGraph: { ...share, type: "website", siteName: SITE_NAME, url: `${SITE_URL}/${locale}${SHELF_PATH}`, images: [ACADEMY_OG_IMAGE] },
    twitter: { card: "summary_large_image", ...share, images: [ACADEMY_OG_IMAGE] },
  };
}

export default async function ShelfPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.shelf;

  const cards: ShelfCard[] = shelfItems.map(({ hook, about, internal, product, ...item }) => {
    const payHref = product && paymentUrl(product);
    return {
      ...item,
      url: internal ? localizeHref(locale, item.url) : item.url,
      external: !internal,
      hook: hook[locale],
      about: about[locale],
      sale:
        product && payHref
          ? { price: formatCurrency(product.price.amount, locale, product.price.currency), payHref }
          : undefined,
    };
  });

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
        <p className="readout mt-6 text-center">{t.rule}</p>
      </PageHero>

      <Section rhythm="compressed" className="pt-0 sm:pt-0 lg:pt-0">
        <ShelfBrowser cards={cards} labels={t} waitlistHref={localizeHref(locale, "/waitlist?track=academy")} />
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
