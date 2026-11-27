/**
 * Inspection stamps per card, as the Lab counts them (4tunlab/uptime.marks):
 *
 *   Seen       every lesson of the card finished
 *   Practised  Seen, and every check of those lessons passed without
 *              showing the working
 *   Proven     every bracket step the card teaches cleared
 *
 * A card that teaches no bracket step cannot be Proven here: its proof is the
 * modelled part, which nothing on this site checks. Nothing is stored; the
 * stamps are derived from what the device remembers, every time.
 */

export type MarkCard = {
  id: string;
  number: number;
  /** Each lesson of the card, with the ids of its checks. */
  lessons: { id: string; checks: string[] }[];
  feeds: string[];
};

export type Level = "seen" | "practised" | "proven";

export type Marks = {
  card: MarkCard;
  lessonsDone: number;
  checksLeft: number;
  seen: boolean;
  practised: boolean;
  /** False when the card teaches no bracket step. */
  provable: boolean;
  proven: boolean;
};

export function marks(
  cards: MarkCard[],
  seen: Record<string, true>,
  passed: Record<string, true>,
  /** Bracket steps ever cleared. */
  proved: Record<string, true>,
): Marks[] {
  return cards.map((card) => {
    const lessonsDone = card.lessons.filter((l) => seen[l.id]).length;
    const checksLeft = card.lessons.flatMap((l) => l.checks).filter((c) => !passed[c]).length;
    const isSeen = card.lessons.length > 0 && lessonsDone === card.lessons.length;
    const provable = card.feeds.length > 0;
    return {
      card,
      lessonsDone,
      checksLeft,
      seen: isSeen,
      practised: isSeen && checksLeft === 0,
      provable,
      proven: provable && card.feeds.every((s) => proved[s]),
    };
  });
}

/** Ids of every stamp earned, such as "card-2:practised". */
export const earned = (all: Marks[]) =>
  all.flatMap((m) =>
    (["seen", "practised", "proven"] as const).filter((l) => m[l]).map((l) => `${m.card.id}:${l}`),
  );
