/**
 * RESEARCH — R&D focus areas (blueprint §06, Research P1).
 * Structure only; all copy lives in the dictionaries (bilingual). Each
 * focus area optionally links to a real project as evidence.
 */

export type FocusArea = {
  key: string;
  /** Slug of a real project that evidences work in this area. */
  proof?: string;
};

export const focusAreas: FocusArea[] = [
  { key: "renewable-energy" },
  { key: "sustainable-machinery", proof: "banana-pseudostem-shredder" },
  { key: "industrial-rd", proof: "locomotive-braking-analysis" },
];
