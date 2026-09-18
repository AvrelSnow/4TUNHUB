/**
 * ============================================================
 * TRUST & CREDIBILITY — real-only (locked decision).
 * ============================================================
 * The footer trust hub renders from this data. Rules:
 *  - Nothing here is fabricated. Empty arrays render nothing.
 *  - Founder affiliations are attributed to the FOUNDER, never
 *    implied as 4TUN Hub corporate partnerships/sponsorships.
 *  - Populate `partners`, `awards`, `memberships` only when a
 *    genuine, correctly-attributed item exists.
 */

/** The founder's verifiable professional network — real, attributed. */
export type Affiliation = { name: string; role: string; logo?: string };

/**
 * Shown as LOGOS (not names). Only organisations with a genuine logo asset
 * appear in the strip; text-only affiliations (ENSET Douala, Université de
 * Dschang) are presented on the Founder page instead.
 */
export const founderAffiliations: Affiliation[] = [
  { name: "CAMRAIL", role: "Former Senior Engineer", logo: "/images/logos/camrail.webp" },
  { name: "University of Douala", role: "Lecturer", logo: "/images/logos/univ-douala.webp" },
  { name: "ENSET Douala", role: "Lecturer", logo: "/images/logos/enset.webp" },
  { name: "Institut Universitaire de la Côte", role: "Lecturer", logo: "/images/logos/iuc.webp" },
  {
    name: "Douala City SolidWorks User Group",
    role: "Facilitator",
    logo: "/images/logos/solidworks-ug.webp",
  },
  {
    name: "Renewable Energy Mall & Engineering Reviews",
    role: "Renewable-energy analyst",
    logo: "/images/logos/rem.webp",
  },
];

/** Org-level credibility slots — empty until genuinely earned. */
export const partners: Affiliation[] = [];
export const awards: Affiliation[] = [];
export const memberships: Affiliation[] = [];
