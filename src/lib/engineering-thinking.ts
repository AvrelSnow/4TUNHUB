import data from "@/content/engineering-thinking.json";

/**
 * ENGINEERING THINKING — Branch 1 of the 4TUNHUB Lab, as a guided path in
 * the Academy.
 *
 * The lessons are written and checked in the Lab (C:\4TUNHUBLAB.COM,
 * paths/branch-1) and exported by scripts/export-lab-path.py, which runs
 * the Lab's own engine: every number is the challenge's own, every check
 * carries the band of answers the grader would accept. Nothing here holds
 * a formula or an answer. Edit a lesson in the Lab, then re-run the export.
 *
 * The lessons are in English; the page around them is bilingual.
 */

export const PATH_ROOT = "/academy/engineering-thinking";

export const lessonPath = (id: string) => `${PATH_ROOT}/${id}`;

export type PathCard = {
  id: string;
  kind: "card" | "checkpoint" | "boss";
  number: number | null;
  title: string;
  need: string[];
  able: string[];
  requires: string[];
  /** False for what still needs the Lab's checker. */
  open: boolean;
  lessons: { id: string; title: string; minutes: number }[];
};

export type PathLesson = {
  title: string;
  minutes: number;
  card: string;
  /** The Lab's rendered markup, one entry per part of the lesson. */
  steps: string[];
};

export const path = data as {
  source: string;
  title: string;
  tagline: string;
  need: string[];
  able: string[];
  cards: PathCard[];
  lessons: Record<string, PathLesson>;
};

export const lessonIds = Object.keys(path.lessons);

export function findLesson(id: string) {
  const lesson = path.lessons[id];
  if (!lesson) return undefined;
  const card = path.cards.find((c) => c.id === lesson.card)!;
  const index = card.lessons.findIndex((l) => l.id === id);
  const order = path.cards.flatMap((c) => (c.open ? c.lessons.map((l) => l.id) : []));
  const at = order.indexOf(id);
  return {
    id,
    lesson,
    card,
    index,
    prev: order[at - 1] as string | undefined,
    next: order[at + 1] as string | undefined,
  };
}

export const totalMinutes = (card: PathCard) => card.lessons.reduce((m, l) => m + l.minutes, 0);
