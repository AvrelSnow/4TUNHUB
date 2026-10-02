import Link from "next/link";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import { ThemeControl } from "./ThemeControl";
import { CONSENT_ANCHOR } from "@/lib/consent";
import { EmailCapture } from "./EmailCapture";
import { flattenTree } from "@/lib/sitemap";
import { CONTACT_EMAIL, SITE_LOCATION } from "@/lib/site";
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
 * Footer — small type on the grey band: the map of the site, the
 * founder's affiliations, and the fine print.
 * Trust content is REAL-ONLY: affiliations are attributed to the founder,
 * and partner/award/membership rows render only when populated.
 */

const groups: { titleKey: "ecosystem" | "company" | "resources"; keys: string[] }[] = [
  { titleKey: "ecosystem", keys: ["products", "services", "academy", "research", "projects"] },
  { titleKey: "company", keys: ["about", "community", "careers", "contact", "waitlist"] },
  { titleKey: "resources", keys: ["resources", "blog", "store", "solutions"] },
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
  const visibleGroups = groups
    .map((group) => ({ ...group, keys: group.keys.filter((k) => !byKey.get(k)?.hidden) }))
    .filter((group) => group.keys.length > 0);

  return (
    <footer className="mt-auto border-t border-border bg-surface text-2xs text-muted">
      <Container size="wide" className="pt-16 pb-10">
        {/* The list, first: the footer is where a reader lands once the
            page is over, and this is the one thing we ask for on every
            page of the site. The track is fixed to `academy` because the
            line above the field promises course dates, nothing else. */}
        <div className="flex flex-col gap-6 border-b border-border pb-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-md">
            <p className="text-base font-semibold tracking-tight text-foreground">
              {dict.waitlist.inline.footer.title}
            </p>
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

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div>
            <Logo href={localizeHref(locale, "/")} size="sm" />
            <p className="mt-5 max-w-xs text-sm leading-6">{dict.footer.blurb}</p>
            <div className="mt-5 space-y-1 text-sm">
              <p>{SITE_LOCATION}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-foreground hover:underline hover:underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3 lg:flex lg:gap-24">
            {visibleGroups.map((group) => (
              <nav key={group.titleKey} aria-label={dict.footer.groups[group.titleKey]}>
                <p className="font-semibold text-foreground">{dict.footer.groups[group.titleKey]}</p>
                <ul className="mt-4 space-y-3">
                  {group.keys.map((key) => {
                    const node = byKey.get(key);
                    if (!node) return null;
                    return (
                      <li key={key}>
                        <Link
                          href={localizeHref(locale, node.href)}
                          className="text-sm transition-colors hover:text-foreground"
                        >
                          {dict.routes[key] ?? node.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* The founder's record, stated as his, never as the Hub's partners.
            The Hub's own partners sit beside it under their own heading, so
            the two can never be read as one list. Every logo opens the
            organisation's official site: a claim a visitor can check. */}
        <div className="mt-14 flex flex-col gap-8 border-t border-border pt-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <p className="font-semibold text-foreground">{dict.footer.trustEyebrow}</p>
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
                <p className="font-semibold text-foreground">{dict.footer.partners}</p>
                <LogoRow items={partners} wide newTab={dict.footer.newTab} />
                <p className="mt-3">{dict.footer.partnersNote}</p>
              </div>
            )}
            <div className="lg:text-right">
              <p className="font-semibold text-foreground">{dict.footer.affiliations}</p>
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

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
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
      </Container>
    </footer>
  );
}
