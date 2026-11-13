/**
 * ACADEMY — technical training tracks (blueprint §06, Academy P1).
 * Structure only; all copy lives in the dictionaries (bilingual). Each
 * course optionally links to a real project that demonstrates the skill.
 */

export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all-levels";
/**
 * Where a course really stands. Only what is true today:
 *  - planned: on the list, no date yet — the card says so
 */
export type CourseStatus = "planned";
export type CourseFormat = "online" | "in-person" | "hybrid" | "workshop";

export type Course = {
  key: string;
  level: CourseLevel;
  format: CourseFormat;
  status: CourseStatus;
  /** Slug of a real project where the skill was applied. */
  proof?: string;
};

export const courses: Course[] = [
  { key: "solidworks-cad", status: "planned", level: "beginner", format: "hybrid", proof: "banana-pseudostem-shredder" },
  { key: "fea-simulation", status: "planned", level: "intermediate", format: "online", proof: "pedal-power-charger" },
  { key: "reverse-engineering", status: "planned", level: "intermediate", format: "workshop", proof: "locomotive-braking-analysis" },
  { key: "energy-systems", status: "planned", level: "intermediate", format: "hybrid" },
];
