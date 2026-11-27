/**
 * ============================================================
 * PROJECTS — the evidence layer (blueprint §06, Projects P0).
 * ============================================================
 * Structural facts only (slug, category, year, tools). All prose
 * lives in the dictionaries so every project is fully bilingual.
 *
 * These are Donfack Fortune's real engineering projects. Nothing
 * here is invented; `image` stays empty until genuine project
 * photography / CAD renders exist (craft contract §1 — no stock
 * standing in for real work).
 */

export type ProjectCategory =
  | "simulation"
  | "sustainability"
  | "mechanical"
  | "electronics"
  | "user-centered";

export type Project = {
  slug: string;
  category: ProjectCategory;
  /** Display year. */
  year: string;
  tools: string[];
  /** Real photo/render (public/images/projects/…). Absent → generative visual. */
  image?: string;
  /** Extra real documentation shots; captions live in the dictionary. */
  gallery?: string[];
  /** True when `image` illustrates the subject but isn't the engineer's own output. */
  imageIllustrative?: boolean;
  /** Self-hosted animation (public/videos/…) and the still shown before it plays. */
  video?: { src: string; poster: string };
  /** Drawings that are not published: only blurred stills, offered on request. */
  lockedPlans?: string[];
  /** Design work not manufactured yet: stays off the home page's "built" rail. */
  onPaper?: boolean;
  /** Deep link to this project on the founder's personal portfolio. */
  portfolioUrl?: string;
  featured?: boolean;
};

/** The founder's personal portfolio (redirects to donfackfortune.me). */
const PORTFOLIO = "https://donfackfortune.com/projects";

export const projectCategories: ProjectCategory[] = [
  "simulation",
  "sustainability",
  "mechanical",
  "electronics",
  "user-centered",
];

const IMG = "/images/projects";

/**
 * The canonical, enriched project case studies live inside the founder's
 * portfolio (About section). The /projects pillar and every proof card link
 * here — one detail page per project, no duplicates.
 */
export const PROJECT_DETAIL_BASE = "/about/founder/projects";
export const projectDetailPath = (slug: string) => `${PROJECT_DETAIL_BASE}/${slug}`;

export const projects: Project[] = [
  {
    slug: "fsae-race-car",
    category: "simulation",
    year: "2025",
    tools: ["SolidWorks", "FEA", "CFD"],
    image: `${IMG}/fsae-hero.webp`,
    /** The photo illustrates the vehicle class; the real work is CAD + FEA/CFD. */
    imageIllustrative: true,
    portfolioUrl: `${PORTFOLIO}/project-fsae-car.html`,
    featured: true,
  },
  {
    slug: "banana-pseudostem-shredder",
    category: "sustainability",
    year: "2025",
    tools: ["SolidWorks", "Mechanical sizing", "Lab testing"],
    image: `${IMG}/banana-hero.webp`,
    gallery: Array.from({ length: 14 }, (_, i) => `${IMG}/banana-${i + 1}.webp`),
    portfolioUrl: `${PORTFOLIO}/project-banana-shredder.html`,
    featured: true,
  },
  {
    slug: "locomotive-braking-analysis",
    category: "simulation",
    year: "2023",
    tools: ["Reverse engineering", "2D/3D drawings", "MIG-MAG welding"],
    image: `${IMG}/braking-hero.webp`,
    gallery: [`${IMG}/braking-1.webp`, `${IMG}/braking-2.webp`, `${IMG}/braking-3.webp`],
    portfolioUrl: `${PORTFOLIO}/project-train-braking-system.html`,
    featured: true,
  },
  {
    slug: "motorised-wheelbarrow",
    category: "mechanical",
    year: "2024",
    tools: ["Hands-on fabrication", "Welding", "Ergonomic design"],
    image: `${IMG}/wheelbarrow-hero.webp`,
    gallery: Array.from({ length: 8 }, (_, i) => `${IMG}/wheelbarrow-${i + 1}.webp`),
    portfolioUrl: `${PORTFOLIO}/project-wheelbarrow.html`,
  },
  {
    slug: "pedal-power-charger",
    category: "electronics",
    year: "2023",
    tools: ["SolidWorks weldment", "FEA", "Electronics"],
    image: `${IMG}/pedal-hero.webp`,
    /** Sheets 3–5 were readable drawings: now offered on request. */
    gallery: [1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => `${IMG}/pedal-${n}.webp`),
    video: { src: "/videos/pedal-power-charger.mp4", poster: `${IMG}/pedal-poster.webp` },
    lockedPlans: Array.from({ length: 4 }, (_, i) => `${IMG}/pedal-plan-${i + 1}.webp`),
    portfolioUrl: `${PORTFOLIO}/project-pedal-power.html`,
  },
  {
    slug: "beans-unwrapping-machine",
    category: "user-centered",
    year: "2023",
    tools: ["SolidWorks", "Power transmission", "Mechanical design"],
    image: `${IMG}/beans-hero.webp`,
    /** Sheets 5 and 6 were readable drawings: now offered on request. */
    gallery: [1, 2, 3, 4, 7, 8, 9, 10].map((n) => `${IMG}/beans-${n}.webp`),
    video: { src: "/videos/beans-unwrapping-machine.mp4", poster: `${IMG}/beans-poster.webp` },
    lockedPlans: Array.from({ length: 4 }, (_, i) => `${IMG}/beans-plan-${i + 1}.webp`),
    portfolioUrl: `${PORTFOLIO}/project-beans-unwrapping.html`,
  },
  {
    /**
     * A freelance project. Only the 3D assembly is shown: no readable 2D
     * drawing (the previews are blurred in the file itself), no sizing study,
     * no CAD downloads, no client name or workshop photos.
     */
    slug: "helical-gear-reducer",
    category: "mechanical",
    year: "2026",
    tools: ["Reverse engineering", "SolidWorks", "AutoCAD", "Blender", "Claude"],
    image: `${IMG}/reducer-hero.webp`,
    gallery: Array.from({ length: 4 }, (_, i) => `${IMG}/reducer-${i + 1}.webp`),
    video: { src: "/videos/helical-gear-reducer.mp4", poster: `${IMG}/reducer-poster.webp` },
    lockedPlans: Array.from({ length: 4 }, (_, i) => `${IMG}/reducer-plan-${i + 1}.webp`),
    onPaper: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
