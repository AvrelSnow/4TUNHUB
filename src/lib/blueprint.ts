/**
 * ============================================================
 * 4TUN HUB — EXECUTION BLUEPRINT (spec layer)
 * ============================================================
 * This file turns the information architecture (sitemap.ts) into
 * a precise build contract. Anyone picking up a page should be able
 * to read its PageSpec and know EXACTLY what to build, for whom,
 * and how "done" is measured — without asking a question.
 *
 * Rendered by /blueprint. Edit here, the blueprint updates.
 * ============================================================
 */

export type Priority = "P0" | "P1" | "P2";

export const priorityMeta: Record<
  Priority,
  { label: string; note: string }
> = {
  P0: { label: "P0 · Launch-critical", note: "Required for first public release." },
  P1: { label: "P1 · Fast-follow", note: "Ships shortly after launch." },
  P2: { label: "P2 · Ecosystem growth", note: "Built as the ecosystem matures." },
};

export type PageSpec = {
  key: string; // matches a SiteNode key in sitemap.ts
  route: string;
  title: string;
  priority: Priority;
  objective: string; // the single job of this page
  audience: string; // who it must serve
  sections: string[]; // required blocks, in order, top → bottom
  primaryCTA: string; // the ONE action this page drives
  contentSource: string; // where the real content comes from
  dependencies: string[]; // what must exist before this is buildable
  acceptance: string[]; // Definition of Done — each item testable
};

export const pageSpecs: PageSpec[] = [
  {
    key: "home",
    route: "/",
    title: "Home",
    priority: "P0",
    objective:
      "In five seconds, make a first-time visitor understand 4TUN Hub is an engineering ECOSYSTEM (not a personal portfolio), then route them to the right pillar.",
    audience:
      "First-time visitors: practicing engineers, students, companies, and potential partners.",
    sections: [
      "Hero — one-sentence value proposition + primary CTA + supporting visual",
      "Trust strip — credibility signals (CAMRAIL, ENSET/Dschang, projects delivered)",
      "What we do — 4 pillar cards (Services, Academy, Research, Products)",
      "Proof — 2–3 featured engineering projects with outcomes",
      "Founder teaser — org-first, one line, links into /about (never the headline)",
      "Ecosystem outlook — what's coming (Resources, Community, Store)",
      "Conversion band — 'Work with us' CTA",
    ],
    primaryCTA: "Work with us → /contact (secondary: Explore services → /services)",
    contentSource:
      "Positioning statement; pillar summaries from sitemap.ts; proof from Projects.",
    dependencies: ["Design system (Phase 0)", "Pillar routes exist (even as stubs)"],
    acceptance: [
      "Above-the-fold communicates 'engineering ecosystem' with no scrolling on a 375px screen",
      "Every pillar card links to a live route (no dead links)",
      "LCP < 2.5s on mid-tier mobile; CLS < 0.1",
      "All text passes WCAG AA contrast (≥ 4.5:1 body)",
      "Renders correctly at 360, 768, 1024, 1440, 1920px",
    ],
  },
  {
    key: "services",
    route: "/services",
    title: "Engineering Services",
    priority: "P0",
    objective:
      "Convert companies and individuals who need engineering work into qualified inquiries by presenting offerings + proof with clarity.",
    audience:
      "Companies, engineering firms, and entrepreneurs needing mechanical design, FEA, or renewable-energy consulting.",
    sections: [
      "Hero — what 4TUN Hub engineers, in one line",
      "Offerings — Mechanical design · FEA/Simulation · Renewable-energy systems · Technical consulting (each: outcome, not just feature)",
      "How we work — the engagement process (discovery → delivery)",
      "Proof — linked case studies from /projects",
      "Engagement models — freelance / project / retainer (optional at launch)",
      "Conversion — 'Request a consultation'",
    ],
    primaryCTA: "Request a consultation → /contact",
    contentSource:
      "donfackfortune.me services; SolidWorks/FEA + energy expertise; CAMRAIL context.",
    dependencies: ["/projects for case-study links", "Contact form"],
    acceptance: [
      "Each offering has: title, plain-language outcome, and who it's for",
      "At least 2 offerings link to a real project as proof",
      "Primary CTA is reachable without scrolling on mobile (sticky or repeated)",
      "No jargon left undefined for a non-expert buyer",
    ],
  },
  {
    key: "projects",
    route: "/projects",
    title: "Projects",
    priority: "P0",
    objective:
      "Establish credibility with real engineering case studies — the evidence layer the whole ecosystem leans on.",
    audience: "Prospective clients, students, recruiters, and partners evaluating capability.",
    sections: [
      "Hero — framing: engineering delivered, not just designed",
      "Filter — by category (Simulation-Driven, Sustainability, Mechanical Design, Electronics, User-Centered)",
      "Project grid — cards with thumbnail, title, category, one-line outcome",
      "Project detail template (/projects/[slug]) — Problem · Approach · Tools · Results · Media",
    ],
    primaryCTA: "Discuss a similar project → /contact",
    contentSource:
      "Portfolio: FSAE car, banana-pseudostem shredder, motorised wheelbarrow, train-braking reverse engineering, pedal charger, beans machine.",
    dependencies: ["Design system", "Project media assets"],
    acceptance: [
      "Every project states Problem, Approach, Tools, and Outcome",
      "Every project has at least one visual",
      "Category filter works with keyboard and on mobile",
      "Detail pages live at /projects/[slug] and are individually linkable",
    ],
  },
  {
    key: "about",
    route: "/about",
    title: "About",
    priority: "P0",
    objective:
      "Tell the ORGANIZATION's story (mission, vision) first, then present the founder as the credibility behind it.",
    audience: "Anyone deciding whether to trust 4TUN Hub — clients, partners, students, press.",
    sections: [
      "Hero — mission in one sentence",
      "Vision — where 4TUN Hub is heading",
      "Values / principles",
      "Timeline — the journey so far",
      "Team & Partners — (placeholders until real)",
      "Founder teaser — links to /about/founder",
    ],
    primaryCTA: "Meet the founder → /about/founder",
    contentSource: "Vision documents; mission/vision as defined with Fortune.",
    dependencies: ["/about/founder"],
    acceptance: [
      "Organization is introduced before the founder, on-page order",
      "Mission and vision are each a single, quotable sentence",
      "Timeline items have dates",
    ],
  },
  {
    key: "founder",
    route: "/about/founder",
    title: "Founder — Donfack Fortune",
    priority: "P0",
    objective:
      "Provide deep, verifiable credibility so the organization is trusted — presented as founder/visionary, not as the site's product.",
    audience: "Evaluators who want proof: clients, academic partners, recruiters, media.",
    sections: [
      "Biography — engineer, energy specialist, educator",
      "Experience — CAMRAIL (Senior Engineer), ENSET Douala & U. Dschang (Lecturer), REM (Energy Analyst)",
      "Portfolio — links into /projects",
      "Certifications",
      "Awards",
      "Résumé — downloadable",
      "Media — talks, features, press",
    ],
    primaryCTA: "Download résumé / Work with 4TUN Hub → /contact",
    contentSource:
      "donfackfortune.me: roles, CAMRAIL 319B FCFA rail modernization, teaching, SolidWorks facilitation.",
    dependencies: ["Résumé PDF asset", "/projects"],
    acceptance: [
      "Experience entries carry role, organization, and dates",
      "Résumé is downloadable and the download works",
      "Portfolio links resolve to real project pages",
      "Framing stays founder-of-org, never 'this website is about me'",
    ],
  },
  {
    key: "contact",
    route: "/contact",
    title: "Contact",
    priority: "P0",
    objective: "Make starting a project, partnership, or conversation effortless.",
    audience: "Anyone ready to engage — clients, students, partners.",
    sections: [
      "Hero — invitation + expectation (48h response)",
      "Contact form — name, email, topic, message",
      "Direct channels — email, LinkedIn, WhatsApp, location (Dschang, Cameroon)",
      "Response SLA — within 48 hours",
    ],
    primaryCTA: "Send message",
    contentSource: "4tunhub@gmail.com (CONTACT_EMAIL); LinkedIn/GrabCAD/WhatsApp; Dschang.",
    dependencies: ["Form handler / email endpoint (post-local)"],
    acceptance: [
      "Form validates required fields and shows inline errors",
      "No personal data placed in URL/query strings",
      "Clear success state after submit",
      "48-hour response commitment is visible",
    ],
  },
  {
    key: "academy",
    route: "/academy",
    title: "Academy",
    priority: "P1",
    objective:
      "Present technical training and courses, and capture enrollment interest.",
    audience: "Students, junior engineers, and professionals upskilling in CAD/FEA/energy.",
    sections: [
      "Hero — learn engineering that ships",
      "Catalog — tracks/courses (SolidWorks/CAD, FEA, energy systems)",
      "Formats — online, in-person, workshops",
      "Instructor credibility — links to /about/founder",
      "Enrollment CTA — join / waitlist",
    ],
    primaryCTA: "Browse courses / Join a workshop",
    contentSource: "CAD training, SolidWorks workshops, mechanical tutoring.",
    dependencies: ["Course data model", "/about/founder"],
    acceptance: [
      "Each course states level, format, and outcome",
      "A clear enrollment or waitlist action exists per course",
    ],
  },
  {
    key: "research",
    route: "/research",
    title: "Research",
    priority: "P1",
    objective:
      "Establish 4TUN Hub's R&D and thought leadership in renewable energy and sustainability.",
    audience: "Researchers, partners, students, and industry followers.",
    sections: [
      "Hero — research with industrial purpose",
      "Focus areas — renewable energy, sustainability, industrial R&D",
      "Publications & newsletter — REM",
      "Initiatives",
      "Collaborate CTA",
    ],
    primaryCTA: "Collaborate on research → /contact",
    contentSource: "REM newsletter; sustainability projects; energy analysis work.",
    dependencies: ["Publication list"],
    acceptance: [
      "Each focus area explains why it matters and what's being done",
      "Newsletter/publication links resolve",
    ],
  },
  {
    key: "products",
    route: "/products",
    title: "Products",
    priority: "P1",
    objective:
      "Communicate the product vision and capture early interest before products ship.",
    audience: "Engineers, students, and companies who would use the tools.",
    sections: [
      "Hero — the product vision of 4TUN Hub",
      "Product cards — Educational Assistant, Digital Twin, Mechanical AI",
      "Status & roadmap — honest build stage per product",
      "Early-access CTA — waitlist",
    ],
    primaryCTA: "Join the waitlist",
    contentSource: "Product concepts as defined with Fortune.",
    dependencies: ["Waitlist capture"],
    acceptance: [
      "Each product states the problem it solves, who it's for, and its status",
      "No product is presented as available before it is",
    ],
  },
];

/* ---------------- Build roadmap ---------------- */

export type Phase = {
  id: string;
  name: string;
  status: "done" | "active" | "next" | "later";
  goal: string;
  items: string[];
};

export const phases: Phase[] = [
  {
    id: "0",
    name: "Foundation & design system",
    status: "done",
    goal: "One reusable visual language so nothing gets rebuilt later.",
    items: ["Brand tokens", "Typography & spacing", "Motion", "Core components"],
  },
  {
    id: "1",
    name: "Architecture & blueprint",
    status: "done",
    goal: "A precise, single-source-of-truth map anyone can execute from.",
    items: ["Information architecture", "Nav layering", "Per-page specs", "This blueprint"],
  },
  {
    id: "1.5",
    name: "Architectural optimization",
    status: "done",
    goal: "Strengthen the foundation before content — the approved Phase-1.5 review.",
    items: ["i18n (en→fr)", "CTA repositioning", "Trust hub", "Perf budgets", "Motion system", "Logo standards"],
  },
  {
    id: "2",
    name: "Homepage",
    status: "done",
    goal: "The first-impression that sets the tone every pillar inherits.",
    items: ["Hero + FEA schematic", "Trust strip", "Pillars", "Proof", "Founder", "Outlook", "Conversion"],
  },
  {
    id: "3",
    name: "Launch-critical pillars (P0)",
    status: "done",
    goal: "The pages required to go public credibly. Projects shipped first — Services leans on it for proof.",
    items: ["Projects (+ detail) ✓", "Services ✓", "About ✓", "Founder ✓", "Contact (+ form) ✓"],
  },
  {
    id: "4",
    name: "Fast-follow pillars (P1)",
    status: "done",
    goal: "Round out the ecosystem's core value.",
    items: ["Academy ✓", "Research ✓", "Products (+ detail) ✓"],
  },
  {
    id: "5",
    name: "Ecosystem growth (P2)",
    status: "done",
    goal: "Expand without redesign.",
    items: ["Resources ✓", "Community ✓", "Store ✓", "Blog ✓", "Careers ✓"],
  },
  {
    id: "6",
    name: "Hardening",
    status: "done",
    goal: "Make it unbreakable before it ships.",
    items: [
      "Responsive QA ✓",
      "Accessibility (AA) ✓",
      "Performance budget ✓ (enforced by the build gate)",
      "SEO/metadata ✓",
    ],
  },
  {
    id: "7",
    name: "Launch",
    status: "active",
    goal: "Public on Friday 25 September 2026.",
    items: [
      "Domain ✓",
      "Netlify + Resend ✓",
      "Email capture on every page ✓",
      "Cookieless analytics ✓ (needs its two env vars on the host)",
      "Deployed ✓ (pushed 2026-09-20)",
      "External design review actioned ✓",
      "Confirm the two LinkedIn company URLs",
      "Testimonials ✓ (three, named, with photographs)",
      "Talks & conferences on the founder page ✓",
    ],
  },
  {
    id: "8",
    name: "Cohort 0",
    status: "next",
    goal:
      "Turn the launch into twenty seated students and, by mid-November, the first real evidence 4TUN Hub has ever had: a pass rate and testimonials.",
    items: [
      "Ambassador programme (10, selected by a 48-hour task)",
      "Seven campaign cards, one a day ✓",
      "Applications close 11 October",
      "Eight sessions, 21 Oct – 13 Nov",
      "Results, testimonials, then Cohort 1 on evidence",
    ],
  },
];

/* ---------------- Decisions log ---------------- */

export type Decision = {
  decision: string;
  rationale: string;
  status: "locked" | "proposed";
};

export const decisions: Decision[] = [
  {
    decision:
      "Redesign (2026-09-19): light by day, dark by night, Apple-grade restraint. Supersedes the dark instrument panel.",
    rationale:
      "Fortune judged the dark instrument site unappealing and asked for a design that reads as world-class, not AI-generated. The clock (06:00–18:00 light) is now the default, with Auto/Light/Dark in the footer. Removed: the eight canvas fields, the flow-ramp gradient text, corner ticks, mono labels and the photo grading. Added: Instrument Sans as the one typeface, a white/#f5f5f7 page with black-and-grey type, pill controls, large rounded media, and real photographs shown as taken. docs/art-direction.md was rewritten to govern it.",
    status: "locked",
  },
  {
    decision: "Header nav limited to 6 items; everything else in the footer.",
    rationale:
      "All five reference companies (Lumafield, Augury, Machina Labs, Prevu3D, Instrumental) run tight nav. Full vision preserved via layering.",
    status: "locked",
  },
  {
    decision: "Products = software you use · Services = human consulting · Projects = proof.",
    rationale: "Removes the Solutions/Products/Services/Projects overlap so visitors never get lost.",
    status: "locked",
  },
  {
    decision: "Defer 'Solutions'.",
    rationale: "Industry-framed solutions only pay off once multiple products are live.",
    status: "locked",
  },
  {
    decision:
      "Commerce is a cross-cutting CAPABILITY, not a 'Store' page. A `purchasable` flag (+ price/format) can sit on any item in any pillar.",
    rationale:
      "Better than folding Store into one pillar: a paid e-book lives in Resources, a paid course in Academy, a product licence in Products — each sold in context. Nothing is empty at launch, you can sell the moment one item exists anywhere, and a future 'Store' is just an auto-generated view over everything flagged purchasable — zero redesign. Mirrors our data-driven model.",
    status: "locked",
  },
  {
    decision: "Logo is the official vector SVG (public/4tunhub-logo.svg).",
    rationale:
      "Crisp at any size; cropped to the wordmark with a transparent background so it sits flush in nav/footer.",
    status: "locked",
  },
  {
    decision: "Stack: Next.js 16 (App Router) + Tailwind v4; local-first until mature.",
    rationale: "SEO + reusable components + room for commerce/auth/courses without a rebuild.",
    status: "locked",
  },
  {
    decision:
      "Logo palette unified: 24 auto-traced colors reduced to 5 brand tokens (amber, ink, shadow gray, deep amber, white).",
    rationale:
      "The traced SVG carried 4 ambers, 3 blacks and 14 grays — invisible noise that reads as 'off' at a glance. Elite brands ship exact colors.",
    status: "locked",
  },
  {
    decision: "/blueprint is noindexed and disallowed in robots.txt.",
    rationale: "It is an internal build spec, not public content — it must never compete with real pages in search.",
    status: "locked",
  },
  {
    decision:
      "Official designed logo artwork (light + dark lockups) integrated, brand-tokenized, theme-swapping.",
    rationale:
      "Fortune supplied the designed vectors for both themes; backgrounds stripped, palette mapped to exact brand tokens per the unified-colors decision. The Logo component swaps automatically when a dark theme is active.",
    status: "locked",
  },
  {
    decision:
      "Enterprise backend machinery (microservices, queues, circuit breakers, distributed caching, load balancing) is DEFERRED until a real backend feature exists.",
    rationale:
      "The site is statically generated with no backend or users; a CDN already serves unlimited concurrent reads. Building scale machinery now is negative ROI. We keep cheap future-open conventions (stateless, API versioning, direction-agnostic CSS) and add the machinery only when a dynamic feature has real load. Approved by Fortune.",
    status: "locked",
  },
  {
    decision:
      "Trust signals are real-only. No fabricated sponsors, partners, awards or partnership-implying institution logos.",
    rationale:
      "Craft contract §1 and basic integrity. The footer trust hub ships as data-driven STRUCTURE; slots render only when populated with genuine, correctly-attributed facts. Founder affiliations are attributed to the founder, never implied as org-level partnerships. Approved by Fortune.",
    status: "locked",
  },
  {
    decision:
      "Canonical project case studies live in the founder portfolio (/about/founder/projects/[slug]). The /projects pillar, home and services proof cards all link INTO them; the founder portfolio never links back out to /projects.",
    rationale:
      "Fortune's direction: clicking a project anywhere redirects to the founder-portfolio version in the About section, not vice versa. Old /projects/[slug] route retired; one detail page per project, no duplicates.",
    status: "locked",
  },
  {
    decision:
      "An address can be left on every page (2026-09-20): a one-field waitlist block in the footer sitewide, and at the foot of Academy, Cohort 0, Research and the Blog.",
    rationale:
      "Most people who read a page on launch day are not ready to apply, and a visitor who leaves without leaving an address is gone for good. It posts to the same server action as /waitlist \u2014 one list, one pipeline \u2014 and the track is fixed by the page and named in the copy above the field, which is what keeps the consent honest when there are no checkboxes to tick. The Cohort 0 block matters most: twenty seats, and everyone who misses one is the warmest audience Cohort 1 will ever have.",
    status: "locked",
  },
  {
    decision:
      "Analytics is cookieless, provider-agnostic, and off until the host configures it (2026-09-20). Umami or Plausible, cloud or self-hosted, via ANALYTICS_PROVIDER + ANALYTICS_SITE_ID.",
    rationale:
      "Launch-day traffic is the one number that never comes back. Unset, no script loads and no third-party origin enters the CSP; set, next.config.ts adds that one origin to script-src and connect-src by itself. Cookieless is the constraint that keeps the privacy note true and means no consent banner. Three named conversions, none carrying anything personal: a waitlist signup, an application, a contact message. The privacy note was rewritten in both languages \u2014 it had promised no analytics at all.",
    status: "locked",
  },
  {
    decision:
      "Cohort 0 runs WITH the Douala City SOLIDWORKS User Group (2026-09-20): in English, on Bevy, and every participant who finishes receives a free CSWA exam voucher.",
    rationale:
      "The group has 483 members on SWUGN's own network, which turns launch day from a solo post into one with a real distribution list behind it. The voucher, confirmed by Fortune, removes the $99 objection that is the actual reason most students he teaches never sit the exam \u2014 it is now the strongest line in the offer, and a promise that has to arrive in November, when the same people are being asked for testimonials. The site was corrected end to end: language, platform, the exam card, the partnership under the title, and the Course JSON-LD.",
    status: "locked",
  },
  {
    decision:
      "A seat has conditions, stated on the page before the form asks for anything: join the SWUG on Bevy, follow it on LinkedIn, follow 4TUN Hub on LinkedIn and YouTube, then apply and send a screenshot of each membership.",
    rationale:
      "A free seat that costs nothing to claim is a seat someone does not show up for. The application form takes a LinkedIn profile, because that is what the two follows are checked against, and the confirmation screen asks for the screenshots while the applicant is still looking at it \u2014 an instruction buried in an email nobody opens is not an instruction. Screenshots come by email because the form takes no uploads.",
    status: "locked",
  },
  {
    decision:
      "The campaign cards are generated from the site (scripts/make-postcards.mjs), not designed in Canva. Seven cards, one a day, at 1080x1350 and 1080x1920.",
    rationale:
      "Same renderer as the site's own share card, so the type, the palette and the amber are the page's rather than an approximation of them. More importantly, several of the facts on those cards are still moving: a card that outlives its facts is worse than no card, and the whole set rebuilds in a minute. The PNGs are gitignored \u2014 they are output, the script is the source. Words in docs/cohort-0-campaign.md.",
    status: "locked",
  },
  {
    decision:
      "Ten ambassadors, selected by a 48-hour task rather than by interview, holding ten of the twenty Cohort 0 seats, on a four-week term.",
    rationale:
      "Fortune's idea, with one correction: an ambassador who is IN the cohort has something of their own to post every week, which beats anything written about the Hub from outside. Thirty warm candidates are invited directly and asked to share the launch post and send a screenshot within 48 hours; the ten who do it are in. That selects on the only trait that predicts survival \u2014 doing the thing \u2014 and costs no interviews. The reward costs no cash: a guaranteed seat and voucher, a name on the site, a signed letter of recommendation, reposts to the SWUG's 483, and first refusal on a free seat in the paid Cohort 1. Their reveal cards are the campaign, not overhead: ten people sharing a card with their own face on it reaches further than anything posted from one account.",
    status: "locked",
  },
  {
    decision:
      "External design review actioned (2026-09-20). Reviewer: a web designer and developer, a friend of Fortune's, on the live site.",
    rationale:
      "Verdict was that the design is strong; the fixes were specific. Actioned: the announcement ribbon is amber with ink type instead of a grey surface bar; the hero fan is five machines with the founder's portrait removed; the exam voucher was lifted out of a list into its own band; the screenshots step became a page; the Powered by Netlify badge was switched off in the Netlify project (a hosting setting, not code — it is injected at the edge). Raised and NOT yet done, because each needs content that does not exist yet: a testimonial on the landing page (structure shipped, empty), the founder's conferences and a post per conference for SEO, short video, and a general pass on hierarchy. The reviewer's instinct about the founder appearing twice matched the org-first positioning exactly, which is why it was taken as written.",
    status: "locked",
  },
  {
    decision:
      "Amber is the site's one loud colour, and it is spent in exactly two places: the Cohort 0 ribbon and the exam-voucher band.",
    rationale:
      "The palette comment has always said the brand amber is a fill, never small text on white. Used as a fill with ink-900 type it measures 9.2:1 and carries the same colours in both themes, which is right for the two things on the site that are time-limited and must not be skipped: the deadline, and the $99 the cohort removes. Spending it anywhere else would make both of them ordinary.",
    status: "locked",
  },
  {
    decision:
      "The home page hero is five machines. The founder appears once on the page, below the work, as the proof behind it.",
    rationale:
      "His portrait held the fifth slot in the hero fan AND the founder teaser lower down. Two photographs of the same man on one page reads as a personal portfolio, which is the single thing the ecosystem positioning cannot afford — and the per-page spec already says the founder teaser is one line that links into /about, never the headline. The FSAE car took the empty slot.",
    status: "locked",
  },
  {
    decision:
      "Three real testimonials shipped on the home page (2026-09-20): Mikel K. Ngueajio, Tanga Jatsa Lewouhdem Fran\u00e7oise Maelle and Tatsinda Mathias Allan — named, photographed, and each carrying the role that makes the quote mean something.",
    rationale:
      "Collected by Fortune the day the reviewer asked for them, which is how fast this can move when the community is real. The card shows ONE sentence, taken whole from the top of what each person wrote, because a card is read in two seconds and three paragraphs on it are three paragraphs nobody finishes; the complete statement is kept in `full` so shortening the card never loses the words. ONE edit was made and is recorded in the file rather than hidden: all three wrote \u201cFortune Hub\u201d, the name people use for him rather than the organisation's, and it is printed as \u201c4TUN Hub\u201d. Worth confirming that substitution with each of them.",
    status: "locked",
  },
  {
    decision:
      "Talks & conferences on the founder page: twelve public sessions, each linked to the page that proves it.",
    rationale:
      "The reviewer's strongest SEO point, and it turned out to be the most under-used asset on the whole site. Eleven SOLIDWORKS sessions on SWUGN's network — CSWA, CSWP mechanical design, CSWP sheet metal, CSWE, topology optimisation, assembly modelling, essentials, AFRISWUG, plus chapters in Mansoura, Benin and Buea — and the African Young Generation in Nuclear panel on the nuclear fuel cycle, alongside Eskom's Koeberg station, Malawi's regulator and R\u00f6ssing Uranium. `role` distinguishes what he organised from what he co-hosted from what he was invited onto, because claiming the wrong one is what a peer in the same network notices first. Dates are left blank rather than guessed: SWUGN's list view does not carry them and a wrong year is worse than no year. Next, and it needs his writing rather than code: a post per session, which is what turns twelve titles into twelve indexable pages.",
    status: "locked",
  },
  {
    decision:
      "Testimonials ship as empty structure, and the section renders nothing until there are real, named quotes.",
    rationale:
      "Same rule as the trust hub: real-only, no composites, no representative quotes. The reviewer is right that voices build credibility, and the honest sources exist — members of the 483-strong SWUG and the WhatsApp community can speak to the group today, and Cohort 0's participants will speak to the teaching in November with a pass rate attached. An empty frame is better than an invented quote, and a fabricated one is the mistake an engineer in the same city spots first.",
    status: "locked",
  },
  {
    decision:
      "Handing in the two membership screenshots is a page (/academy/cohort-0/screenshots), not a mailto: link.",
    rationale:
      "A mailto opens nothing on a phone with no mail client, and even where it works the applicant faces an empty message with no idea what counts as proof. The page shows what each screenshot must contain, links to the two places to get them, pre-writes the email, and states the deadline and the name rule. It is also a URL that can be pasted into WhatsApp, which is where this conversation actually happens. Noindexed: it is one step for one person at one moment.",
    status: "locked",
  },
  {
    decision:
      "The launch date holds at Friday 25 September; the APPLICATION WINDOW is what moves. Applications close Sunday 11 October, the cohort runs 21 October to 13 November, results mid-November.",
    rationale:
      "Fortune was right that six days was too short \u2014 four hoops stand in front of that form, and ambassador recruitment had nowhere to live. But the thing to move is the deadline, not the launch: the site is ready, the partnership is real, the cards exist, and 'more time to prepare before anyone sees it' is the exact shape of the twelve scripts written and never shipped. Three and a half weeks of promotion instead of six days, ambassadors recruited OUT of the launch instead of before it, rolling selection to keep urgency in a longer window, and Cohort 1 still opens in January.",
    status: "locked",
  },
  {
    decision:
      "Every section on a page carries symmetric vertical padding (py-24 sm:py-32). A section may not use pb- alone and lean on its neighbour for the space above it.",
    rationale:
      "The home page's founder card was the one exception, and it showed: with no top padding it sat flush against the grey testimonials band and floated over 128px of emptiness below, so the gap read as a hole punched under the card rather than as rhythm. Fortune drew the two band edges and asked for the card centred between them, which is what symmetric padding gives for free. Borrowing space from the section above only looks right until that section's padding changes, and it hides the real spacing in a file the reader is not looking at.",
    status: "locked",
  },
];

/* ============================================================
   LOGO STANDARDS (R4) — the brand-mark contract.
   ============================================================ */

export type LogoFormat = {
  format: string;
  use: string;
  verdict: "primary" | "raster-only" | "avoid";
};

export const logoFormats: LogoFormat[] = [
  { format: "SVG", use: "The logo, everywhere — nav, footer, hero, mark", verdict: "primary" },
  { format: "PNG", use: "Apple touch icon; OG raster fallback only", verdict: "raster-only" },
  { format: "WebP", use: "Only if a raster lockup is ever unavoidable", verdict: "raster-only" },
  { format: "AVIF", use: "Photographic OG art only — never the logo", verdict: "avoid" },
];

export const logoRules: Rule[] = [
  { t: "SVG is the logo", d: "Pure vector: infinite scale, crisp at every density, tiny file, animatable. Raster is favicon/OG only." },
  { t: "Two lockups, one component", d: "Light + dark artwork, brand-tokenized, transparent. <Logo> swaps under `.dark` automatically." },
  { t: "Mark for tight spaces", d: "variant=\"mark\" is the amber roundel (public/4tunhub-mark.svg) — favicons, avatars, narrow screens." },
  { t: "Fixed sizes, a real floor", d: "sm 28px (minimum — never smaller) · md 36px (nav/footer) · lg 48px (hero). No arbitrary heights." },
  { t: "Clear-space", d: "Leave ≥ the roundel's radius of empty space on all sides. The logo never touches text or edges." },
  { t: "Hover & focus", d: "As a home link: a subtle opacity dip on hover, a visible focus ring. Never stretch, recolor, or rotate the artwork." },
  { t: "Always named", d: "Every instance carries aria-label \"4TUN Hub — home\" (link) or alt \"4TUN Hub\" (image)." },
];

/* ============================================================
   OPTIMIZATION REVIEW (Phase 1.5) — approved 2026-07-18.
   The prioritized register from the architectural review.
   Progress is tracked on `status`.
   ============================================================ */

export type ReviewPriority = "Critical" | "High" | "Medium" | "Defer";
export type Effort = "XS" | "S" | "M" | "L";
export type RecStatus = "approved" | "in-progress" | "done" | "deferred";

export type Recommendation = {
  id: string;
  area: string;
  priority: ReviewPriority;
  effort: Effort;
  problem: string;
  solution: string;
  impact: string;
  tradeoff: string;
  status: RecStatus;
};

/** The four strategic challenges that framed the review. */
export const reviewChallenges: Rule[] = [
  {
    t: "'One million users' is the wrong target today",
    d: "A static, backend-less site on a CDN already serves unlimited concurrent reads. Microservices / queues / circuit breakers solve problems we cannot have until a dynamic backend exists. Stay static + edge-cacheable; adopt only cheap future-open conventions now.",
  },
  {
    t: "A trust hub can't fabricate credibility",
    d: "Sponsors, awards and partner logos we don't have would be fabrication (craft §1). Build the structure; populate real-only; attribute founder affiliations to the founder, never as org partnerships.",
  },
  {
    t: "Animated backgrounds were the highest-risk item — revisited",
    d: "The original call was one restrained motif: multiple per-section engines threatened the perf budget AND risked reading as generic tech-startup noise. Deliberately superseded — eight fields now ship, one per context. Both risks were answered rather than assumed away. Payload: the simulations are dynamically imported so they never sit on the critical path — 205.8 KB of a 220 KB budget, +7.3 KB for all eight, versus 20 KB+ for any particle library. Noise: each field is the actual phenomenon its page is about (CFD flow on home, load paths on services, branching biomass on the shredder case study), so it argues for the work instead of decorating it. Contrast over every field is measured against real canvas pixels, the loop stops offscreen and on tab-hide, and reduced motion renders a still frame.",
  },
  {
    t: "Only i18n is expensive to retrofit",
    d: "Don't block all content behind all 14 workstreams. Locale routing must be set up before content multiplies; everything else layers in progressively alongside real pages.",
  },
];

export const optimizationReview: Recommendation[] = [
  {
    id: "R1",
    area: "Internationalization (en → fr)",
    priority: "Critical",
    effort: "M",
    problem: "No locale system; retrofitting routing + SEO after content exists means rewriting every route.",
    solution: "/[locale] routing (en default, fr), typed dictionaries, locale-aware metadata/hreflang, Intl date/number/currency (XAF/USD), pluralization. Manual FR copy only — no machine translation.",
    impact: "Unlocks the French market; prevents a costly future rewrite.",
    tradeoff: "Small per-string tax on every new copy block.",
    status: "done",
  },
  {
    id: "R2",
    area: "Primary CTA repositioning",
    priority: "Critical",
    effort: "S",
    problem: "The primary business action lived in the footer — lowest-visibility position on the page.",
    solution: "Three integrated placements: hero CTA + persistent nav CTA + a dedicated 'Start a project' section before the footer. Remove the footer CTA. No floating/adaptive gimmicks.",
    impact: "Direct conversion lift; action meets intent at every scroll depth.",
    tradeoff: "Uses nav real-estate (already allocated).",
    status: "in-progress",
  },
  {
    id: "R3",
    area: "Performance budgets as CI gates",
    priority: "High",
    effort: "S",
    problem: "Budgets are documented but not enforced — perf regresses silently.",
    solution: "performance-budgets.json (single source) + a build gate (scripts/check-bundle-size.mjs) that fails on JS regression, @next/bundle-analyzer (ANALYZE=true), and Lighthouse-CI (.lighthouserc.json) asserting LCP<2.5s / CLS<0.1 / TBT<200ms / scores at deploy.",
    impact: "Locks in performance permanently.",
    tradeoff: "Minor CI friction.",
    status: "done",
  },
  {
    id: "R4",
    area: "Logo asset system",
    priority: "High",
    effort: "S",
    problem: "One SVG in use, no documented standards.",
    solution: "SVG-primary policy; PNG only for favicon/Apple-touch/OG; <Logo> enforces sizes (sm/md/lg), full+mark variants, hover/focus, a11y name, light/dark swap. See blueprint §01.",
    impact: "Crisp, consistent brand at every density and surface.",
    tradeoff: "Minor asset upkeep.",
    status: "done",
  },
  {
    id: "R5",
    area: "Footer → trust hub (structure, real-only)",
    priority: "High",
    effort: "M",
    problem: "Footer was a long link list with no authority signals.",
    solution: "Data-driven affiliations / partners / awards / memberships; slots render only when populated with genuine, correctly-attributed facts.",
    impact: "Communicates credibility before it's consciously evaluated.",
    tradeoff: "Most slots stay empty until real — by design.",
    status: "in-progress",
  },
  {
    id: "R6",
    area: "Motion system formalization",
    priority: "High",
    effort: "M",
    problem: "Sweep + Reveal exist but there's no cohesive, documented motion language.",
    solution: "One spec: durations, curves, purpose-per-motion, enforced budget, reduced-motion everywhere.",
    impact: "Premium, handcrafted feel that stays consistent.",
    tradeoff: "Discipline overhead.",
    status: "approved",
  },
  {
    id: "R7",
    area: "SEO / AI-discovery depth",
    priority: "High",
    effort: "M",
    problem: "Org schema + sitemap done, but per-page schema, breadcrumbs and entity linking are missing.",
    solution: "Per-page metadata factory; Breadcrumb/Course/Article/Project schema; canonical per route; internal-link mesh; llms.txt for AI crawlers.",
    impact: "Stronger rankings and presence in AI answers.",
    tradeoff: "Content-gated — needs the pages.",
    status: "approved",
  },
  {
    id: "R8",
    area: "Design-token / system audit",
    priority: "Medium",
    effort: "S",
    problem: "Tokens are strong but a few raw values have slipped into components.",
    solution: "Enforced: scripts/check-design-tokens.mjs fails on raw hex / arbitrary font-size / arbitrary z-index. Added micro type-scale (text-3xs/2xs) + elevation tokens (shadow-e1/e2); z-scale finalized 0/10/40/50; 30 arbitrary sizes removed.",
    impact: "Total visual consistency.",
    tradeoff: "—",
    status: "done",
  },
  {
    id: "R9",
    area: "Accessibility formalization",
    priority: "Medium",
    effort: "S",
    problem: "Strong a11y but no automated audit.",
    solution: "axe-core in CI; focus-visible audit; form-error patterns; live-region conventions.",
    impact: "Inclusion, legal safety, and an SEO signal.",
    tradeoff: "—",
    status: "approved",
  },
  {
    id: "R10",
    area: "Living section backgrounds (superseded: EIGHT fields, not one motif)",
    priority: "Medium",
    effort: "M",
    problem: "Risk of over-animation degrading perf and craft.",
    solution: "The original call was one restrained motif. Superseded deliberately: eight canvas simulations ship, one per context, because a single motif repeated everywhere is the lattice problem again. Each field is the phenomenon its page is actually about, so it argues for the work rather than decorating it.",
    impact: "Distinct identity, and no two neighbouring pages share a background.",
    tradeoff: "Both original risks were answered, not assumed away. Perf: dynamically imported, off the critical path, +7.3 KB for all eight versus 20 KB+ for any particle library. Craft: contrast measured against real canvas pixels across 26 page loads; the field scrim now ships inside Field so it cannot be omitted.",
    status: "done",
  },
  {
    id: "R11",
    area: "Component architecture for scale",
    priority: "Medium",
    effort: "S",
    problem: "Fine today; needs guardrails as it grows.",
    solution: "Dynamic-import heavy client islands; server components stay default; formalize image (AVIF/WebP via next/image) + subset-font pipeline.",
    impact: "Sustained performance as the app expands.",
    tradeoff: "—",
    status: "approved",
  },
  {
    id: "R12",
    area: "Security posture for the dynamic era",
    priority: "Medium",
    effort: "S",
    problem: "Static-safe now; auth/forms will change the threat model.",
    solution: "Activated with the Contact form: server-side validation of every field, honeypot, per-IP rate limiting, generic error codes (no internals leaked), framework CSRF origin checks. Delivery is a single integration point (deliverMessage) for post-local wiring.",
    impact: "The first dynamic surface ships hardened; a reusable pattern for future forms/auth.",
    tradeoff: "—",
    status: "done",
  },
  {
    id: "R13",
    area: "Backend scale machinery",
    priority: "Defer",
    effort: "L",
    problem: "Microservices/queues/circuit-breakers/load-balancing for a site with no backend.",
    solution: "DEFER. Adopt only stateless + API-versioning conventions now; build machinery at the first real backend feature.",
    impact: "Avoids months of over-engineering.",
    tradeoff: "Revisit trigger: first dynamic feature with real load.",
    status: "deferred",
  },
  {
    id: "R14",
    area: "RTL support",
    priority: "Defer",
    effort: "XS",
    problem: "No RTL language is planned.",
    solution: "Don't build RTL; just stay direction-agnostic (CSS logical properties: ms/me, not ml/mr).",
    impact: "Cheap future-proofing.",
    tradeoff: "—",
    status: "deferred",
  },
];

/* ============================================================
   PRECISION & POSITIONING — the geometry contract.
   Nothing on any page may violate these numbers.
   ============================================================ */

export type Rule = { t: string; d: string };

export const precisionRules: Rule[] = [
  {
    t: "4px base unit — no arbitrary values",
    d: "Every margin, padding, gap and size is a multiple of 4px. Allowed spacing steps: 4, 8, 12, 16, 20, 24, 32, 48, 64, 80, 96, 112px. If a value isn't on the scale, it doesn't ship.",
  },
  {
    t: "One container, one measure",
    d: "All content lives in Container: max-width 1152px (max-w-6xl), padding 24px mobile / 32px ≥640px. Body text never exceeds ~65ch; section intros are capped at max-w-2xl.",
  },
  {
    t: "12-column mental grid",
    d: "Cards span 12 (mobile), 6 (sm) or 4 (lg) columns. Grid gaps are 20px (gap-5) or 24px (gap-6) — never mixed within one section.",
  },
  {
    t: "Vertical rhythm",
    d: "Sections breathe at py-80px (py-20) mobile, py-112px (sm:py-28) up. Heading stack is fixed: eyebrow → mt-12px title → mt-16px intro → mt-32/40px content.",
  },
  {
    t: "Line-height on the 4px grid",
    d: "Leading values are multiples of 4px (20/24/28/32/40). Baselines of adjacent columns align at section top.",
  },
  {
    t: "Radius scale",
    d: "Corners: 8px (inputs/small), 12px (chips), 14px (lg), 20px (xl), 28px (2xl, hero cards). One radius per component family — never per instance.",
  },
  {
    t: "Z-index scale",
    d: "Only 0 (content), 10 (dropdowns), 40 (sticky nav / mobile panel), 50 (skip-link / modals — tops everything). No arbitrary z-[..].",
  },
  {
    t: "Two shadows, two type-floor tokens",
    d: "Elevation is shadow-e1 (resting) or shadow-e2 (raised/hover) — nothing else. Micro labels use text-3xs (10px) / text-2xs (11px); never arbitrary text-[..px]. Enforced by `npm run lint:tokens`.",
  },
  {
    t: "Optical alignment over mathematical",
    d: "Icons align to text cap-height, not bounding box. Numbers in stat displays use tabular-nums so digits never shift. Amber dots center on the x-height of their label.",
  },
  {
    t: "Touch targets",
    d: "Every interactive element is ≥44×44px on touch screens. Focus rings are 2px brand-500 with 2px offset — always visible, never removed.",
  },
];

/* ============================================================
   CRAFT & ART DIRECTION — the anti-generic contract.
   The site must read as engineered by hand, not generated.
   ============================================================ */

export const craftRules: Rule[] = [
  {
    t: "Real work, not stock",
    d: "Every visual comes from actual 4TUN Hub output: FSAE CAD renders, FEA stress plots, the shredder build, CAMRAIL context — or custom diagrams drawn in the brand style. Stock photos and generic 3D illustrations are banned.",
  },
  {
    t: "Specificity over superlatives",
    d: "Banned words: 'world-class', 'cutting-edge', 'seamless', 'innovative solutions', 'unlock', 'empower'. Required instead: numbers, names, places — 319B FCFA rail modernization, 560+ km of track, Douala, ENSET, 8-subsystem FSAE design.",
  },
  {
    t: "Typographic finish",
    d: "Real apostrophes (') and em-dashes (—), sentence-case headings, no orphan words in headlines (balance manually), tabular numerals in data, no double spaces. Details a reader feels without seeing.",
  },
  {
    t: "Composition variety",
    d: "Adjacent sections never share the same layout skeleton. Alternate: full-bleed band → asymmetric split → card grid → editorial column. Intentional asymmetry beats centered-everything.",
  },
  {
    t: "One signature motion",
    d: "The amber underline-sweep on links and CTAs is the brand's one memorable move. Everything else: fades ≤700ms on the quart curve, 16px max translate, nothing bounces, nothing loops, reduced-motion always respected.",
  },
  {
    t: "A human voice",
    d: "Microcopy sounds like Fortune: first person, direct, technically confident. No emoji in UI. No exclamation marks in headings. Lorem ipsum never ships — placeholder pages say plainly what is coming.",
  },
  {
    t: "Engineering texture",
    d: "Depth comes from the discipline itself: fine blueprint-grid backgrounds, measured drop shadows (like the logo's), mono-font data labels, dimension-line motifs — never default component-library gloss.",
  },
];

/* ============================================================
   SECURITY — the trust contract.
   Implemented items are marked ✓ IMPLEMENTED.
   ============================================================ */

export const securityRules: Rule[] = [
  {
    t: "Hardened HTTP headers — ✓ IMPLEMENTED",
    d: "next.config.ts ships HSTS (2y, preload), X-Frame-Options DENY, nosniff, strict-origin-when-cross-origin referrer, minimal Permissions-Policy, and a production CSP (default-src 'self', frame-ancestors 'none', object-src 'none'). poweredByHeader off.",
  },
  {
    t: "Forms assume hostility",
    d: "Contact form: server-side validation of every field, honeypot field, rate limiting per IP, generic error messages (never echo internals). Client validation is UX only — the server is the gate.",
  },
  {
    t: "Privacy by architecture",
    d: "No PII ever appears in URLs or query strings. Analytics (if added) must be cookieless and consent-respecting. The résumé PDF is served statically — no upload paths exist.",
  },
  {
    t: "Secrets hygiene",
    d: "All secrets live in environment variables (.env.local, gitignored). Nothing sensitive is ever committed; keys are separate per environment and rotatable.",
  },
  {
    t: "Supply-chain discipline",
    d: "package-lock.json is committed; npm audit runs before every deploy; framework upgrades are deliberate and read release notes first. No script tags from third-party CDNs.",
  },
  {
    t: "Fail without leaking",
    d: "Custom 404/500 pages in the brand voice; stack traces never reach users; external links carry rel='noopener noreferrer'.",
  },
  {
    t: "Future auth & commerce",
    d: "When accounts/payments arrive: authorization checked server-side per request, least privilege, payments via a hosted provider (Stripe-class) — card data never touches our servers.",
  },
];

/* ============================================================
   SEO — the discoverability contract.
   Goal: own engineering queries for Cameroon, then wider.
   ============================================================ */

export const seoRules: Rule[] = [
  {
    t: "Single source of truth feeds search — ✓ IMPLEMENTED",
    d: "sitemap.xml is generated from src/lib/sitemap.ts (active routes only); robots.txt allows all but /blueprint (noindexed internal spec). The nav and the crawler can never disagree.",
  },
  {
    t: "Structured data — ✓ IMPLEMENTED",
    d: "Organization + founder Person JSON-LD sitewide (name, Dschang address, expertise). As pillars ship: Course schema (Academy), Article (Research/Blog), Product (Products), CreativeWork (Projects).",
  },
  {
    t: "Metadata discipline — ✓ IMPLEMENTED",
    d: "metadataBase + title template + per-page unique titles/descriptions, OpenGraph and Twitter cards. Every page exports its own metadata — enforced by the add-a-page recipe.",
  },
  {
    t: "Semantic skeleton",
    d: "Exactly one h1 per page; landmarks (header/main/footer/nav); descriptive alt text on every image; kebab-case descriptive URLs (/projects/banana-pseudostem-shredder, never /p?id=7).",
  },
  {
    t: "One page, one query",
    d: "Each pillar owns a primary query: Services → 'mechanical engineering services Cameroon'; Academy → 'SolidWorks training Cameroon'; Research → 'renewable energy Cameroon'; Projects → long-tail engineering case studies. Home owns the brand.",
  },
  {
    t: "E-E-A-T is our moat",
    d: "Google rewards demonstrated experience: real projects with real outcomes, the founder's verifiable roles (CAMRAIL, ENSET, Dschang), consistent name-address-email across the web, and outbound links to legitimate institutions.",
  },
  {
    t: "Performance is ranking",
    d: "Core Web Vitals are an SEO budget, not just UX: LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-tier mobile. Static generation everywhere; images sized and lazy; fonts subset via next/font.",
  },
  {
    t: "Internal link mesh",
    d: "Every project links to the service that produced it; every service cites proof projects; the founder page links outward to every pillar. No orphan pages — ever.",
  },
];

/* ============================================================
   SCORECARD — honest 0–100 per aspect, current vs target.
   Updated at every major milestone. No vanity numbers:
   unbuilt content scores low because it should.
   ============================================================ */

export type Score = {
  aspect: string;
  current: number;
  target: number;
  note: string;
};

export const scorecard: Score[] = [
  { aspect: "Information architecture", current: 98, target: 98, note: "AT TARGET. Data-driven, layered, all decisions locked. Commerce encoded as a capability (lib/commerce.ts) — Store is a deferred view, not a silo." },
  { aspect: "Brand & logo", current: 96, target: 96, note: "AT TARGET. Dark is the only theme, so the dark lockup IS the lockup — the dead theme-swap and its duplicate hidden img are gone. Official artwork, brand-tokenized, transparent; favicon shipped." },
  { aspect: "Color system", current: 97, target: 97, note: "AT TARGET, re-verified after the dark-first inversion. The light palette is gone; every semantic pair re-measured on the near-black ground — foreground 17.1:1, muted 7.4:1, accent 12.2:1, primary 10.8:1, primary-foreground on amber 10.6:1. Third-party mark colours (LinkedIn, Gmail) are a bounded exception, confined to their own icons and held to WCAG 1.4.11 3:1 for non-text graphics." },
  { aspect: "Typography", current: 95, target: 95, note: "AT TARGET. Fluid display scale shipped sitewide: display-lg 52-136px held for short statements, display 44-88px for page H1, display-sm 36-52px for section H2, tracking tightening as size grows. Weight and tracking live in the tokens, so no utility fights them. Balanced headlines, orphan-free body, tabular numerals." },
  { aspect: "Layout precision", current: 98, target: 98, note: "AT TARGET. All values on the 4px scale; container measured at exactly 1152px; zero horizontal overflow at any width." },
  { aspect: "Components", current: 96, target: 96, note: "AT TARGET. Primitives now include Field (one canvas engine, eight renderers) and Counter, plus the .plate image treatment and its .plate-doc document variant. The field scrim ships INSIDE Field, so no caller can render a background without its contrast protection." },
  { aspect: "Motion", current: 94, target: 94, note: "AT TARGET, rescoped. Eight canvas field simulations, one per context, dynamically imported so they never touch the critical path. Each pauses offscreen and on tab-hide (verified by frame hashing, not assumed) and renders a still frame under reduced motion. Figures count up from a server-rendered final value. Signature amber sweep retained." },
  { aspect: "Craft / art direction", current: 95, target: 97, note: "Redesigned 2026-09-19 (docs/art-direction.md governs): light by day and dark by night on the visitor's clock, one typeface, quiet white and grey surfaces, pill controls, large rounded media, and real photographs shown as taken. Remaining: professional photography of the machines, and vector logo assets for the affiliations row." },
  { aspect: "Responsiveness", current: 98, target: 98, note: "AT TARGET. Verified at 360 / 636 / 768 / 1024 / 1440 / 1920 — no overflow, no wraps; mobile nav panel shipped." },
  { aspect: "Accessibility", current: 97, target: 97, note: "AT TARGET. Programmatic re-audit after the inversion and the animated backgrounds: 3,891 text runs across 26 page loads (20 EN routes + 6 FR), each measured against the REAL composited background including live canvas pixels, worst-pixel not average. Zero contrast failures; worst passing run 5.35:1. Single h1 and no heading skips on every page; zero images without alt; zero controls without an accessible name. Two genuine failures found and fixed in this pass — see Craft." },
  { aspect: "Performance", current: 97, target: 97, note: "AT TARGET (pre-deploy). Budgets ENFORCED by the build gate: 205.8 KB of a 220 KB gzip budget, largest chunk 69.3 KB of 90 KB. All eight field simulations together cost 7.3 KB over the pre-field baseline because they are dynamically imported rather than bundled. Routes static; fonts subset. Lighthouse-CI runs at deploy." },
  { aspect: "SEO", current: 92, target: 97, note: "Infrastructure 100% — sitemap/robots/schema graph/OG image (verified 200 png)/canonical. Every primary pillar now has a real, indexable, bilingual page with per-page metadata + canonical (pre-launch product detail + placeholders stay noindex). Final points require live domain + inbound signals." },
  { aspect: "Security", current: 96, target: 96, note: "AT TARGET. Headers verified live, leak-free branded 404/500, no secrets. Contact form (R12) hardened: server-side validation of every field, honeypot, per-IP rate limiting, generic error codes, framework CSRF origin checks. Delivery endpoint live (Resend, keyed on the host); every form fails loudly rather than dropping a submission silently. Remaining pre-launch: security.txt." },
  { aspect: "Content depth", current: 94, target: 95, note: "Every primary pillar ships, bilingual, plus Resources, Community and Store. Three named testimonials with photographs on the home page, and twelve public talks on the founder page, each linked to its own event. Remaining: deeper per-item copy, a post per talk (the SEO lever), and Blog and Careers, which are still honest placeholders." },
  { aspect: "Documentation", current: 99, target: 99, note: "AT TARGET. v1.5 (2026-09-20, after the review and the first real testimonials) — current with every locked decision and verified number. Phases 6 and 7 closed out; Cohort 0 opened as phase 8. The launch, the partnership, the ambassador programme and the revised window are in the decision log; the campaign itself is docs/cohort-0-campaign.md, the plan of record docs/launch-plan.md." },
];
