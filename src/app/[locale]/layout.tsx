import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
// Self-hosted Geist (Vercel's `geist` package) — no runtime fetch to
// fonts.gstatic.com, so dev/build never depend on network font access.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
 * One tag, not a media-switched pair. The ground is chosen by the visitor's
 * clock, not by `prefers-color-scheme`, so a media query cannot answer this
 * — the old pair promised a white chrome to anyone whose OS was set to
 * light, on a site that had no light theme at all. This is the night value
 * (the fallback), and ThemeControl rewrites it to the live
 * `--color-background` whenever the ground changes.
 */
export const viewport: Viewport = {
  themeColor: "#08090b",
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
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      // No `data-theme` is server-rendered. The page is static per locale and
      // cannot know a visitor's local hour, so guessing here would either
      // ship the wrong ground or force the page off the static path. The
      // resolver below sets it before first paint instead, and no markup
      // anywhere depends on it — which is why there is nothing to hydrate
      // and nothing that can mismatch.
      suppressHydrationWarning
    >
      <head>
        {/* BLOCKING, and first. It must run before the stylesheet paints,
            or the visitor sees the night ground flash to the day sheet.
            See src/lib/theme.ts for what it does and why it falls to dark. */}
        <script dangerouslySetInnerHTML={{ __html: themeResolverScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-6 focus:top-3"
        >
          {dict.a11y.skipToContent}
        </a>
        <Navbar locale={typedLocale} dict={dict} />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer locale={typedLocale} dict={dict} />
      </body>
    </html>
  );
}
