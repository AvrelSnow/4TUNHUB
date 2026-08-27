import Link from "next/link";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import type { SiteNode } from "@/lib/sitemap";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site";

/**
 * Localized placeholder for any sitemap route that isn't built yet.
 * Keeps the whole ecosystem navigable (no dead links) while each pillar
 * is developed — fully localized, on-brand, and honestly labelled.
 */
export function RoutePlaceholder({
  locale,
  dict,
  node,
}: {
  locale: Locale;
  dict: Dictionary;
  node: SiteNode;
}) {
  const title = dict.routes[node.key] ?? node.label;
  const purpose = dict.home.pillars[node.key];
  // The community already exists as an open WhatsApp group — so this page
  // converts instead of merely announcing.
  const isCommunity = node.key === "community";

  return (
    <Section pattern="rings" className="flex flex-1 flex-col justify-center py-24">
      <Badge variant="amber" className="w-fit">
        {isCommunity ? dict.community.live : dict.stub.badge}
      </Badge>
      <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {purpose && <p className="mt-4 max-w-xl text-lg leading-8 text-foreground">{purpose}</p>}
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">
        {isCommunity ? dict.community.note : `${dict.stub.beingBuilt} ${dict.stub.intro}`}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {isCommunity ? (
          <Button
            as="a"
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
          >
            {dict.community.join}
          </Button>
        ) : (
          <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
            {dict.stub.workWithUs}
          </Button>
        )}
        <Link
          href={localizeHref(locale, "/")}
          className="link-sweep inline-flex h-13 items-center text-base font-medium text-muted hover:text-foreground"
        >
          {dict.stub.backHome}
        </Link>
      </div>
    </Section>
  );
}
