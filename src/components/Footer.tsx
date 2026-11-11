import Link from "next/link";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import { ThemeControl } from "./ThemeControl";
import { CONSENT_ANCHOR } from "@/lib/consent";
import { EmailCapture } from "./EmailCapture";
import { flattenTree } from "@/lib/sitemap";
import {
  CONTACT_EMAIL,
  SITE_LOCATION,
  WHATSAPP_COMMUNITY_URL,
  LINKEDIN_URL,
  YOUTUBE_URL,
  MEDIUM_URL,
} from "@/lib/site";
import { Glyph, type GlyphName } from "./ui/Glyph";
import { hueClass } from "@/lib/hues";
import { cn } from "@/lib/cn";
import {
  founderAffiliations,
  partners,
  awards,
  memberships,
  type Affiliation,
} from "@/lib/trust";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

/**
 * Footer — the closing scene. An indigo night in both themes, the same
 * ground as the CtaPanel above it, so a page ends in one continuous dark
 * band: the question, then the list, the map, the people behind it, and
 * the name set large as the full stop.
 * Trust content is REAL-ONLY: affiliations are attributed to the founder,
 * and partner/award/membership rows render only when populated.
 */

/** A footer link: a sitemap key (localised, hidden pages dropped) or an
 *  external channel. */
type FooterLink = { key: string } | { label: (d: Dictionary) => string; href: string };

/** The map, in the same groups as the nav's menus (Bonsai/Fapshi pattern). */
const columns: { title: (d: Dictionary) => string; links: FooterLink[] }[] = [
  {
    title: (d) => d.nav.menus.work,
    links: [{ key: "services" }, { key: "research" }, { key: "academy" }, { key: "projects" }],
  },
  {
    title: (d) => d.nav.menus.forLearners,
    links: [
      { key: "community" },
      { label: (d) => d.nav.menus.youtube, href: YOUTUBE_URL },
      { label: (d) => d.nav.menus.rem, href: MEDIUM_URL },
      { key: "waitlist" },
    ],
  },
  {
    title: (d) => d.nav.menus.company,
    links: [{ key: "about" }, { key: "founder" }, { key: "contact" }],
  },
];

const socials: { name: string; href: string; icon: GlyphName }[] = [
  { name: "LinkedIn", href: LINKEDIN_URL, icon: "linkedin" },
  { name: "YouTube", href: YOUTUBE_URL, icon: "youtube" },
  { name: "WhatsApp", href: WHATSAPP_COMMUNITY_URL, icon: "whatsapp" },
  { name: "Medium", href: MEDIUM_URL, icon: "medium" },
];

function CredibilityRow({ title, items }: { title: string; items: Affiliation[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {items.map((it) => (
          <li key={it.name}>
            <span className="text-foreground">{it.name}</span>
            {it.role ? ` · ${it.role}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Logo chips, each a link to the organisation's official site when it has one. */
function LogoRow({ items, wide = false, newTab }: { items: Affiliation[]; wide?: boolean; newTab: string }) {
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-2 lg:justify-end">
      {items.map((a) => {
        // eslint-disable-next-line @next/next/no-img-element
        const art = <img src={a.logo} alt={a.name} loading="lazy" />;
        const cls = wide ? "chip-logo chip-logo-wide" : "chip-logo";
        return (
          <li key={a.name}>
            {a.href ? (
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${a.name} (${newTab})`}
                className={`${cls} hover:border-foreground/30`}
              >
                {art}
              </a>
            ) : (
              <span className={cls} title={a.name}>
                {art}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const byKey = new Map(flattenTree().map((n) => [n.key, n]));

  return (
    <footer className="band-night mt-auto overflow-hidden text-2xs text-muted">
      <Container size="wide" className="pt-6 sm:pt-10">
        {/* The list, first, as a card: the one thing we ask for on every
            page. The track is fixed to `academy` because the line above
            the field promises course dates, nothing else. */}
        <div className="spotlight hue-amber flex flex-col gap-6 rounded-3xl bg-surface p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-md">
            <p className="text-headline text-foreground">{dict.waitlist.inline.footer.title}</p>
            <p className="mt-2 text-sm leading-6">{dict.waitlist.inline.footer.body}</p>
          </div>
          <EmailCapture
            t={dict.waitlist}
            track="academy"
            tone="footer"
            privacyHref={localizeHref(locale, "/privacy")}
            moreHref={localizeHref(locale, "/waitlist")}
            className="lg:w-[28rem] lg:shrink-0"
          />
        </div>

        {/* Who we are, the map, and how to reach us. Pillars in the map
            carry their hue dots, the same code as the nav. */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo href={localizeHref(locale, "/")} size="md" tone="night" />
            <p className="mt-5 max-w-xs text-sm leading-6">{dict.footer.blurb}</p>
            <ul className="mt-6 flex gap-2">
              {socials.map((x) => (
                <li key={x.name}>
                  <a
                    href={x.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${x.name} (${dict.footer.newTab})`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted transition-[color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-surface-2 hover:text-foreground"
                  >
                    <Glyph name={x.icon} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <nav key={col.title(dict)} aria-label={col.title(dict)}>
                <p className="text-sm font-semibold text-foreground">{col.title(dict)}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => {
                    if ("href" in link) {
                      return (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm transition-colors hover:text-foreground"
                          >
                            {link.label(dict)} <span aria-hidden="true">{"\u2197"}</span>
                          </a>
                        </li>
                      );
                    }
                    const node = byKey.get(link.key);
                    if (!node || node.hidden) return null;
                    const hue = hueClass(link.key);
                    return (
                      <li key={link.key}>
                        <Link
                          href={localizeHref(locale, node.href)}
                          className={cn(
                            "inline-flex items-center gap-2 text-sm transition-colors hover:text-foreground",
                            hue,
                          )}
                        >
                          {link.key === "founder" ? dict.nav.menus.founder : (dict.routes[link.key] ?? node.label)}
                          {hue && <span aria-hidden="true" className="bg-hue h-1.5 w-1.5 rounded-full" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}

            <div>
              <p className="text-sm font-semibold text-foreground">{dict.footer.reach}</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-foreground hover:underline hover:underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {dict.footer.whatsapp} {"\u2197"}
                  </a>
                </li>
                <li>{SITE_LOCATION}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The founder's record, stated as his, never as the Hub's partners.
            The Hub's own partners sit beside it under their own heading, so
            the two can never be read as one list. Every logo opens the
            organisation's official site: a claim a visitor can check. */}
        <div className="mt-16 flex flex-col gap-8 border-t border-border pt-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-foreground">{dict.footer.trustEyebrow}</p>
            <p className="mt-2 text-sm leading-6">{dict.footer.founderLine}</p>
            <Link
              href={localizeHref(locale, "/about/founder")}
              className="mt-2 inline-block text-sm text-accent hover:underline hover:underline-offset-4"
            >
              {dict.footer.meetFounder}
            </Link>
          </div>
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 lg:justify-end">
            {partners.length > 0 && (
              <div className="lg:text-right">
                <p className="text-sm font-semibold text-foreground">{dict.footer.partners}</p>
                <LogoRow items={partners} wide newTab={dict.footer.newTab} />
                <p className="mt-3">{dict.footer.partnersNote}</p>
              </div>
            )}
            <div className="lg:text-right">
              <p className="text-sm font-semibold text-foreground">{dict.footer.affiliations}</p>
              <LogoRow items={founderAffiliations} newTab={dict.footer.newTab} />
              <p className="mt-3">{dict.footer.affiliationsNote}</p>
            </div>
          </div>
        </div>

        {(awards.length > 0 || memberships.length > 0) && (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <CredibilityRow title="Awards" items={awards} />
            <CredibilityRow title="Memberships" items={memberships} />
          </div>
        )}

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} 4TUNHub. {dict.footer.rights}
            <span className="hidden md:inline"> · {dict.footer.motto}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={localizeHref(locale, "/privacy")} className="transition-colors hover:text-foreground">
              {dict.routes.privacy}
            </Link>
            {/* Withdrawing permission has to be as easy as giving it, so the
                switch is one click from every page, not only from the bar
                that asked once. */}
            <Link
              href={localizeHref(locale, `/privacy#${CONSENT_ANCHOR}`)}
              className="transition-colors hover:text-foreground"
            >
              {dict.privacy.storage.title}
            </Link>
            <Link href={localizeHref(locale, "/terms")} className="transition-colors hover:text-foreground">
              {dict.routes.terms}
            </Link>
            <ThemeControl strings={dict.theme} />
          </div>
        </div>

        {/* The full stop: the name as wide as the page, its foot cut by
            the page's edge. Decorative; the logo above names the site for
            assistive tech. The amber 4 is the logo's. */}
        <p aria-hidden="true" className="footer-wordmark mt-10 select-none">
          <span className="text-brand-500">4</span>TUNHub
        </p>
      </Container>
    </footer>
  );
}
