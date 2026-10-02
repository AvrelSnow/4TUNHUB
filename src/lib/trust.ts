/**
 * ============================================================
 * TRUST & CREDIBILITY — real-only (locked decision).
 * ============================================================
 * The footer trust hub renders from this data. Rules:
 *  - Nothing here is fabricated. Empty arrays render nothing.
 *  - Founder affiliations are attributed to the FOUNDER, never
 *    implied as 4TUNHub corporate partnerships/sponsorships.
 *  - Populate `partners`, `awards`, `memberships` only when a
 *    genuine, correctly-attributed item exists.
 */

import { MKV } from "@/lib/cohort";
import { MEDIUM_URL } from "@/lib/site";

/**
 * The founder's verifiable professional network — real, attributed.
 * `href` is the organisation's own official page, so a logo can be checked
 * by clicking it; one without a verified address renders as plain art.
 */
export type Affiliation = { name: string; role: string; logo?: string; href?: string };

/**
 * Shown as LOGOS (not names). Only organisations with a genuine logo asset
 * appear in the strip; text-only affiliations (ENSET Douala, Université de
 * Dschang) are presented on the Founder page instead.
 */
export const founderAffiliations: Affiliation[] = [
  {
    name: "CAMRAIL",
    role: "Former Senior Engineer",
    logo: "/images/logos/camrail.webp",
    // camrail.net serves an incomplete certificate chain (checked 2 Oct
    // 2026): browsers warn before opening it. The company's own LinkedIn
    // page is official and opens cleanly. Swap back once the site is fixed.
    href: "https://www.linkedin.com/company/camrail-sa",
  },
  {
    name: "University of Douala",
    role: "Lecturer",
    logo: "/images/logos/univ-douala.webp",
    href: "https://www.univ-douala.cm",
  },
  {
    name: "ENSET Douala",
    role: "Lecturer",
    logo: "/images/logos/enset.webp",
    href: "https://enset-douala.cm",
  },
  {
    name: "Institut Universitaire de la Côte",
    role: "Lecturer",
    logo: "/images/logos/iuc.webp",
    href: "https://myiuc.com",
  },
  {
    name: "Douala City SolidWorks User Group",
    role: "Facilitator",
    logo: "/images/logos/solidworks-ug.webp",
    href: "https://community.swugn.org/douala-city-solidworks-user-group/",
  },
  {
    name: "Renewable Energy Mall & Engineering Reviews",
    role: "Renewable-energy analyst",
    logo: "/images/logos/rem.webp",
    href: MEDIUM_URL,
  },
];

/**
 * Org-level credibility slots — empty until genuinely earned.
 * MKV Academy: a signed agreement with 4TUNHub (1 Oct 2026) to deliver
 * Cohort 0 together. A partnership of the Hub, so it is listed here and
 * never among the founder's affiliations.
 */
export const partners: Affiliation[] = [
  { name: MKV.name, role: "Cohort 0 partner", logo: MKV.logo, href: MKV.url },
];
export const awards: Affiliation[] = [];
export const memberships: Affiliation[] = [];
