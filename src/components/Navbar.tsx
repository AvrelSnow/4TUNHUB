import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { primaryNav } from "@/lib/sitemap";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

/**
 * The bar: translucent over whatever scrolls beneath it, 56px tall, the
 * six pillars in plain text and one small pill for the one action that
 * matters. Tablets and phones get the menu instead.
 */
export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = primaryNav.map(({ key, href }) => ({
    key,
    label: dict.routes[key] ?? key,
    href: localizeHref(locale, href),
  }));

  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <Container size="wide">
        <div className="flex h-14 items-center justify-between gap-6">
          <Logo href={localizeHref(locale, "/")} size="sm" />

          <nav aria-label={dict.nav.primary} className="hidden items-center gap-8 lg:flex">
            {items.map((p) => (
              <NavLink key={p.key} href={p.href}>
                {p.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
            <Button
              as="a"
              href={localizeHref(locale, "/contact")}
              size="sm"
              className="hidden sm:inline-flex"
            >
              {dict.nav.workWithUs}
            </Button>
            <MobileNav
              items={items}
              dict={dict}
              ctaHref={localizeHref(locale, "/contact")}
              locale={locale}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
