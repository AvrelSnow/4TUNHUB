import Link from "next/link";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
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
 * Footer — a trust & credibility hub (R5), locale-aware.
 * Trust content is REAL-ONLY: founder affiliations attributed to the
 * founder; partner/award/membership rows render only when populated.
 * No primary CTA here (it lives in the hero + nav — R2).
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
      <p className="eyebrow">{title}</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {items.map((it) => (
          <li key={it.name} className="text-sm text-muted">
            <span className="font-medium text-foreground">{it.name}</span>
            {it.role ? ` · ${it.role}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const byKey = new Map(flattenTree().map((n) => [n.key, n]));

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      {/* Trust band */}
      <Container className="border-b border-border py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <p className="eyebrow">{dict.footer.trustEyebrow}</p>
            <p className="mt-3 text-lg leading-8 text-foreground">
              {dict.footer.founderLine}
            </p>
            <Link
              href={localizeHref(locale, "/about/founder")}
              className="link-sweep mt-3 inline-block text-sm font-medium text-brand-800"
            >
              {dict.footer.meetFounder}
            </Link>
          </div>

          <div className="lg:max-w-md lg:text-right">
            <p className="eyebrow lg:text-right">{dict.footer.affiliations}</p>
            {/* Full-colour logos on uniform white chips — keeps each mark's
                identity while blending cleanly into the page. */}
            <ul className="mt-4 flex flex-wrap items-center gap-2.5 lg:justify-end">
              {founderAffiliations.map((a) => (
                <li key={a.name}>
                  <span className="flex h-11 w-14 items-center justify-center rounded-lg border border-border bg-white p-1.5 shadow-e1 transition-transform duration-200 hover:-translate-y-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.logo}
                      alt={a.name}
                      title={a.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500 lg:text-right">
              {dict.footer.affiliationsNote}
            </p>
          </div>
        </div>

        {(partners.length > 0 || awards.length > 0 || memberships.length > 0) && (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <CredibilityRow title="Partners" items={partners} />
            <CredibilityRow title="Awards" items={awards} />
            <CredibilityRow title="Memberships" items={memberships} />
          </div>
        )}
      </Container>

      {/* Navigation + brand */}
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.7fr_repeat(3,1fr)]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo href={localizeHref(locale, "/")} />
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              {dict.footer.blurb}
            </p>
            <div className="mt-6 space-y-1.5 text-sm">
              <p className="text-muted">{SITE_LOCATION}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="link-sweep inline-block font-medium text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {groups.map((group) => (
            <nav key={group.titleKey} aria-label={dict.footer.groups[group.titleKey]}>
              <p className="eyebrow">{dict.footer.groups[group.titleKey]}</p>
              <ul className="mt-5 space-y-3">
                {group.keys.map((key) => {
                  const node = byKey.get(key);
                  if (!node) return null;
                  return (
                    <li key={key}>
                      <Link
                        href={localizeHref(locale, node.href)}
                        className="link-sweep text-sm text-muted transition-colors hover:text-foreground"
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

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 4TUN Hub. {dict.footer.rights}</p>
          <p className="font-mono uppercase tracking-widest">{dict.footer.motto}</p>
        </div>
      </Container>
    </footer>
  );
}
