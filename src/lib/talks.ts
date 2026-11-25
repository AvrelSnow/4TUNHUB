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
 * Dates are never guessed: one is here only when the event page or the
 * recording's own description states it (checked 2026-11-24), and the UI
 * leaves the date out otherwise.
 *
 * `recording` is a video of the session on the Douala City SWUG's own
 * YouTube channel, played on this site (src/components/SessionCard.tsx).
 * The poster is our own copy of its thumbnail under /public/images/sessions,
 * because the CSP allows no image from elsewhere. `learn` and `chapters`
 * are taken from the recording's description, not written by us. A session
 * with no recording on that channel has none, and the Academy page leaves
 * it out (the founder page still lists it).
 *
 * `speaker` is who gave the session, as its event page or recording names
 * them. The sessions listed as `hosted` were run by Donfack Fortune as
 * host; the speaker is usually someone else, and the page says both.
 */
import type { Chapter } from "@/lib/lsdyna";

export type TalkRole = "hosted" | "cohosted" | "spoke";

export type Talk = {
  title: string;
  /** A session that teaches a skill or an exam, shown on the Academy page
   *  as "taught before". Panels and community meetings stay off it. */
  lesson?: boolean;
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
  /** Who gave the session, with the credential its page states. */
  speaker?: string;
  /** The video, when one exists on the group's YouTube channel. */
  recording?: Recording;
};

export type Recording = {
  videoId: string;
  /** The published length, h:mm:ss or mm:ss. */
  length: string;
  /** Under /public: our own copy of the video's thumbnail. */
  poster: string;
  /** What the session covers, from the recording's description. */
  learn: string[];
  /** Chapters from the description; times are as published. */
  chapters?: Chapter[];
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
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-mastering-cswa-certifications-focus-on-cad-design-amp-additive-manufacturing/`,
    date: "16 September 2025",
    speaker: "Yusuf Hossam",
  },
  {
    title: "Tips & Tricks to Ace the CSWE Exam",
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-tips-amp-tricks-to-ace-the-cswe-exam/`,
    date: "31 January 2026",
    speaker: "Yusuf Hossam",
    recording: {
      videoId: "tuub0Tcbv7I",
      length: "2:09:19",
      poster: "/images/sessions/cswe.webp",
      learn: [
        "How the CSWE exam is structured and what examiners expect",
        "Techniques to increase modelling speed and accuracy",
        "The common mistakes that lose easy points",
        "Best practices of CSWE-certified professionals",
      ],
      chapters: [
        { at: "0:00", label: "Introduction" },
        { at: "5:31", label: "Who is Yussuf?" },
        { at: "7:45", label: "The presentation starts" },
        { at: "1:57:35", label: "End of the presentation, final questions" },
        { at: "2:03:00", label: "Important reminders" },
      ],
    },
  },
  {
    title: "Tips & Tricks to Ace the CSWP Mechanical Design Exam",
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-tips-amp-tricks-to-ace-the-cswp-mechanical-design-exam/`,
    date: "4 October 2025",
    speaker: "Prasad Adiga, Bengaluru SWUG leader, Certified SOLIDWORKS Expert",
  },
  {
    title: "Tips & Tricks to Ace the CSWP Sheet Metal Exam",
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-tips-and-tricks-to-ace-the-cswp-sheet-metal-exam/`,
    date: "30 October 2025",
    speaker: "Ali Haider, SOLIDWORKS Champion",
    recording: {
      videoId: "ea48vDC7egc",
      length: "1:05:56",
      poster: "/images/sessions/cswp-sheet-metal.webp",
      learn: [
        "How the CSWP sheet metal exam is structured",
        "The sheet metal features to master: base flange, edge flange, miter flange, sketched bend, jog, convert to sheet metal",
        "The mistakes that make candidates fail, and how to manage the time",
        "How to check a flat pattern and verify your answers",
      ],
      chapters: [
        { at: "0:00", label: "Introduction" },
        { at: "1:25", label: "Who is Ali?" },
        { at: "2:18", label: "The presentation starts" },
        { at: "1:02:30", label: "End of the presentation, final questions" },
        { at: "1:03:17", label: "Important reminders" },
      ],
    },
  },
  {
    title: "The Power of Topology Optimisation for Smarter Design in SOLIDWORKS",
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-the-power-of-topology-optimisation-for-smarter-design-in-solidworks/cohost-douala-city-solidworks-user-group`,
    speaker: "Ahmed Mohamed M. Saeed, leader of Mansoura SWUG (co-host)",
    recording: {
      videoId: "T_9mtjD07RU",
      length: "1:16:29",
      poster: "/images/sessions/topology.webp",
      learn: [
        "What topology optimisation is, and why it matters",
        "How to set up a topology study in SOLIDWORKS Simulation",
        "How to define goals such as minimum mass or maximum stiffness",
        "How to read the result and apply the optimised geometry",
        "How it connects to generative and additive design",
      ],
      chapters: [
        { at: "0:00", label: "Welcome and introduction" },
        { at: "1:34", label: "Key takeaways" },
        { at: "5:12", label: "What is topology optimisation?" },
        { at: "19:38", label: "Setting up a topology study" },
        { at: "22:20", label: "Design goals and constraints" },
        { at: "26:00", label: "Running the simulation and reading the results" },
        { at: "29:30", label: "Applying the optimised geometry" },
        { at: "51:50", label: "Real-world applications" },
        { at: "1:09:40", label: "Q&A" },
      ],
    },
  },
  {
    title: "Assembly Modeling Mastery: From Basic Mates to Smart Assembly Tools",
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-assembly-modeling-mastery-from-basic-mates-to-smart-assembly-tools/`,
    date: "5 March 2026",
    speaker: "Muhammad Huzaifa Aftab, Certified SOLIDWORKS Expert",
    recording: {
      videoId: "U0bChpkaVnI",
      length: "1:15:26",
      poster: "/images/sessions/assembly.webp",
      learn: [
        "How to apply and manage basic mates",
        "Advanced mate types, and when to use them",
        "Smart assembly tools that save hours",
        "Best practices for clean, error-free assemblies",
      ],
      chapters: [
        { at: "0:00", label: "Introduction and welcome" },
        { at: "3:05", label: "Bottom-up and top-down assembly" },
        { at: "6:55", label: "What are mates?" },
        { at: "7:43", label: "Standard mates in depth" },
        { at: "12:18", label: "Advanced and mechanical mates" },
        { at: "17:10", label: "Common assembly mistakes" },
        { at: "19:00", label: "Live demo and best practices" },
        { at: "50:20", label: "Q&A" },
      ],
    },
  },
  {
    title: "SOLIDWORKS Essentials & Best Practices",
    lesson: true,
    role: "hosted",
    org: "Douala City SWUG",
    href: `${SWUGN}/solidworks-douala-city-solidworks-user-group-presents-solidworks-essentials-amp-best-practices/`,
    date: "8 April 2026",
    speaker: "Zyad Eldmaty, SOLIDWORKS Champion, Certified SOLIDWORKS Expert",
    note: "A co-hosted session with Egypt's SOLIDWORKS Engineering Community.",
    recording: {
      videoId: "rkupNZhloCo",
      length: "35:23",
      poster: "/images/sessions/essentials.webp",
      learn: [
        "Why sketch-driven geometry beats random modelling",
        "How to set up a parametric part that survives a change of dimension",
        "The three mistakes that crash models during assembly",
        "How to read the feature tree to diagnose a failed feature",
        "Design intent versus geometry: what every constraint is for",
      ],
      chapters: [
        { at: "0:00", label: "Welcome" },
        { at: "1:12", label: "The session begins" },
        { at: "3:10", label: "Agenda" },
        { at: "10:49", label: "Sketch entities" },
        { at: "11:50", label: "Live demo" },
        { at: "30:20", label: "Live demo 2" },
        { at: "35:00", label: "Closing" },
      ],
    },
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
