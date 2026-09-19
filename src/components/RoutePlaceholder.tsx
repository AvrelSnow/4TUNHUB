import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { ArrowLink } from "./ui/ArrowLink";
import { Badge } from "./ui/Badge";
import type { SiteNode } from "@/lib/sitemap";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site";

/**
 * Localized placeholder for any sitemap route that isn't built yet.
 * Keeps the whole ecosystem navigable (no dead links) while each pillar
 * is developed, and says plainly that it is in progress.
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
  // The community already exists as an open WhatsApp group, so this page
  // converts instead of merely announcing.
  const isCommunity = node.key === "community";

  return (
    <section className="flex flex-1 flex-col justify-center py-28 sm:py-36">
      <Container size="narrow" className="text-center">
        <Badge variant={isCommunity ? "amber" : "outline"}>
          {isCommunity ? dict.community.live : dict.stub.badge}
        </Badge>
        <h1 className="mt-6 animate-fade-up text-display text-foreground">{title}</h1>
        {purpose && <p className="mx-auto mt-6 max-w-xl text-lead text-foreground">{purpose}</p>}
        <p className="mx-auto mt-4 max-w-xl text-muted">
          {isCommunity ? dict.community.note : `${dict.stub.beingBuilt} ${dict.stub.intro}`}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
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
          <ArrowLink href={localizeHref(locale, "/")}>{dict.stub.backHome}</ArrowLink>
        </div>
      </Container>
    </section>
  );
}
