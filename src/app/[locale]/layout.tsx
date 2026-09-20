import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
// Self-hosted type (Fontsource): no runtime fetch to Google, and the CSP
// allows fonts from 'self' only. Each file carries unicode-range, so a page
// downloads only the subsets it uses; French needs latin plus latin-ext.
// Instrument Sans, weight axis only: one family for everything.
import "@fontsource-variable/instrument-sans/wght.css";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { CohortRibbon } from "@/components/CohortRibbon";
import { COHORT_PATH, applicationsOpen } from "@/lib/cohort";
import { localizeHref } from "@/lib/i18n/routing";
import { SITE_URL, SITE_NAME, SITE_KEYWORDS, organizationJsonLd } from "@/lib/site";
import { themeResolverScript } from "@/lib/theme";
import { locales, isLocale, localeTag, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type LayoutParams = { params: Promise<{ locale: string }> };

/** Pre-render one static tree per locale. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.title, template: `%s · ${SITE_NAME}` },
    description: dict.meta.description,
    keywords: SITE_KEYWORDS,
    authors: [{ name: "Donfack Fortune" }],
    creator: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${SITE_URL}/${locale}`,
      locale: localeTag[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fr: "/fr", "x-default": "/en" },
    },
  };
}

/**
 * One tag, not a media-switched pair: the theme follows the visitor's clock,
 * which a media query cannot see. This is the day value (the fallback), and
 * ThemeControl rewrites it to the live `--color-background` after mount.
 */
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = await getDictionary(typedLocale);

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      // No `data-theme` is server-rendered: a static page cannot know the
      // visitor's local hour. The resolver below sets it before first paint,
      // and no markup depends on it, so nothing can mismatch on hydration.
      suppressHydrationWarning
    >
      <head>
        {/* BLOCKING, and first, so the page never flashes the wrong theme.
            See src/lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: themeResolverScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          {dict.a11y.skipToContent}
        </a>
        {applicationsOpen() && (
          <CohortRibbon
            href={localizeHref(typedLocale, COHORT_PATH)}
            text={dict.ribbon.text}
            short={dict.ribbon.short}
            cta={dict.ribbon.cta}
          />
        )}
        <Navbar locale={typedLocale} dict={dict} />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer locale={typedLocale} dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
