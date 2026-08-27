/**
 * FOUNDER — Donfack Fortune's verifiable record, migrated from
 * donfackfortune.com (blueprint §06, About/Founder P0).
 *
 * Translatable prose uses `Loc { en, fr }`; proper nouns, dates, GPAs and
 * software names stay neutral. The portfolio reads from projects.ts, so
 * every project on /projects is linked here — no duplication.
 */
import type { Locale } from "./i18n/config";

export type Loc = { en: string; fr: string };
export const pick = (l: Loc, locale: Locale): string => l[locale];

export const founder = {
  name: "Donfack Fortune",
  title: {
    en: "Mechanical Engineer · FEA Specialist · Technical Educator",
    fr: "Ingénieur mécanicien · Spécialiste FEA · Formateur technique",
  } as Loc,
  location: { en: "Dschang & Douala, Cameroon", fr: "Dschang & Douala, Cameroun" } as Loc,
  portrait: "/images/founder-portrait.webp",
  bio: {
    en: "A simulation-driven mechanical engineer with hands-on experience in FEA, CAD modelling and industrial systems design — from braking components at CAMRAIL to sustainable machinery and off-grid energy. Alongside the engineering, a state-accredited educator and SolidWorks group leader who has reached 300+ students, and the founder of The REM, a renewable-energy newsletter read by 3,200+ engineers and policymakers.",
    fr: "Ingénieur mécanicien orienté simulation, avec une expérience concrète en FEA, modélisation CAO et conception de systèmes industriels — des composants de freinage à CAMRAIL aux machines durables et à l'énergie hors réseau. En parallèle, un enseignant accrédité par l'État et animateur d'un groupe SolidWorks ayant touché plus de 300 étudiants, et le fondateur de The REM, une newsletter sur les énergies renouvelables suivie par plus de 3 200 ingénieurs et décideurs.",
  } as Loc,

  stats: [
    { value: "300+", label: { en: "students taught", fr: "étudiants formés" } as Loc },
    { value: "3,200+", label: { en: "REM subscribers", fr: "abonnés REM" } as Loc },
    { value: "6", label: { en: "engineering projects", fr: "projets d'ingénierie" } as Loc },
    { value: "4", label: { en: "diplomas, with honours", fr: "diplômes, avec mention" } as Loc },
  ],

  /** Flagship experience — a dedicated deep page (/about/founder/camrail). */
  camrail: {
    role: { en: "Senior Mechanical Engineer at CAMRAIL", fr: "Ingénieur mécanicien senior à CAMRAIL" } as Loc,
    blurb: {
      en: "Contributing to the operation and modernisation of Cameroon's 1,010 km national rail network — from locomotive compressor test-bench optimisation to FEA-validated brake support design.",
      fr: "Contribution à l'exploitation et à la modernisation du réseau ferré national camerounais de 1 010 km — de l'optimisation du banc d'essai des compresseurs à la conception de supports de frein validés par FEA.",
    } as Loc,
    cta: { en: "Read the CAMRAIL story", fr: "Lire l'expérience CAMRAIL" } as Loc,
  },

  education: [
    {
      degree: { en: "Master's in Mechanical Engineering", fr: "Master en génie mécanique" } as Loc,
      school: "ENSET, Douala",
      period: "2022 – 2024",
      note: "GPA 3.52 / 5.0 · Honours",
    },
    {
      degree: {
        en: "Bachelor's in Mechanical Engineering — Mechanical Construction",
        fr: "Licence en génie mécanique — construction mécanique",
      } as Loc,
      school: "ENSET, Douala",
      period: "2019 – 2022",
      note: "GPA 3.63 / 5.0 · Honours",
    },
    {
      degree: {
        en: "DIPET II — Technical Teaching Diploma, Grade II",
        fr: "DIPET II — Diplôme de Professeur de l'Enseignement Technique, Grade II",
      } as Loc,
      school: "ENSET, Douala",
      period: "2024",
      note: "GPA 3.84 / 5.0 · Honours",
    },
    {
      degree: {
        en: "DIPET I — Technical Teaching Diploma, Grade I",
        fr: "DIPET I — Diplôme de Professeur de l'Enseignement Technique, Grade I",
      } as Loc,
      school: "ENSET, Douala",
      period: "2022",
      note: "GPA 3.61 / 5.0 · Honours",
    },
  ],

  skills: {
    software: ["SolidWorks", "ANSYS", "AutoCAD", "Onshape", "MATLAB", "KeyShot", "Python", "Excel"],
    technical: ["FEA", "CFD", "CAD modelling", "GD&T", "FMEA", "DFM", "Vibration analysis", "Additive mfg"],
    workshop: ["MIG welding", "Lathe", "Mill", "Laser cutter", "3D printing"],
  },

  certifications: [
    { name: "CSWE — Certified SolidWorks Expert", issuer: "SOLIDWORKS", year: "2026" },
    { name: "CSWP — Certified SolidWorks Professional", issuer: "SOLIDWORKS", year: "2024" },
    { name: "Additive Manufacturing Certified", issuer: "SOLIDWORKS", year: "2024" },
    { name: "User Certified", issuer: "ANSYS", year: "2024" },
    { name: "Failure Mode & Effects Professional", issuer: "AIGPE", year: "2024" },
    { name: "MATLAB Professional", issuer: "MathWorks", year: "2024" },
    { name: "GD&T Specialist", issuer: "Udemy", year: "2022" },
    { name: "Professional 2D Drafter", issuer: "AutoCAD", year: "2021" },
  ],

  awards: [
    { title: { en: "Honours College Graduate — Master's", fr: "Diplômé avec mention — Master" } as Loc, place: "ENSET Douala", year: "2025" },
    { title: { en: "Best Project Award — Third Place", fr: "Prix du meilleur projet — 3ᵉ place" } as Loc, place: "ENSET Douala", year: "2022" },
  ],

  /** Downloadable CVs, one per career track. `icon` selects the connect glyph. */
  resumes: [
    { key: "mechanical", label: { en: "Mechanical Engineering", fr: "Génie mécanique" } as Loc, href: "/resume/donfack-fortune-mechanical.pdf", external: false },
    { key: "educator", label: { en: "Educator", fr: "Enseignant" } as Loc, href: "/resume/donfack-fortune-educator.pdf", external: false },
    { key: "energy", label: { en: "Energy Scientist", fr: "Spécialiste énergie" } as Loc, href: "/resume/donfack-fortune-energy.pdf", external: false },
  ],

  /** Connect links — each rendered as a logo tile. `icon` maps to a glyph. */
  links: [
    { label: "Portfolio", href: "https://www.donfackfortune.com", icon: "portfolio" as const },
    { label: "GrabCAD", href: "https://grabcad.com/donfack.fortune-1", icon: "grabcad" as const },
    { label: "Medium", href: "https://donfackfortune.medium.com", icon: "medium" as const },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/donfack-fortune-476904231", icon: "linkedin" as const },
    { label: "Email", href: "mailto:fortunedonfack05@gmail.com", icon: "email" as const },
  ],
};
