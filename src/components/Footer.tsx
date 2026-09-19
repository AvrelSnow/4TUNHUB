import Link from "next/link";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import { ThemeControl } from "./ThemeControl";
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
  { titleKey: "company", keys: ["about", "community", "careers", "contact"] },
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

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const byKey = new Map(flattenTree().map((n) => [n.key, n]));
  const visibleGroups = groups
    .map((group) => ({ ...group, keys: group.keys.filter((k) => !byKey.get(k)?.hidden) }))
    .filter((group) => group.keys.length > 0);

  return (
    <footer className="mt-auto border-t border-border bg-surface text-2xs text-muted">
      <Container size="wide" className="pt-16 pb-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
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

        {/* The founder's record, stated as his, never as the Hub's partners. */}
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
          <div className="lg:text-right">
            <p className="font-semibold text-foreground">{dict.footer.affiliations}</p>
            <ul className="mt-3 flex flex-wrap items-center gap-2 lg:justify-end">
              {founderAffiliations.map((a) => (
                <li key={a.name}>
                  <span className="chip-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.logo} alt={a.name} title={a.name} loading="lazy" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3">{dict.footer.affiliationsNote}</p>
          </div>
        </div>

        {(partners.length > 0 || awards.length > 0 || memberships.length > 0) && (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <CredibilityRow title="Partners" items={partners} />
            <CredibilityRow title="Awards" items={awards} />
            <CredibilityRow title="Memberships" items={memberships} />
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} 4TUN Hub. {dict.footer.rights}
            <span className="hidden md:inline"> · {dict.footer.motto}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={localizeHref(locale, "/privacy")} className="transition-colors hover:text-foreground">
              {dict.routes.privacy}
            </Link>
            <ThemeControl strings={dict.theme} />
          </div>
        </div>
      </Container>
    </footer>
  );
}
