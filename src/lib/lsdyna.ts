/**
 * THE LS-DYNA LIBRARY — the @4TUNHUB YouTube tutorials, one page each,
 * with the files to follow along.
 *
 * The source of truth for what is published is D:\Youtube\channel\
 * episode-log.md: an episode gets an entry here only once it is live on
 * the channel, under its corrected title (LS-DYNA and LS-PrePost always
 * hyphenated). The episodes are recorded in English, so their words live
 * here rather than in the dictionaries; the page around them is bilingual.
 *
 * Rules that keep the pages honest:
 *  - `number` only when the log confirms it. The three setup videos have
 *    no confirmed number, so they show none.
 *  - `chapters` only when they were checked against the uploaded cut. Ep 10's
 *    were word-budget estimates and Ep 11's length was never checked, so
 *    neither shows chapters until they are.
 *  - A file is listed only when it is in public/library/ls-dyna and is the
 *    one used on camera.
 */

export const LIBRARY_PATH = "/academy/ls-dyna";

export const episodePath = (slug: string) => `${LIBRARY_PATH}/${slug}`;

export type SeriesKey = "setup" | "ball-plate" | "bracket-static";

export type LibraryFile = {
  /** Under /public. */
  href: string;
  /** The name it saves as. */
  name: string;
  /** Shown beside the button, so nobody is surprised on a phone plan. */
  size: string;
  kind: "keyword" | "geometry";
};

export type Chapter = { at: string; label: string };

export type Episode = {
  slug: string;
  number?: number;
  videoId: string;
  title: string;
  /** mm:ss, when the log has the published length. */
  length?: string;
  series: SeriesKey;
  summary?: string;
  learn?: string[];
  chapters?: Chapter[];
  /** Files for this episode only; the series' files are listed too. */
  files?: LibraryFile[];
};

const BALL_PLATE_DECK: LibraryFile = {
  href: "/library/ls-dyna/ball-plate-impact.k",
  name: "ball-plate-impact.k",
  size: "101 KB",
  kind: "keyword",
};

const BRACKET_IGES: LibraryFile = {
  href: "/library/ls-dyna/bracket.iges",
  name: "bracket.iges",
  size: "1.9 MB",
  kind: "geometry",
};

/** In the order a newcomer should take them. */
export const series: { key: SeriesKey; files: LibraryFile[] }[] = [
  { key: "setup", files: [] },
  { key: "ball-plate", files: [BALL_PLATE_DECK] },
  { key: "bracket-static", files: [] },
];

export const episodes: Episode[] = [
  {
    slug: "install-ls-prepost",
    videoId: "anaHkoh0Tcw",
    title: "How to Download & Install LS-PrePost 2026 – Windows & Linux",
    length: "2:25",
    series: "setup",
  },
  {
    slug: "ls-prepost-troubleshooting",
    videoId: "M7EVQ4dDkS4",
    title: "LS-PrePost Troubleshooting: Crashes, Freezes & Fixes Explained",
    length: "1:26",
    series: "setup",
  },
  {
    slug: "ls-prepost-for-beginners",
    videoId: "-jMnVNoEQXw",
    title: "Complete LS-PrePost Tutorial for Beginners",
    length: "24:07",
    series: "setup",
  },
  {
    slug: "ball-plate-meshing",
    number: 4,
    videoId: "uwS_j7OtcGg",
    title: "LS-PrePost Meshing Tutorial — Ball Plate Impact Analysis",
    length: "13:22",
    series: "ball-plate",
  },
  {
    slug: "ball-plate-boundary-conditions",
    number: 5,
    videoId: "eMZ_6ubFpTI",
    title: "LS-DYNA Ball Plate Impact Analysis — Boundary Conditions Explained",
    length: "13:45",
    series: "ball-plate",
  },
  {
    slug: "contact-definition",
    number: 6,
    videoId: "BKWbyJc-8T8",
    title: "LS-DYNA Contact Definition Tutorial: Get This Wrong and Your Simulation Fails",
    length: "10:35",
    series: "ball-plate",
  },
  {
    slug: "material-and-parts",
    number: 7,
    videoId: "HyKkUcDwl8o",
    title: "LS-PrePost Tutorial: Material Properties & Part Setup for Impact Simulation",
    length: "12:47",
    series: "ball-plate",
  },
  {
    slug: "solver-setup",
    number: 8,
    videoId: "8WzXLXXX0O0",
    title: "LS-DYNA Solver Setup: Termination Time, D3PLOT & Energy Tracking Explained",
    length: "8:34",
    series: "ball-plate",
  },
  {
    slug: "reading-results",
    number: 9,
    videoId: "brcCMcB61SU",
    title: "Is Your LS-DYNA Result Actually Correct? Reading Stress, Displacement & Energy",
    length: "12:32",
    series: "ball-plate",
  },
  {
    slug: "keyword-file-editing",
    number: 10,
    videoId: "NGLxoqx-DYs",
    title: "LS-DYNA Keyword File Editing — Without Breaking Your Deck",
    length: "10:49",
    series: "ball-plate",
    summary:
      "Your LS-DYNA model is a plain text file. Open the ball-plate deck in a text editor, read it card by card against the model built in Episodes 5 to 8, change the termination time by hand and load it back to prove it took — then the four ways hand-editing corrupts a deck without ever throwing an error.",
    learn: [
      "Why the keyword deck, not LS-PrePost, is your actual model",
      "How to read a keyword file: *KEYWORD, $ comment lines, card names and *END",
      "Why LS-DYNA fields are exactly ten characters wide, and what happens when a value spills over",
      "Which LS-DYNA files are text and which are binary — and why opening d3plot in an editor can corrupt it",
      "How to change CONTROL_TERMINATION by hand and check it in the Keyword Manager",
      "The four silent killers: Save As, tabs, field overflow and hand-editing the node block",
    ],
  },
  {
    slug: "file-formats",
    number: 11,
    videoId: "d4uI2XQS5fA",
    // The live title is still the raw upload name; this is the one the
    // episode folder proposes for it.
    title: "LS-DYNA File Formats: Which File to Open, and When",
    series: "ball-plate",
    summary:
      "LS-DYNA reads one file in and writes three kinds out, and the one everybody opens first cannot tell you if the result is good. The ball-plate job folder, file by file: the .k going in, the d3plot family coming out, and the two text files — messag and the .out status file — that say whether the result is worth looking at.",
    learn: [
      "Why LS-DYNA reads one file in and writes three different kinds out",
      "Why d3plot, d3plot01 and d3plot02 are one result cut into pieces",
      "How d3hsp and d3dump differ from d3plot",
      "What the .out status file is for, and what it is not",
      "How to read messag: memory, materials, contacts, time step, and how the run ended",
      "Why “normal termination” is the only place LS-DYNA tells you it finished",
    ],
  },
  {
    slug: "bracket-static-ramp-load",
    number: 12,
    videoId: "FtrQXU7jBNw",
    title: "LS-DYNA Static Analysis: Why Your Load Needs a Ramp",
    series: "bracket-static",
    summary:
      "A new series: a 3D aluminium bracket, bolted at four holes, with 10 MPa of pressure on top. Why a static load has to be ramped in the explicit solver, and the load curve built step by step — physics first, software second.",
    learn: [
      "What “linear static” really means, in simple words",
      "Why *MAT_ELASTIC (MAT_001) is the right card for aluminium here",
      "Why a sudden load in an explicit solver gives a wrong, shaking result",
      "How to build a ramp load curve: (0, 0) → (1.0, 1.0) → (1.1, 1.0)",
      "Why the curve must go past the end time",
      "How to check with energy that the result is really static",
    ],
    chapters: [
      { at: "0:00", label: "A constant load is a problem in LS-DYNA" },
      { at: "0:15", label: "New series: 3D bracket static analysis" },
      { at: "0:45", label: "The bracket: four bolts and 10 MPa pressure" },
      { at: "1:30", label: "Linear elastic material (MAT_001) explained" },
      { at: "2:00", label: "Static vs explicit: why a sudden load fails" },
      { at: "2:40", label: "Building the ramp load curve" },
      { at: "4:20", label: "3 load-curve mistakes to avoid" },
      { at: "5:15", label: "How to check it is really static (energy)" },
      { at: "5:35", label: "Next episode: solving the bracket" },
    ],
  },
  {
    slug: "bracket-mesh-material-supports",
    number: 13,
    videoId: "QJ29Wjik2rA",
    title: "LS-PrePost Tutorial: Mesh, Material and Fixed Holes on a Bracket",
    length: "14:45",
    series: "bracket-static",
    summary:
      "The bracket from Episode 12, built in LS-PrePost: import the IGES file, mesh it at 2 mm, give it an aluminium *MAT_ELASTIC card in a consistent unit system, and fix the four bolt holes with an SPC — plus four mistakes to avoid and three checks before the load goes on.",
    learn: [
      "The four things every LS-DYNA model needs: shape, mesh, material, supports",
      "Importing an IGES file and meshing it with the Auto Mesher",
      "Why LS-DYNA has no units — and how E = 72 instead of 72e9 makes aluminium a billion times too soft",
      "Writing the *MAT_ELASTIC card: E = 72e9 Pa, density 2850 kg/m³",
      "Fixing the bolt holes with an SPC, all six directions",
      "Three checks to make before any load goes on",
    ],
    chapters: [
      { at: "0:00", label: "The unit mistake that turns aluminium into rubber" },
      { at: "0:22", label: "Recap and today's plan" },
      { at: "0:45", label: "Every LS-DYNA model: shape, mesh, material, supports" },
      { at: "1:05", label: "The shape (IGES)" },
      { at: "1:22", label: "The mesh" },
      { at: "1:53", label: "The material" },
      { at: "2:13", label: "LS-DYNA has no units" },
      { at: "2:45", label: "The supports" },
      { at: "3:06", label: "Import the IGES file" },
      { at: "4:00", label: "Mesh with the Auto Mesher" },
      { at: "6:45", label: "Material card (*MAT_ELASTIC)" },
      { at: "9:24", label: "SPC on the bolt holes" },
      { at: "12:19", label: "4 mistakes to avoid" },
      { at: "13:35", label: "3 checks before the load" },
      { at: "14:14", label: "Recap and next episode" },
    ],
    files: [BRACKET_IGES],
  },
];

export function findEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

/** The episode's own files first, then its series'. */
export function filesFor(episode: Episode): LibraryFile[] {
  const own = episode.files ?? [];
  const shared = series.find((s) => s.key === episode.series)?.files ?? [];
  return [...own, ...shared.filter((f) => !own.includes(f))];
}

export function neighbours(episode: Episode): { prev?: Episode; next?: Episode } {
  const i = episodes.indexOf(episode);
  return { prev: episodes[i - 1], next: episodes[i + 1] };
}

/** "13:35" → 815, for starting the player at a chapter. */
export function seconds(at: string): number {
  return at.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}
