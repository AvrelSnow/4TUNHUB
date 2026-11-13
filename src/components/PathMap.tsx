"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/lib/path-progress";
import { cn } from "@/lib/cn";
import type { PathCard } from "@/lib/engineering-thinking";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The path as a route down the page: each card with what it needs, what
 * it gives and its lessons, ticked from what this device remembers. A card
 * still waiting on the Lab's checker shows its promise and nothing more.
 */

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

export function PathMap({
  cards,
  hrefs,
  t,
}: {
  cards: PathCard[];
  /** Lesson id → localized URL. */
  hrefs: Record<string, string>;
  t: Dictionary["path"];
}) {
  const { seen, parts } = useProgress();
  const label = (c: PathCard) => (c.kind === "card" ? `${t.card} ${c.number}` : (t.kinds[c.kind] ?? c.kind));
  const name = (c: PathCard) => t.cards[c.id]?.title ?? c.title;
  const ables = (c: PathCard) => t.cards[c.id]?.able ?? c.able;
  const labelOf = (id: string) => {
    const c = cards.find((x) => x.id === id);
    return c ? label(c) : id;
  };

  // The one next lesson: the first open one not yet read to the end.
  const order = cards.flatMap((c) => (c.open ? c.lessons.map((l) => l.id) : []));
  const nextId = order.find((id) => !seen[id]) ?? order[0];
  const started = order.some((id) => seen[id] || (parts[id] ?? 0) > 1);

  return (
    <div>
      <Button as="a" href={hrefs[nextId]} size="lg">
        {started ? t.resume : t.start}
      </Button>

      <ol className="relative mt-12 space-y-5 before:absolute before:top-3 before:bottom-3 before:left-[11px] before:border-l-2 before:border-dashed before:border-hairline">
        {cards.map((c) => {
          const done = c.lessons.filter((l) => seen[l.id]).length;
          const cleared = c.open && c.lessons.length > 0 && done === c.lessons.length;
          const minutes = c.lessons.reduce((m, l) => m + l.minutes, 0);
          return (
            <li key={c.id} className="relative pl-10">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-6 left-0.5 z-10 h-5 w-5 border-2 bg-background",
                  c.kind === "boss" ? "rotate-45 rounded-md" : "rounded-full",
                  cleared ? "border-foreground bg-foreground" : done > 0 ? "border-foreground" : "border-hairline",
                )}
              />
              <div
                className={cn(
                  "rounded-3xl border border-border bg-surface-2 p-6 shadow-e1 sm:p-7",
                  !c.open && "opacity-70",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{label(c)}</span>
                  {c.open ? (
                    c.lessons.length > 0 && (
                      <span className="readout">
                        {fmt(t.lessonsCount, { n: c.lessons.length, m: minutes })}
                      </span>
                    )
                  ) : (
                    <Badge variant="outline">{t.coming}</Badge>
                  )}
                </div>
                <h2 className="mt-2 text-headline text-foreground">{name(c)}</h2>

                {c.open ? (
                  <>
                    <p className="mt-2 text-muted">{ables(c).join(" ")}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                        <span
                          className="block h-full rounded-full bg-foreground transition-[width] duration-500"
                          style={{ width: `${Math.round((100 * done) / Math.max(1, c.lessons.length))}%` }}
                        />
                      </span>
                      <span className="readout whitespace-nowrap">
                        {fmt(t.lessonsDone, { n: done, t: c.lessons.length })}
                      </span>
                    </div>
                    <ol className="mt-4 grid gap-1.5">
                      {c.lessons.map((l, i) => (
                        <li key={l.id}>
                          <Link
                            href={hrefs[l.id]}
                            className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface px-3 py-2.5 text-foreground transition-colors hover:bg-border"
                          >
                            <span
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border text-2xs font-bold",
                                seen[l.id]
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-hairline bg-background",
                              )}
                            >
                              {seen[l.id] ? "✓" : i + 1}
                            </span>
                            <span className="text-sm font-medium">{l.title}</span>
                            <span className="readout">~{l.minutes} min</span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-muted">{ables(c).join(" ")}</p>
                    <p className="mt-3 text-sm text-muted">{t.comingBody}</p>
                    {c.requires.length > 0 && (
                      <p className="readout mt-3">
                        {t.opensAfter}: {c.requires.map(labelOf).join(", ")}
                      </p>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
