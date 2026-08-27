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
      "Direct channels — email, LinkedIn, WhatsApp, location (Douala, Cameroon)",
      "Response SLA — within 48 hours",
    ],
    primaryCTA: "Send message",
    contentSource: "fortunedonfack05@gmail.com; LinkedIn/GrabCAD/WhatsApp; Douala.",
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
    status: "next",
    goal: "Expand without redesign.",
    items: ["Resources", "Community", "Blog", "Store", "Careers"],
  },
  {
    id: "6",
    name: "Hardening",
    status: "later",
    goal: "Make it unbreakable before it ships.",
    items: ["Responsive QA", "Accessibility (AA)", "Performance budget", "SEO/metadata"],
  },
  {
    id: "7",
    name: "Launch",
    status: "later",
    goal: "Only after the experience is mature.",
    items: ["Buy domain", "Connect infra", "Deploy", "Go live"],
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
    t: "Animated backgrounds are the highest-risk item",
    d: "Seven per-section animation engines threaten the perf budget AND read as generic tech-startup noise — the opposite of engineering restraint. One restrained, GPU-cheap motif, disciplined, reduced-motion-safe.",
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
    area: "Living section backgrounds (ONE motif)",
    priority: "Medium",
    effort: "M",
    problem: "Risk of over-animation degrading perf and craft.",
    solution: "A single restrained grid/kinetic motif, GPU-cheap, theme-aware, reduced-motion off.",
    impact: "Distinct identity without noise.",
    tradeoff: "Requires ongoing perf vigilance.",
    status: "approved",
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
    d: "Organization + founder Person JSON-LD sitewide (name, Douala address, expertise). As pillars ship: Course schema (Academy), Article (Research/Blog), Product (Products), CreativeWork (Projects).",
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
    d: "Each pillar owns a primary query: Services → 'mechanical engineering services Cameroon'; Academy → 'SolidWorks training Douala'; Research → 'renewable energy Cameroon'; Projects → long-tail engineering case studies. Home owns the brand.",
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
  { aspect: "Brand & logo", current: 96, target: 96, note: "AT TARGET. Official designed artwork integrated in both themes, brand-tokenized, transparent, theme-swapping; favicon shipped." },
  { aspect: "Color system", current: 97, target: 97, note: "AT TARGET. Programmatic WCAG audit: 11 key pairs all ≥5.29:1 (AA), most AAA. Eyebrow/label tokens corrected to passing shades." },
  { aspect: "Typography", current: 95, target: 95, note: "AT TARGET. Balanced headlines (text-wrap:balance), orphan-free body (pretty), tabular numerals, scale enforced." },
  { aspect: "Layout precision", current: 98, target: 98, note: "AT TARGET. All values on the 4px scale; container measured at exactly 1152px; zero horizontal overflow at any width." },
  { aspect: "Components", current: 95, target: 95, note: "AT TARGET. 12 primitives: + MobileNav, NavLink (sweep/aria-current), InputField, TextareaField, Badge, Stat, Reveal." },
  { aspect: "Motion", current: 92, target: 92, note: "AT TARGET. Signature amber sweep live (hover/focus/active-page); scroll Reveal; press states; reduced-motion doubly guarded." },
  { aspect: "Craft / art direction", current: 92, target: 97, note: "Homepage shipped with a bespoke FEA-cantilever hero schematic (no stock), real content (CAMRAIL 319B FCFA, FSAE, pseudostem shredder), specificity over superlatives. Founder-portfolio projects now show real CAD drawings, FEA plots and build photos throughout. Remaining: real photography on the remaining pillar pages." },
  { aspect: "Responsiveness", current: 98, target: 98, note: "AT TARGET. Verified at 360 / 636 / 768 / 1024 / 1440 / 1920 — no overflow, no wraps; mobile nav panel shipped." },
  { aspect: "Accessibility", current: 96, target: 96, note: "AT TARGET. Skip link (first tab stop), aria-current/expanded/controls, Escape handling, AA contrast audit passed, focus rings, landmarks." },
  { aspect: "Performance", current: 97, target: 97, note: "AT TARGET (pre-deploy). Budgets now ENFORCED: build gate fails on JS regression (today 188KB/220KB gzip). 11 routes static; fonts subset. Lighthouse-CI runs at deploy." },
  { aspect: "SEO", current: 92, target: 97, note: "Infrastructure 100% — sitemap/robots/schema graph/OG image (verified 200 png)/canonical. Every primary pillar now has a real, indexable, bilingual page with per-page metadata + canonical (pre-launch product detail + placeholders stay noindex). Final points require live domain + inbound signals." },
  { aspect: "Security", current: 96, target: 96, note: "AT TARGET. Headers verified live, leak-free branded 404/500, no secrets. Contact form (R12) hardened: server-side validation of every field, honeypot, per-IP rate limiting, generic error codes, framework CSRF origin checks. Remaining pre-launch: security.txt + real delivery endpoint." },
  { aspect: "Content depth", current: 92, target: 95, note: "Every primary pillar now ships, bilingual: Home, Products, Services, Academy, Research, Projects (6, full documentation sets), About + full Founder page, Contact (+form). Academy states level/format/outcome + a waitlist action per course; Research gives why-it-matters + what-we're-doing per focus area with resolving REM/Medium/LinkedIn links; Products states problem/who/status per product and never presents an unshipped product as available. P0 + P1 page set complete. Remaining: deeper per-item copy and the deferred footer pillars (Resources, Community, Store, Blog, Careers)." },
  { aspect: "Documentation", current: 99, target: 99, note: "AT TARGET. v1.2 — current with every locked decision and verified number." },
];
