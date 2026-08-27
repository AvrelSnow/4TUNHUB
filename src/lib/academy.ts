/**
 * ACADEMY — technical training tracks (blueprint §06, Academy P1).
 * Structure only; all copy lives in the dictionaries (bilingual). Each
 * course optionally links to a real project that demonstrates the skill.
 */

export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all-levels";
export type CourseFormat = "online" | "in-person" | "hybrid" | "workshop";

export type Course = {
  key: string;
  level: CourseLevel;
  format: CourseFormat;
  /** Slug of a real project where the skill was applied. */
  proof?: string;
};

export const courses: Course[] = [
  { key: "solidworks-cad", level: "beginner", format: "hybrid", proof: "banana-pseudostem-shredder" },
  { key: "fea-simulation", level: "intermediate", format: "online", proof: "pedal-power-charger" },
  { key: "reverse-engineering", level: "intermediate", format: "workshop", proof: "locomotive-braking-analysis" },
  { key: "energy-systems", level: "intermediate", format: "hybrid" },
];
