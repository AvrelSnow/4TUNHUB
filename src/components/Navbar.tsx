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

/** Top-level ecosystem navigation — locale-aware labels, hrefs and CTA. */
export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = primaryNav.map(({ key, href }) => ({
    key,
    label: dict.routes[key] ?? key,
    href: localizeHref(locale, href),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo href={localizeHref(locale, "/")} />

          {/* From lg, not md: at 768px the six mono labels plus logo, EN·FR
              and the CTA need ~786px, so every page
              scrolled sideways by 18px. Tablets get the menu instead. */}
          <nav aria-label={dict.nav.primary} className="hidden items-center gap-6 lg:flex xl:gap-7">
            {items.map((p) => (
              <NavLink key={p.key} href={p.href}>
                {p.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
            <Button
              as="a"
              href={localizeHref(locale, "/contact")}
              size="md"
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
