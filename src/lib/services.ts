/**
 * SERVICES — the offerings 4TUN Hub sells (blueprint §06, Services P0).
 * Structure only; all copy lives in the dictionaries (bilingual). Each
 * offering optionally links to a real project as proof (acceptance:
 * ≥2 offerings must cite a real case study).
 */

export type Service = {
  key: string;
  /** Slug of a real project that proves this offering. */
  proof?: string;
};

export const services: Service[] = [
  { key: "mechanical-design", proof: "banana-pseudostem-shredder" },
  { key: "simulation", proof: "pedal-power-charger" },
  { key: "reverse-engineering", proof: "locomotive-braking-analysis" },
  { key: "energy-consulting" },
];
