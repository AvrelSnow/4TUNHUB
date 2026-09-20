/**
 * Talks and conferences — the sessions Donfack Fortune has run, co-hosted
 * or spoken at, in public, with a link that proves each one.
 *
 * REAL-ONLY, and every entry here is verifiable: the SOLIDWORKS sessions
 * are listed on the Douala City SWUG's own page on SWUGN's network, and
 * the nuclear webinar is on the African Young Generation in Nuclear's
 * programme. Nothing is listed that a reader cannot open.
 *
 * `role` is the part he actually played, and the distinction matters:
 * running a session for your own chapter is not the same as being invited
 * onto someone else's panel, and claiming the wrong one is the kind of
 * thing an engineer from the same network notices immediately.
 *
 * Dates are missing on purpose rather than guessed — SWUGN's list view
 * does not carry them, and a wrong year is worse than no year. Fill them
 * in from each event page as they are confirmed; the UI omits the column
 * until then.
 */
export type TalkRole = "hosted" | "cohosted" | "spoke";

export type Talk = {
  title: string;
  /** hosted = his chapter ran it; cohosted = another chapter's, with his;
   *  spoke = invited onto someone else's programme. */
  role: TalkRole;
  /** The organisation whose programme it sat on. */
  org: string;
  /** Proof. Every talk has one. */
  href: string;
  /** "August 2026" once confirmed from the event page. */
  date?: string;
  /** One line, only where the title does not carry the subject itself. */
  note?: string;
};

const SWUGN = "https://community.swugn.org/events/details";

/** Newest first as far as the order on SWUGN's page allows. */
export const talks: Talk[] = [
  {
    title: "Nuclear Fuel Cycle in Africa",
    role: "spoke",
    org: "African Young Generation in Nuclear (AYGN)",
    date: "8 August 2026",
    href: "https://africanaygn.org",
    note: "A panel on the nuclear fuel cycle, its development, and its contribution to Africa's growing electricity demand — alongside speakers from Eskom's Koeberg station, Malawi's Atomic Energy Regulatory Authority and Rössing Uranium.",
  },
  {
    title: "Mastering CSWA Certifications: CAD Design & Additive Manufacturing",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-mastering-cswa-certifications-focus-on-cad-design-amp-additive-manufacturing/`,
  },
  {
    title: "Tips & Tricks to Ace the CSWE Exam",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-tips-amp-tricks-to-ace-the-cswe-exam/`,
  },
  {
    title: "Tips & Tricks to Ace the CSWP Mechanical Design Exam",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-tips-amp-tricks-to-ace-the-cswp-mechanical-design-exam/`,
  },
  {
    title: "Tips & Tricks to Ace the CSWP Sheet Metal Exam",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-tips-and-tricks-to-ace-the-cswp-sheet-metal-exam/`,
  },
  {
    title: "The Power of Topology Optimisation for Smarter Design in SOLIDWORKS",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-the-power-of-topology-optimisation-for-smarter-design-in-solidworks/cohost-douala-city-solidworks-user-group`,
  },
  {
    title: "Assembly Modeling Mastery: From Basic Mates to Smart Assembly Tools",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-assembly-modeling-mastery-from-basic-mates-to-smart-assembly-tools/`,
  },
  {
    title: "SOLIDWORKS Essentials & Best Practices",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-solidworks-essentials-amp-best-practices/`,
  },
  {
    title: "AFRISWUG · First Principles: Reinforcing Local Innovation",
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-afriswug-first-principles-reinforcing-local-innovation-the-first-model-of-a-unified-africa/cohost-douala-city-solidworks-user-group`,
    note: "The first model of a unified Africa — the pan-African SWUG session, run across chapters.",
  },
  {
    title: "AFRISWUG · First Principles: Reinforcing Local Innovation",
    role: "cohosted",
    org: "Benin SWUG",
    href: `${SWUGN}/solidworks-benin-solidworks-user-group-presents-afriswug-first-principles-reinforcing-local-innovation-the-first-model-of-a-unified-africa/cohost-douala-city-solidworks-user-group`,
  },
  {
    title: "Design in the Age of AI",
    role: "cohosted",
    org: "Mansoura SWUG",
    href: `${SWUGN}/solidworks-mansoura-solidworks-user-group-presents-design-in-the-age-of-ai/cohost-douala-city-solidworks-user-group`,
  },
  {
    title: "Buea SOLIDWORKS User Group · Inaugural Meeting",
    role: "cohosted",
    org: "Buea SWUG",
    href: `${SWUGN}/solidworks-buea-solidworks-user-group-presents-buea-solidworks-user-group-inaugural-meeting/cohost-douala-city-solidworks-user-group`,
  },
];

/** Where the whole programme lives, for anyone who wants all of it. */
export const TALKS_ARCHIVE_URL =
  "https://community.swugn.org/douala-city-solidworks-user-group/";
export const TALKS_VIDEO_URL = "https://www.youtube.com/@TheDoualaCitySWUG";
