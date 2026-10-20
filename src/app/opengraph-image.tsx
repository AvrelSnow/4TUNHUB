import { OG_SIZE, renderCard } from "@/lib/og-card";

/**
 * Social share card (OpenGraph/Twitter), generated at build time: what
 * WhatsApp, LinkedIn and X show when someone shares 4tunhub.com.
 *
 * The claim and a real photograph: the CC3300 locomotive from the braking
 * project. Kept evergreen on purpose: platforms cache this card for weeks,
 * so it never carries a date. The renderer lives in src/lib/og-card.tsx.
 */
export const alt = "4TUNHub: we design machines, and teach you how.";
export const size = OG_SIZE;
export const contentType = "image/jpeg";

export default function OpengraphImage() {
  return renderCard({
    lines: ["We design machines.", "And teach you how."],
    sub: "Design · FEA simulation · CAD training",
    foot: "4tunhub.com · Dschang, Cameroon",
    photo: "images/projects/braking-hero.webp",
  });
}
