/**
 * RESOURCES — engineering material 4TUN Hub publishes.
 * Structure only; all copy lives in the dictionaries (bilingual).
 *
 * REAL-ONLY: `available` items link to material that genuinely exists
 * today; `planned` items are honestly labelled and carry no fake link
 * until they ship (craft contract §6). Paid resources, when they come,
 * are sold in context via the commerce capability — see commerce.ts.
 */

import { MEDIUM_URL, GRABCAD_URL } from "@/lib/site";

export type ResourceStatus = "available" | "planned";
export type ResourceKind =
  | "publication"
  | "cad"
  | "case-studies"
  | "ebook"
  | "template"
  | "reference";

export type Resource = {
  key: string;
  status: ResourceStatus;
  kind: ResourceKind;
  /** Present for available items; internal (localized) or external. */
  href?: string;
  external?: boolean;
};

export const resources: Resource[] = [
  { key: "rem", status: "available", kind: "publication", href: MEDIUM_URL, external: true },
  { key: "grabcad", status: "available", kind: "cad", href: GRABCAD_URL, external: true },
  { key: "case-studies", status: "available", kind: "case-studies", href: "/projects", external: false },
  { key: "ebooks", status: "planned", kind: "ebook" },
  { key: "templates", status: "planned", kind: "template" },
  { key: "references", status: "planned", kind: "reference" },
];

export const availableResources = resources.filter((r) => r.status === "available");
export const plannedResources = resources.filter((r) => r.status === "planned");
