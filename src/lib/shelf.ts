/**
 * THE ENGINEER'S SHELF — books and courses, filtered on one page.
 *
 * Rules that keep it honest:
 *  - A book by someone else is listed only if it is free to read, as a link
 *    to its owner's own page. We never host, copy or sell it.
 *  - "Paid" is reserved for what 4TUNHub publishes.
 *  - Only our own work (or work we hold written permission for) carries a
 *    `product`, which is how a price and a Pay button appear. The payment
 *    link goes through `paymentUrl()` in commerce.ts.
 *  - The descriptions are our own words: no invented reviews, no fake
 *    urgency, nothing copied from a publisher.
 *  - A preview is a small copy of a book's cover or first page, taken from
 *    its owner's page, beside the link back to it. Without one the page
 *    draws its own cover.
 */

import { PATH_ROOT } from "@/lib/engineering-thinking";
import { LIBRARY_PATH } from "@/lib/lsdyna";
import type { Purchasable } from "@/lib/commerce";
import type { Locale } from "@/lib/i18n/config";
import type { ShelfKind, ShelfLang, ShelfPrice, ShelfSubject } from "@/lib/shelf-filters";

export const SHELF_PATH = "/academy/shelf";

export type ShelfItem = {
  title: string;
  by: string;
  kind: ShelfKind;
  subject: ShelfSubject;
  lang: ShelfLang;
  price: ShelfPrice;
  /** The owner's own page, or a path on this site. */
  url: string;
  internal?: boolean;
  /** Who it is for: the line that makes someone stop. */
  hook: Record<Locale, string>;
  /** What is inside, and how hard it is. */
  about: Record<Locale, string>;
  /**
   * A glimpse shown on the card and enlarged on click: a file of ours under
   * /public/images/previews, 640×360 (the CSP allows no image from
   * elsewhere). Without one the card draws its own cover.
   */
  preview?: string;
  /** Set only for something 4TUNHub sells. */
  product?: Purchasable;
};

export const shelfItems: ShelfItem[] = [
  /* ── Our own courses ─────────────────────────────────────────── */
  {
    title: "Engineering Thinking",
    by: "4TUNHub",
    kind: "course",
    subject: "mechanical",
    lang: "en",
    price: "free",
    url: PATH_ROOT,
    internal: true,
    preview: "/images/previews/engineering-thinking.webp",
    hook: {
      en: "For you if you can use a calculator and want to think like an engineer.",
      fr: "Pour vous si vous savez utiliser une calculatrice et voulez raisonner en ingénieur.",
    },
    about: {
      en: "Short lessons that take a hanging load to a sized steel plate, with a check at every step. Start here if you are new.",
      fr: "De courtes leçons qui mènent d'une charge suspendue à une plaque d'acier dimensionnée, avec une vérification à chaque étape. Commencez ici si vous débutez. En anglais.",
    },
  },
  {
    title: "LS-DYNA tutorials",
    by: "4TUNHub",
    kind: "course",
    subject: "mechanical",
    lang: "en",
    price: "free",
    url: LIBRARY_PATH,
    internal: true,
    preview: "/images/previews/youtube-library.webp",
    hook: {
      en: "For you if you want to run your first crash and impact simulations.",
      fr: "Pour vous si vous voulez lancer vos premières simulations de choc et d'impact.",
    },
    about: {
      en: "Every tutorial from the @4TUNHUB channel, with the model files used on camera. Build alongside the video.",
      fr: "Tous les tutoriels de la chaîne @4TUNHUB, avec les fichiers utilisés à l'écran. Construisez le modèle en suivant la vidéo. En anglais.",
    },
  },

  /* ── Free books ──────────────────────────────────────────────── */
  {
    title: "Engineering Statics: Open and Interactive",
    by: "Daniel Baker, William Haynes",
    kind: "book",
    subject: "mechanical",
    lang: "en",
    price: "free",
    url: "https://engineeringstatics.org/",
    hook: {
      en: "For you if free-body diagrams still feel like guesswork.",
      fr: "Pour vous si les schémas du corps isolé ressemblent encore à de la devinette.",
    },
    about: {
      en: "A statics textbook you read in the browser, with interactive figures. First-year level.",
      fr: "Un manuel de statique à lire dans le navigateur, avec des figures interactives. Niveau première année. En anglais.",
    },
  },
  {
    title: "Introduction à la résistance des matériaux",
    by: "J.-P. Basset, P. Cartraud et al., École Centrale de Nantes",
    kind: "book",
    subject: "mechanical",
    lang: "fr",
    price: "free",
    url: "https://cel.hal.science/cel-00594957v1/file/RDM.pdf",
    hook: {
      en: "For you if you want strength of materials properly, in French.",
      fr: "Pour vous si vous voulez apprendre la RDM sérieusement, en français.",
    },
    about: {
      en: "A university course of about 180 pages (PDF), from an engineering school. For a reader who already knows statics.",
      fr: "Un cours d'école d'ingénieurs d'environ 180 pages (PDF). Pour un lecteur qui connaît déjà la statique.",
    },
  },
  {
    title: "Résistance des matériaux : comportement mécanique",
    by: "Damien André, Université de Limoges",
    kind: "book",
    subject: "mechanical",
    lang: "fr",
    price: "free",
    url: "https://www.unilim.fr/pages_perso/damien.andre/cours/meca/poly.pdf",
    preview: "/images/previews/book-rdm-limoges.webp",
    hook: {
      en: "For you if you want to know how a material behaves before you load it.",
      fr: "Pour vous si vous voulez savoir comment un matériau se comporte avant de le charger.",
    },
    about: {
      en: "Course notes of 74 pages (PDF) in French, short enough to finish.",
      fr: "Un polycopié de 74 pages (PDF), assez court pour être lu en entier.",
    },
  },
  {
    title: "Cours Mécanique et Ingénierie",
    by: "Université de Lille",
    kind: "book",
    subject: "mechanical",
    lang: "fr",
    price: "free",
    url: "https://pro.univ-lille.fr/fileadmin/user_upload/pages_pros/michael_baudoin/Cours_compressed.pdf",
    preview: "/images/previews/lille-mecanique.webp",
    hook: {
      en: "For you if you need statics and dynamics in French, in one place.",
      fr: "Pour vous si vous cherchez la statique et la dynamique au même endroit.",
    },
    about: {
      en: "University lecture notes, 71 pages (PDF): the equilibrium of forces, then dynamics.",
      fr: "Des notes de cours universitaires, 71 pages (PDF) : l'équilibre des forces, puis la dynamique.",
    },
  },
  {
    title: "Introduction to Engineering Thermodynamics",
    by: "Claire Yu Yan",
    kind: "book",
    subject: "mechanical",
    lang: "en",
    price: "free",
    url: "https://pressbooks.bccampus.ca/thermo1/",
    preview: "/images/previews/book-thermodynamics.webp",
    hook: {
      en: "For you if you want to understand engines, turbines and refrigerators.",
      fr: "Pour vous si vous voulez comprendre les moteurs, les turbines et les réfrigérateurs.",
    },
    about: {
      en: "An open textbook for a first thermodynamics course.",
      fr: "Un manuel libre pour un premier cours de thermodynamique. En anglais.",
    },
  },
  {
    title: "Applied Fluid Mechanics Lab Manual",
    by: "Habib Ahmari, Shah Md Imran Kabir",
    kind: "book",
    subject: "mechanical",
    lang: "en",
    price: "free",
    url: "https://uta.pressbooks.pub/appliedfluidmechanics/",
    hook: {
      en: "For you if you learn fluids best by running the experiment.",
      fr: "Pour vous si la mécanique des fluides vous parle surtout par l'expérience.",
    },
    about: {
      en: "A laboratory manual: experiments, videos and help with the lab report. Read it beside a fluids course.",
      fr: "Un manuel de travaux pratiques : expériences, vidéos et aide pour le compte rendu. À lire à côté d'un cours. En anglais.",
    },
  },
  {
    title: "Lessons in Electric Circuits",
    by: "Tony R. Kuphaldt",
    kind: "book",
    subject: "electronics",
    lang: "en",
    price: "free",
    url: "https://www.ibiblio.org/kuphaldt/electricCircuits/",
    preview: "/images/previews/book-electric-circuits.webp",
    hook: {
      en: "For you if you want to start electronics from zero.",
      fr: "Pour vous si vous voulez commencer l'électronique à zéro.",
    },
    about: {
      en: "A series of volumes: direct current, alternating current, semiconductors, digital circuits and experiments.",
      fr: "Une série de volumes : courant continu, courant alternatif, semi-conducteurs, circuits numériques et expériences. En anglais.",
    },
  },
  {
    title: "Cours d'électronique analogique",
    by: "Christophe Adessi",
    kind: "book",
    subject: "electronics",
    lang: "fr",
    price: "free",
    url: "https://ilm-perso.univ-lyon1.fr/~cadessi/Doc/CM_Elec_Analog.pdf",
    preview: "/images/previews/book-electronique-analogique.webp",
    hook: {
      en: "For you if you want a short French course on analogue electronics.",
      fr: "Pour vous si vous voulez un cours d'analogique court et en français.",
    },
    about: {
      en: "Lecture notes of 36 pages (PDF), written for audioprosthesis students: filtering and amplifying a signal.",
      fr: "Un cours de 36 pages (PDF), écrit pour des étudiants en audioprothèse : filtrer et amplifier un signal.",
    },
  },
  {
    title: "University Physics, Volume 1",
    by: "OpenStax: W. Moebs, S. J. Ling, J. Sanny",
    kind: "book",
    subject: "maths",
    lang: "en",
    price: "free",
    url: "https://openstax.org/details/books/university-physics-volume-1",
    preview: "/images/previews/book-physics-1.webp",
    hook: {
      en: "For you if you want to understand why things move before you simulate them.",
      fr: "Pour vous si vous voulez comprendre le mouvement avant de le simuler.",
    },
    about: {
      en: "A full first-year physics textbook, free from the publisher. Read it with a pencil in hand.",
      fr: "Un manuel complet de physique de première année, gratuit chez l'éditeur. À lire un crayon à la main. En anglais.",
    },
  },
  {
    title: "Calculus, Volume 1",
    by: "OpenStax: G. Strang, E. Herman",
    kind: "book",
    subject: "maths",
    lang: "en",
    price: "free",
    url: "https://openstax.org/details/books/calculus-volume-1",
    preview: "/images/previews/book-calculus-1.webp",
    hook: {
      en: "For you if the derivatives in your engineering courses slow you down.",
      fr: "Pour vous si les dérivées vous ralentissent dans vos cours d'ingénierie.",
    },
    about: {
      en: "A first calculus textbook, free from the publisher.",
      fr: "Un premier manuel d'analyse, gratuit chez l'éditeur. En anglais.",
    },
  },
  {
    title: "Think Python",
    by: "Allen B. Downey",
    kind: "book",
    subject: "programming",
    lang: "en",
    price: "free",
    url: "https://greenteapress.com/wp/think-python-3rd-edition/",
    hook: {
      en: "For you if you have never written a line of code.",
      fr: "Pour vous si vous n'avez jamais écrit une ligne de code.",
    },
    about: {
      en: "A beginner's book, free to read online, each chapter a notebook you can run.",
      fr: "Un livre pour débutants, lisible gratuitement en ligne, chaque chapitre sous forme de carnet à exécuter. En anglais.",
    },
  },
  {
    title: "Apprendre à programmer avec Python 3",
    by: "Gérard Swinnen",
    kind: "book",
    subject: "programming",
    lang: "fr",
    price: "free",
    url: "https://inforef.be/swi/python.htm",
    preview: "/images/previews/book-python-swinnen.webp",
    hook: {
      en: "For you if you want to learn programming in French.",
      fr: "Pour vous si vous voulez apprendre à programmer, en français.",
    },
    about: {
      en: "A well-known French introduction to programming, free to download from the author's page.",
      fr: "Une introduction reconnue à la programmation, à télécharger gratuitement sur la page de l'auteur.",
    },
  },
  {
    title: "Tolérancement ISO GPS",
    by: "Éducation nationale (CERPET)",
    kind: "book",
    subject: "design",
    lang: "fr",
    price: "free",
    url: "https://sti.eduscol.education.fr/sites/eduscol.education.fr.sti/files/ressources/techniques/3787/3787-tolerancement-gps.pdf",
    preview: "/images/previews/eduscol-gps.webp",
    hook: {
      en: "For you if a drawing's tolerance frames look like a secret code.",
      fr: "Pour vous si les cadres de tolérance d'un plan ressemblent à un code secret.",
    },
    about: {
      en: "80 pages (PDF) in French on dimensional and geometric tolerances, with reading and writing exercises.",
      fr: "80 pages (PDF) sur les tolérances dimensionnelles et géométriques, avec des exercices de lecture et d'écriture.",
    },
  },
];
