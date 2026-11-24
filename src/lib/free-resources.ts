/**
 * FREE RESOURCES — official and reputable places to learn, free, that the
 * Academy points to. We link; we never host, copy or mirror someone else's
 * course.
 *
 * Rules that keep the list honest:
 *  - Only free resources are listed; paid courses are left out.
 *  - Most entries link to the owner's own page. The `folders` group is the
 *    exception: shared Google Drive folders that people collected. They are
 *    not published by their owners and not hosted by us; the page says so.
 *  - `checked` is the date the page was last opened and read. A free offer
 *    can end, so re-open the links before each release.
 *  - The words about each resource are English, as the resources are; the
 *    page around them is bilingual. `lang` says what the resource itself is
 *    taught in.
 *  - The long working list, with what was and was not verified, is in
 *    docs/free-resources.md.
 */

export const FREE_RESOURCES_PATH = "/academy/free-resources";

export type Cost = "free" | "account" | "audit";

export type FreeResource = {
  name: string;
  by: string;
  url: string;
  /** True for a path on this site, so the page localises it. */
  internal?: boolean;
  cost: Cost;
  lang: "en" | "fr";
  note: string;
  /** The note in French, for the cards a French reader is most likely to need. */
  noteFr?: string;
  /** Page opened and read on this date (YYYY-MM-DD). Omitted = not opened. */
  checked?: string;
  /**
   * A picture of what is behind the link, under /public/images/previews.
   * Always a file of ours: the CSP allows no image from elsewhere, and a
   * third-party image would tell that third party who is reading. It is a
   * crop of the cover (a PDF's first page, a video's thumbnail) shown small,
   * next to the link to the owner's own page. Only some cards have one.
   */
  preview?: string;
  /** Short facts that read the same in English and French, and were checked: "PDF · 80 pages". */
  facts?: string[];
};

export type FreeResourceGroupKey =
  | "solidworks"
  | "francais"
  | "simulation"
  | "mechanics"
  | "drawing"
  | "cad"
  | "code"
  | "folders";

export type FreeResourceGroup = {
  key: FreeResourceGroupKey;
  items: FreeResource[];
};

export const freeResourceGroups: FreeResourceGroup[] = [
  {
    key: "solidworks",
    items: [
      {
        name: "SOLIDWORKS Tutorials: Getting Started",
        by: "SOLIDWORKS",
        url: "https://help.solidworks.com/2024/english/swconntutorial/c_swtut_getting_started_online.htm",
        cost: "free",
        lang: "en",
        note: "SOLIDWORKS' own step-by-step lessons, open without an account: an introduction (a part and a drawing), then parts, assemblies and drawings. About two and a half hours in all. The same tutorials ship inside the software, under Help. Start here if you have never modelled a part.",
        noteFr: "Les leçons pas à pas de SOLIDWORKS lui-même, sans compte : une introduction (une pièce et un plan), puis pièces, assemblages et mises en plan. Environ deux heures et demie au total. Les mêmes tutoriels sont fournis dans le logiciel, menu Aide. À commencer si vous n'avez jamais modélisé une pièce. En anglais.",
        facts: ["2 h 30"],
        checked: "2026-11-24",
      },
      {
        name: "Mastering CSWA certifications",
        by: "Douala City SOLIDWORKS User Group",
        url: "https://community.swugn.org/events/details/solidworks-douala-city-solidworks-user-group-presents-mastering-cswa-certifications-focus-on-cad-design-amp-additive-manufacturing/",
        cost: "free",
        lang: "en",
        note: "The user group's own CSWA exam-prep session: what the exam asks, and how to approach CAD design and additive manufacturing questions.",
      },
      {
        name: "Practice problems database",
        by: "SOLIDWORKS",
        url: "https://www.solidworks.com/solution/education/practice-problems",
        cost: "free",
        lang: "en",
        note: "Ready-to-use CAD exercises aimed at the CSWA and CSWP exams.",
      },
      {
        name: "CSWA practice exam walk-through",
        by: "SOLIDWORKS Education",
        url: "https://www.youtube.com/watch?v=XdWYW4HOLT4",
        cost: "free",
        lang: "en",
        preview: "/images/previews/cswa-walkthrough.webp",
        note: "The education team goes through the sample test: its structure and sample questions.",
      },
    ],
  },
  {
    key: "francais",
    items: [
      {
        name: "Guide et examen blanc CSWA",
        by: "SOLIDWORKS",
        url: "https://www.solidworks.com/fr/media/solidworks-certification-exam-guide-practice-test",
        cost: "free",
        lang: "fr",
        note: "The official CSWA guide in French: the exam explained, tips, and practice exercises with answers. A direct download.",
        noteFr: "Le guide officiel du CSWA en français : l'examen expliqué, des conseils, et des exercices avec corrigés. Téléchargement direct.",
        checked: "2026-11-23",
      },
      {
        name: "Tolérancement ISO GPS",
        by: "Éducation nationale (CERPET)",
        url: "https://sti.eduscol.education.fr/sites/eduscol.education.fr.sti/files/ressources/techniques/3787/3787-tolerancement-gps.pdf",
        cost: "free",
        lang: "fr",
        preview: "/images/previews/eduscol-gps.webp",
        facts: ["PDF · 80 pages"],
        note: "An 80-page teaching document from the French education ministry: the ISO GPS concept, dimensional and geometric tolerances, and reading and writing exercises. The best French answer to GD&T.",
        noteFr: "Un document pédagogique de 80 pages de l'Éducation nationale : le concept GPS, les tolérances dimensionnelles et géométriques, et des exercices de lecture et d'écriture de spécifications. La meilleure réponse française au GD&T.",
        checked: "2026-11-23",
      },
      {
        name: "Cours Mécanique et Ingénierie",
        by: "Université de Lille",
        url: "https://pro.univ-lille.fr/fileadmin/user_upload/pages_pros/michael_baudoin/Cours_compressed.pdf",
        cost: "free",
        lang: "fr",
        preview: "/images/previews/lille-mecanique.webp",
        facts: ["PDF · 71 pages"],
        note: "University lecture notes in French: statics (the equilibrium of forces) and dynamics. A PDF from the university's own staff pages. Read it beside our Engineering Thinking path.",
        noteFr: "Des notes de cours universitaires en français : la statique (l'équilibre des forces) et la dynamique. Un PDF hébergé par l'université. À lire avec notre parcours Engineering Thinking.",
      },
      {
        name: "Thermoptim : thermodynamique appliquée",
        by: "Mines Paris - PSL",
        url: "https://direns.minesparis.psl.eu/Sites/Thopt/fr/co/ctc-ms.html",
        cost: "free",
        lang: "fr",
        note: "An open-access course and simulation package on applied thermodynamics: steam plants, gas turbines, engine cycles, refrigeration, heat pumps, solar and geothermal systems. Updated in 2026.",
        noteFr: "Un cours et un logiciel de simulation en accès libre sur la thermodynamique appliquée : centrales à vapeur, turbines à gaz, cycles moteurs, froid, pompes à chaleur, solaire et géothermie. Mis à jour en 2026.",
        checked: "2026-11-23",
      },
      {
        name: "Python pour les scientifiques",
        by: "Jérémy Fix",
        url: "https://jeremyfix.github.io/Python-for-scientists/",
        cost: "free",
        lang: "fr",
        note: "A French course on scientific computing: NumPy for calculation, SciPy for signals, matplotlib for plotting results, with slides and practical exercises. Closer to engineering work than a general beginner course.",
        noteFr: "Un cours en français sur le calcul scientifique : NumPy pour le calcul, SciPy pour les signaux, matplotlib pour tracer les résultats, avec des diapositives et des travaux pratiques. Plus proche du travail d'ingénieur qu'un cours général pour débutants.",
        checked: "2026-11-23",
      },
      {
        name: "FUN MOOC",
        by: "France Université Numérique",
        url: "https://www.fun-mooc.fr/",
        cost: "free",
        lang: "fr",
        note: "French university courses. Many engineering courses there, including mechanics and strength of materials, are archived sessions with no open enrolment: look for the courses marked as running.",
        noteFr: "Des cours universitaires français. Beaucoup de cours d'ingénierie, dont la mécanique et la résistance des matériaux, n'existent qu'en sessions archivées sans inscription ouverte : cherchez les cours marqués « en cours ».",
        checked: "2026-11-23",
      },
    ],
  },
  {
    key: "simulation",
    items: [
      {
        name: "The 4TUNHub YouTube library",
        by: "4TUNHub",
        url: "/academy/youtube",
        internal: true,
        cost: "free",
        lang: "en",
        preview: "/images/previews/youtube-library.webp",
        note: "Every tutorial from the @4TUNHUB channel, in order, with the keyword decks and model files used on camera. Start here.",
      },
      {
        name: "LS-PrePost",
        by: "Ansys",
        url: "https://lsdyna.ansys.com/download-install-overview/",
        cost: "free",
        lang: "en",
        note: "The free pre- and post-processor every 4TUNHUB tutorial uses. The LS-DYNA solver itself needs a licence.",
      },
      {
        name: "LS-DYNA tutorials",
        by: "Ansys",
        url: "https://lsdyna.ansys.com/tutorial/",
        cost: "free",
        lang: "en",
        note: "Getting started, contact modelling, the user's guide, and a suite for explicit and implicit analysis in LS-PrePost.",
        checked: "2026-11-19",
      },
      {
        name: "LS-DYNA manuals",
        by: "Ansys",
        url: "https://lsdyna.ansys.com/manuals-3/",
        cost: "free",
        lang: "en",
        note: "The examples manual, theory and database manuals. Heavy reading, the real reference.",
      },
      {
        name: "Ansys Innovation Courses",
        by: "Ansys",
        url: "https://innovation.ansys.com/public/learning",
        cost: "account",
        lang: "en",
        note: "Free, self-paced courses with videos, homework and quizzes: solid mechanics, strain, bolted joints, fluids.",
        checked: "2026-11-19",
      },
      {
        name: "Ansys Student",
        by: "Ansys",
        url: "https://ansys.synopsys.com/academic/students/ansys-student",
        cost: "free",
        lang: "en",
        note: "Workbench simulation software for verified students, limited to 128K nodes or elements for structural models. LS-DYNA is not part of it.",
        checked: "2026-11-19",
      },
      {
        name: "Ansys Learning Forum",
        by: "Ansys",
        url: "https://innovation.ansys.com/public/forum",
        cost: "account",
        lang: "en",
        note: "Search thousands of answered questions, or ask your own.",
        checked: "2026-11-19",
      },
      {
        name: "SimCafe, with free Cornell courses",
        by: "Cornell University",
        url: "https://confluence.cornell.edu/spaces/SIMULATION/pages/86081825/Home",
        cost: "free",
        lang: "en",
        note: "Two free self-paced eCornell courses (FEA with Ansys Mechanical, CFD with Ansys Fluent) and worked tutorials from Cornell classes.",
        checked: "2026-11-19",
      },
      {
        name: "Finite Element Procedures for Solids and Structures",
        by: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/courses/res-2-002-finite-element-procedures-for-solids-and-structures-spring-2010/",
        cost: "free",
        lang: "en",
        note: "Full video lectures on the theory behind the solver.",
      },
    ],
  },
  {
    key: "mechanics",
    items: [
      {
        name: "Engineering Thinking",
        by: "4TUNHub Lab",
        url: "/academy/engineering-thinking",
        internal: true,
        cost: "free",
        lang: "en",
        preview: "/images/previews/engineering-thinking.webp",
        note: "Our own path: eleven short lessons from a hanging load to a force and a bending moment, then a steel plate sized for strength and stiffness. A check at every step, no account. The lessons are in English.",
        noteFr: "Notre propre parcours : onze leçons courtes, d'une charge suspendue jusqu'à la force et au moment de flexion, puis une plaque d'acier dimensionnée en résistance et en rigidité. Un exercice à chaque étape, sans compte. Les leçons sont en anglais.",
      },
      {
        name: "MIT OpenCourseWare: mechanical engineering",
        by: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/courses/mechanical-engineering/",
        cost: "free",
        lang: "en",
        note: "Start with Mechanics and Materials, Engineering Dynamics and Thermodynamics. Notes, exams and video lectures, openly licensed; the lectures are also on MIT's YouTube channel.",
      },
      {
        name: "Open textbooks: OpenStax and LibreTexts",
        by: "OpenStax, Rice University",
        url: "https://openstax.org/",
        cost: "free",
        lang: "en",
        note: "Free peer-reviewed textbooks, among them University Physics (mechanics, thermodynamics, waves). LibreTexts (libretexts.org) adds open engineering texts such as Mechanics of Materials.",
        checked: "2026-11-19",
      },
    ],
  },
  {
    key: "drawing",
    items: [
      {
        name: "Engineering drawing fundamentals",
        by: "Excedify",
        url: "https://www.excedify.com/courses/free-engineering-drawing-online-course",
        cost: "account",
        lang: "en",
        note: "A real free beginner course (individual licence): drawing sheets, orthographic projection, sections, dimensioning, tolerances and fits, and an introduction to GD&T. Needs an account.",
      },
      {
        name: "GD&T Basics",
        by: "GD&T Basics",
        url: "https://www.gdandtbasics.com/gdt-advice/",
        cost: "free",
        lang: "en",
        note: "Free articles and training on geometric dimensioning and tolerancing.",
      },
      {
        name: "GD&T basics",
        by: "CNC Cookbook",
        url: "https://www.cnccookbook.com/gdt-basics/",
        cost: "free",
        lang: "en",
        note: "Symbols, rules and practical applications in one readable guide.",
      },
    ],
  },
  {
    key: "cad",
    items: [
      {
        name: "Onshape Learning Center",
        by: "Onshape",
        url: "https://learn.onshape.com/",
        cost: "account",
        lang: "en",
        note: "Official training for the browser-based CAD system.",
      },
      {
        name: "Onshape for students",
        by: "Onshape",
        url: "https://www.onshape.com/en/education/plans",
        cost: "free",
        lang: "en",
        note: "A free, private Education plan for students and educators. The separate Free plan is non-commercial and every document is public.",
        checked: "2026-11-19",
      },
      {
        name: "FreeCAD",
        by: "FreeCAD",
        url: "https://www.freecad.org/",
        cost: "free",
        lang: "en",
        note: "Open-source parametric 3D modeller. It runs offline on a modest PC.",
      },
    ],
  },
  {
    key: "code",
    items: [
      {
        name: "MATLAB Academy",
        by: "MathWorks",
        url: "https://matlabacademy.mathworks.com/",
        cost: "account",
        lang: "en",
        note: "MATLAB Onramp and short courses on Simscape, optimisation and statistics. The courses are free; a MATLAB licence is not.",
      },
      {
        name: "CS50's Introduction to Programming with Python",
        by: "Harvard",
        url: "https://pll.harvard.edu/course/cs50s-introduction-programming-python",
        cost: "audit",
        lang: "en",
        note: "A rigorous Python start. Free to take; the certificate is extra.",
      },
      {
        name: "Claude Academy",
        by: "Anthropic",
        url: "https://academy.claude.com/",
        cost: "free",
        lang: "en",
        note: "Free courses on working with Claude and AI: Claude 101, AI Fluency.",
        checked: "2026-11-19",
      },
    ],
  },
  {
    key: "folders",
    items: [
      {
        name: "SolidProfessor — shared folder",
        by: "Shared Drive folder",
        url: "https://drive.google.com/drive/folders/1-kzRnWRZVWNdLpqH4gHPv6EDGPjr2hZa",
        cost: "free",
        lang: "en",
        note: "SOLIDWORKS course folders: paths, simulation, surfacing, CAM, tips and tricks, and a catalogue file. Study material for the CSWA and beyond.",
        checked: "2026-11-19",
      },
      {
        name: "SolidProfessor — 7. SolidWorks",
        by: "Shared Drive folder",
        url: "https://drive.google.com/drive/folders/1xV_oxCykgtAqLvuPvu1P6mi2-SGRADvQ",
        cost: "free",
        lang: "en",
        note: "The SOLIDWORKS section of the same collection.",
      },
      {
        name: "Mechanical engineering library",
        by: "Shared Drive folder",
        url: "https://drive.google.com/drive/folders/1Vle4L1sCT9XSmo-wNS3DIR7nakI9T6Pm",
        cost: "free",
        lang: "en",
        note: "About 45 topic folders: mechanical basics, materials, pumps, turbines, vibration, welding, piping, safety, Excel for engineers, English learning.",
        checked: "2026-11-19",
      },
    ],
  },
];

export const freeResourceCount = freeResourceGroups.reduce((n, g) => n + g.items.length, 0);
