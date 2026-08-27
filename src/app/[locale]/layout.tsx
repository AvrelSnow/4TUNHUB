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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
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
    >
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
