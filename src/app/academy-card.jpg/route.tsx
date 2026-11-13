import { renderCard } from "@/lib/og-card";

/**
 * The Academy's link-preview card, for the page people actually share when
 * a cohort is announced. Built once at build time.
 *
 * A route with a dot in its name, like sitemap.xml, so the language proxy
 * leaves it alone. It names no cohort and no date: platforms cache a card for weeks, and
 * anything that moves would outlive the move.
 */
export const dynamic = "force-static";

export function GET() {
  return renderCard({
    eyebrow: "4TUNHub Academy",
    lines: ["Learn engineering", "that ships."],
    sub: "Free LS-DYNA tutorials, with the files to follow along",
    foot: "4tunhub.com/academy · Hear when a course opens",
    photo: "images/projects/beans-hero.webp",
    position: "centre",
  });
}
