/**
 * PRODUCTS — the software/AI 4TUN Hub is building (blueprint §06, Products P1).
 * Structure only; all copy lives in the dictionaries (bilingual). Status is
 * stated honestly — nothing is presented as available before it ships.
 * `slug` matches the sitemap child route under /products.
 */

export type ProductStatus = "in-development" | "planned" | "concept";

export type Product = {
  key: string;
  slug: string;
  status: ProductStatus;
};

export const products: Product[] = [
  { key: "edu-assistant", slug: "educational-assistant", status: "in-development" },
  { key: "digital-twin", slug: "digital-twin", status: "planned" },
  { key: "mech-ai", slug: "mechanical-ai", status: "concept" },
];

/** Child routes handled by /products/[slug] (placeholder detail pages). */
export const productSlugs = products.map((p) => p.slug);
