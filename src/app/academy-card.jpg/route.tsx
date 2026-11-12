import { renderCard } from "@/lib/og-card";

/**
 * The Academy's link-preview card, for the page people actually share when
 * a cohort is announced. Built once at build time.
 *
 * A route with a dot in its name, like sitemap.xml, so the language proxy
 * leaves it alone. It names the next cohort and its month, never a day:
 * platforms cache a card for weeks, and a date that moves would outlive
 * the move.
 */
export const dynamic = "force-static";

export function GET() {
  return renderCard({
    eyebrow: "4TUNHub Academy",
    lines: ["CSWA Bootcamp.", "Cohort 1 · January."],
    sub: "Live SolidWorks training, mapped to the CSWA exam",
    foot: "4tunhub.com/academy · Join the waitlist",
    photo: "images/projects/beans-hero.webp",
    position: "centre",
  });
}
