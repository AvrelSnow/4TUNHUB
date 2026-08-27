/**
 * ============================================================
 * 4TUN HUB — INFORMATION ARCHITECTURE (single source of truth)
 * ============================================================
 * The full ecosystem vision, tagged by launch status and by
 * where each node lives (header vs footer). The /blueprint page
 * renders this; navigation reads the primary set from here too.
 *
 * status:
 *   active   = real content exists / launches first
 *   building = product being developed, shown as "coming"
 *   planned  = part of the long-term ecosystem, not built yet
 *
 * placement:
 *   primary  = appears in the top navigation bar (keep to ~6)
 *   footer   = appears in the footer / utility nav
 *   utility  = contact / legal style links
 * ============================================================
 */

export type NodeStatus = "active" | "building" | "planned";
export type Placement = "primary" | "footer" | "utility";

export type SiteNode = {
  key: string;
  label: string;
  href: string;
  status: NodeStatus;
  placement?: Placement;
  desc?: string;
  children?: SiteNode[];
};

export const siteTree: SiteNode[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    status: "active",
    placement: "primary",
    desc: "The ecosystem in five seconds: who 4TUN Hub is and the value it creates.",
  },
  {
    key: "products",
    label: "Products",
    href: "/products",
    status: "building",
    placement: "primary",
    desc: "Software & AI 4TUN Hub is building. Things you use or buy.",
    children: [
      {
        key: "edu-assistant",
        label: "Cameroon Educational Assistant",
        href: "/products/educational-assistant",
        status: "building",
        desc: "AI tutor tailored to the Cameroonian engineering curriculum.",
      },
      {
        key: "digital-twin",
        label: "Digital Twin Platform",
        href: "/products/digital-twin",
        status: "planned",
        desc: "3D digital-twin tooling for industrial facilities & equipment.",
      },
      {
        key: "mech-ai",
        label: "Mechanical AI Assistant",
        href: "/products/mechanical-ai",
        status: "planned",
        desc: "AI copilot for mechanical design, FEA and calculations.",
      },
      {
        key: "future-products",
        label: "Future Products",
        href: "/products#future",
        status: "planned",
        desc: "New tools slot in here without a redesign.",
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    href: "/services",
    status: "active",
    placement: "primary",
    desc: "Engineering consulting: mechanical design, FEA simulation, renewable-energy systems.",
  },
  {
    key: "academy",
    label: "Academy",
    href: "/academy",
    status: "active",
    placement: "primary",
    desc: "Technical training, CAD/SolidWorks workshops, courses & professional development.",
  },
  {
    key: "research",
    label: "Research",
    href: "/research",
    status: "active",
    placement: "primary",
    desc: "Renewable energy, sustainability, R&D initiatives and publications.",
  },
  {
    key: "projects",
    label: "Projects",
    href: "/projects",
    status: "active",
    placement: "primary",
    desc: "Engineering portfolio & case studies — the proof behind the ecosystem.",
  },
  {
    key: "solutions",
    label: "Solutions",
    href: "/solutions",
    status: "planned",
    placement: "footer",
    desc: "Industry-framed outcomes (energy, manufacturing, education). Deferred until multiple products exist.",
  },
  {
    key: "resources",
    label: "Resources",
    href: "/resources",
    status: "planned",
    placement: "footer",
    desc: "E-books, templates, engineering references & downloadable tools.",
  },
  {
    key: "community",
    label: "Community",
    href: "/community",
    status: "planned",
    placement: "footer",
    desc: "Engineers, students & partners — forums, events, collaboration.",
  },
  {
    key: "blog",
    label: "Blog",
    href: "/blog",
    status: "planned",
    placement: "footer",
    desc: "Engineering insight, project write-ups & thought leadership.",
  },
  {
    key: "store",
    label: "Store",
    href: "/store",
    status: "planned",
    placement: "footer",
    desc: "Not a silo — a deferred aggregated view over every item flagged `purchasable` across the pillars. Commerce lives in context (Academy, Resources, Products) until then.",
  },
  {
    key: "careers",
    label: "Careers",
    href: "/careers",
    status: "planned",
    placement: "footer",
    desc: "Grow the team as the ecosystem expands.",
  },
  {
    key: "about",
    label: "About",
    href: "/about",
    status: "active",
    placement: "primary",
    desc: "The organization first — mission, vision, team — then the founder as credibility.",
    children: [
      { key: "mission", label: "Mission", href: "/about#mission", status: "active" },
      { key: "vision", label: "Vision", href: "/about#vision", status: "active" },
      { key: "team", label: "Team", href: "/about/team", status: "planned" },
      { key: "partners", label: "Partners", href: "/about/partners", status: "planned" },
      { key: "timeline", label: "Timeline", href: "/about/timeline", status: "active" },
      {
        key: "founder",
        label: "Founder — Donfack Fortune",
        href: "/about/founder",
        status: "active",
        desc: "Presented as founder & visionary — evidence the ecosystem is credible.",
        children: [
          { key: "biography", label: "Biography", href: "/about/founder#biography", status: "active" },
          { key: "experience", label: "Experience", href: "/about/founder#experience", status: "active" },
          { key: "portfolio", label: "Portfolio", href: "/about/founder#portfolio", status: "active" },
          { key: "certifications", label: "Certifications", href: "/about/founder#certifications", status: "active" },
          { key: "awards", label: "Awards", href: "/about/founder#awards", status: "active" },
          { key: "resume", label: "Résumé", href: "/about/founder#resume", status: "active" },
          { key: "media", label: "Media", href: "/about/founder#media", status: "active" },
        ],
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    href: "/contact",
    status: "active",
    placement: "utility",
    desc: "Start a project, a partnership, or a conversation.",
  },
];

/** Flatten helper for counting / iteration. */
export function flattenTree(nodes: SiteNode[] = siteTree): SiteNode[] {
  return nodes.flatMap((n) => [n, ...(n.children ? flattenTree(n.children) : [])]);
}

export const primaryNav = siteTree.filter((n) => n.placement === "primary" && n.key !== "home");
export const footerNav = siteTree.filter((n) => n.placement === "footer");
