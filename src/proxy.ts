import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

/**
 * Proxy (Next 16's renamed middleware). Ensures every request carries a
 * locale prefix. Picks the visitor's language from Accept-Language on the
 * first hit, then redirects locale-less paths to `/{locale}{path}`.
 */

function getLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
      if ((locales as readonly string[]).includes(code)) return code;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Run on everything EXCEPT: Next internals, generated metadata routes,
  // and any path containing a dot (robots.txt, sitemap.xml, *.svg, etc.).
  matcher: ["/((?!_next|opengraph-image|icon|.*\\.).*)"],
};
