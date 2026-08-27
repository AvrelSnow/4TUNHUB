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
    gallery: Array.from({ length: 15 }, (_, i) => `${IMG}/pedal-${i + 1}.webp`),
    portfolioUrl: `${PORTFOLIO}/project-pedal-power.html`,
  },
  {
    slug: "beans-unwrapping-machine",
    category: "user-centered",
    year: "2023",
    tools: ["SolidWorks", "Power transmission", "Mechanical design"],
    image: `${IMG}/beans-hero.webp`,
    gallery: Array.from({ length: 10 }, (_, i) => `${IMG}/beans-${i + 1}.webp`),
    portfolioUrl: `${PORTFOLIO}/project-beans-unwrapping.html`,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
