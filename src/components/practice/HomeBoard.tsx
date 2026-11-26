"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { earned, marks, type Level, type MarkCard } from "@/lib/marks";
import {
  readNumber,
  readProgress,
  updateProgress,
  useProgress,
  withToday,
  type Progress,
} from "@/lib/path-progress";
import { usePractice, type Practice } from "@/lib/practice/progress";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The board at the top of Engineering Thinking. A first visit gets one
 * question to answer at once. A return gets what changed, one button back to
 * the exact place, and how far the next stamp is.
 */

export type BoardLesson = { id: string; title: string; href: string; parts: number };
export type BoardPage = { title: string; href: string };

export type BoardProps = {
  /** The path's lessons, in order. */
  lessons: BoardLesson[];
  warmups: Record<string, BoardPage & { parts: number }>;
  challenges: Record<string, BoardPage>;
  cards: MarkCard[];
  bracketId: string;
  practiceHref: string;
  /** The first-visit question: a check of the first lesson, with its band. */
  taster: { id: string; lo: number; hi: number };
  lang: string;
  t: Dictionary["board"];
  check: Dictionary["path"]["check"];
};

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

const ACTION =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-2 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary-hover";

const never = () => () => {};

export function HomeBoard(props: BoardProps) {
  // The server cannot know what this device remembers: draw nothing of it
  // until the page is in the browser.
  const mounted = useSyncExternalStore(never, () => true, () => false);
  const progress = useProgress();
  const practice = usePractice();
  const [tried, setTried] = useState(false);

  if (!mounted) return <div aria-hidden="true" className="min-h-72 rounded-3xl bg-ink-900" />;

  const started =
    Object.keys(progress.seen).length > 0 ||
    Object.keys(progress.passed).length > 0 ||
    Object.values(progress.parts).some((n) => n > 1) ||
    Object.values(practice).some((e) => e.cleared || Object.keys(e.run?.results ?? {}).length > 0);

  return (
    <div className="min-h-72 rounded-3xl bg-ink-900 p-6 text-white sm:p-8">
      {started && !tried ? (
        <Welcome {...props} progress={progress} practice={practice} />
      ) : (
        <Taster
          {...props}
          // False again after starting over.
          done={tried && !!progress.passed[props.taster.id]}
          onRight={() => setTried(true)}
        />
      )}
    </div>
  );
}

function Taster({
  taster,
  lessons,
  lang,
  t,
  check,
  done,
  onRight,
}: BoardProps & { done: boolean; onRight: () => void }) {
  const [text, setText] = useState("");
  const [said, setSaid] = useState<"" | "miss">("");
  const [unread, setUnread] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const read = readNumber(text, lang);
    if ("error" in read) return setUnread(check[read.error]);
    setUnread("");
    const v = Math.abs(read.value);
    if (v < taster.lo - 1e-9 || v > taster.hi + 1e-9) return setSaid("miss");
    onRight();
    updateProgress((p) => withToday({ ...p, passed: { ...p.passed, [taster.id]: true } }));
  };

  return (
    <>
      <p className="text-sm font-semibold text-brand-500">{t.tryNow}</p>
      <h2 className="mt-1 text-headline">{t.question}</h2>
      <p className="mt-2 text-sm text-white/70">{t.given}</p>
      {done ? (
        <div role="status" className="mt-5">
          <p className="font-semibold">✓ {t.right}</p>
          <p className="mt-1 text-sm text-white/70">{t.rightBody}</p>
          <Link href={lessons[0].href} className={`${ACTION} mt-5`}>
            {t.start}
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-5">
          <div className="flex flex-wrap gap-3">
            <label className="flex min-w-48 flex-1 items-center gap-2 rounded-full bg-white px-5 text-ink-900">
              <span className="sr-only">{t.answer}</span>
              <input
                inputMode="decimal"
                autoComplete="off"
                placeholder={t.answer}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setSaid("");
                  setUnread("");
                }}
                className="h-12 w-full min-w-0 bg-transparent tabular-nums"
              />
              <span aria-hidden="true">N</span>
            </label>
            <button type="submit" className={ACTION}>
              {t.check}
            </button>
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-white/80">
            {unread || (said === "miss" ? t.miss : "")}
          </p>
          <Link href={lessons[0].href} className="mt-2 inline-block text-sm text-white/70 underline underline-offset-4">
            {t.skip}
          </Link>
        </form>
      )}
    </>
  );
}

/** Where to go back to: the last page if unfinished, else the next lesson. */
function resume(p: Progress, practice: Practice, { lessons, warmups, challenges, practiceHref, t }: BoardProps) {
  const at = (id: string, parts: number) => fmt(t.part, { n: Math.min(p.parts[id] ?? 1, parts), t: parts });
  const { last } = p;
  if (last?.kind === "challenge" && challenges[last.id] && !practice[last.id]?.cleared) {
    return { ...challenges[last.id], detail: t.challenge };
  }
  if (last?.kind === "warmup" && warmups[last.id] && !p.seen[last.id]) {
    return { ...warmups[last.id], detail: at(last.id, warmups[last.id].parts) };
  }
  const current = last?.kind === "lesson" ? lessons.find((l) => l.id === last.id && !p.seen[l.id]) : undefined;
  const lesson = current ?? lessons.find((l) => !p.seen[l.id]);
  if (lesson) return { title: lesson.title, href: lesson.href, detail: at(lesson.id, lesson.parts) };
  return { title: t.allRead, href: practiceHref, detail: t.allReadBody };
}

function Welcome(props: BoardProps & { progress: Progress; practice: Practice }) {
  const { progress, practice, cards, bracketId, t } = props;
  const all = marks(cards, progress.seen, progress.passed, practice[bracketId]?.proved ?? {});
  const stamps = earned(all);
  const name = (stamp: string) => {
    const [id, level] = stamp.split(":");
    return fmt(t.stampName, {
      c: cards.find((c) => c.id === id)?.number ?? "",
      level: t.levels[level as Level],
    });
  };

  // Stamps earned since the board was last open, announced once.
  const [fresh] = useState(() => {
    const noted = new Set(readProgress().noted);
    return stamps.filter((s) => !noted.has(s));
  });
  useEffect(() => {
    if (fresh.length) updateProgress((p) => ({ ...p, noted: [...new Set([...p.noted, ...fresh])] }));
  }, [fresh]);

  const to = resume(progress, practice, props);

  // The nearest stamp: lessons to Seen, then checks to Practised.
  const next = all.find((m) => !m.practised);
  const distance = !next
    ? ""
    : next.seen
      ? fmt(next.checksLeft === 1 ? t.oneCheck : t.checks, { n: next.checksLeft, c: next.card.number })
      : fmt(next.card.lessons.length - next.lessonsDone === 1 ? t.oneLesson : t.lessons, {
          n: next.card.lessons.length - next.lessonsDone,
          c: next.card.number,
        });

  return (
    <>
      <p className="text-sm font-semibold text-brand-500">
        {fresh.length ? fmt(t.newStamp, { s: name(fresh[fresh.length - 1]) }) : t.welcome}
      </p>
      <h2 className="mt-1 text-headline">{to.title}</h2>
      <p className="mt-2 text-sm text-white/70">{to.detail}</p>
      <Link href={to.href} className={`${ACTION} mt-5`}>
        {t.continue}
      </Link>
      <dl className="mt-6 grid gap-3 border-t border-white/15 pt-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-white/60">{t.nextStamp}</dt>
          <dd className="font-semibold">{distance || t.allStamps}</dd>
        </div>
        <div>
          <dt className="text-white/60">{t.stampsEarned}</dt>
          <dd className="font-semibold tabular-nums">
            {fmt(t.of, { n: stamps.length, t: all.reduce((n, m) => n + (m.provable ? 3 : 2), 0) })}
          </dd>
        </div>
        <div>
          <dt className="text-white/60">{t.days}</dt>
          <dd className="font-semibold tabular-nums">{progress.days.length}</dd>
        </div>
      </dl>
    </>
  );
}
