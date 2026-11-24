"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/lib/path-progress";
import { toggleTick, useTicks } from "@/lib/route-progress";
import { cn } from "@/lib/cn";
import type { RouteItem, RouteStage } from "@/lib/route";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The route as a board: a dashboard on top (what this device remembers),
 * then the groups and stages in order. The foundation's lessons tick
 * themselves from the guided path's own progress; videos and links are
 * ticked by the learner, and say so. A stage that is not built yet shows
 * "coming" with no link and is never counted.
 */

type T = Dictionary["route"];

export type BoardStage = RouteStage & {
  /** Localised address for each item that has one. */
  hrefs: Record<string, string>;
};

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

const GROUP_ORDER = ["foundation", "simulation", "solidworks", "tolerances", "cohort"] as const;

export function RouteBoard({
  stages,
  firstLessonHref,
  lessonHrefs,
  t,
}: {
  stages: BoardStage[];
  firstLessonHref: string;
  /** Lesson id → localised address, in path order. */
  lessonHrefs: { id: string; href: string; minutes: number }[];
  t: T;
}) {
  const { seen } = useProgress();
  const ticks = useTicks();

  const isDone = (item: RouteItem) => (item.auto ? !!seen[item.id] : !!ticks[item.id]);
  const countable = (s: BoardStage) => s.items.filter((i) => !i.coming);

  const lessonsDone = lessonHrefs.filter((l) => seen[l.id]).length;
  const minutesLeft = lessonHrefs.filter((l) => !seen[l.id]).reduce((m, l) => m + l.minutes, 0);
  const ownTicks = Object.keys(ticks).length;
  const nextLesson = lessonHrefs.find((l) => !seen[l.id]);
  const started = lessonsDone > 0 || ownTicks > 0;

  return (
    <div>
      {/* DASHBOARD */}
      <div className="rounded-3xl bg-surface p-7 sm:p-9">
        <p className="eyebrow">{t.dashboard.title}</p>
        {!started ? (
          <>
            <p className="mt-3 text-lead text-muted">{t.dashboard.empty}</p>
            <div className="mt-6">
              <Button as="a" href={firstLessonHref} size="lg">
                {t.dashboard.start}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-full rounded-full bg-foreground transition-[width] duration-500"
                  style={{ width: `${Math.round((100 * lessonsDone) / Math.max(1, lessonHrefs.length))}%` }}
                />
              </span>
              <span className="readout whitespace-nowrap">
                {fmt(t.dashboard.lessons, { n: lessonsDone, t: lessonHrefs.length })}
              </span>
            </div>
            <ul className="mt-4 grid gap-1 text-sm text-muted">
              <li>{nextLesson ? fmt(t.dashboard.left, { m: minutesLeft }) : t.dashboard.foundationDone}</li>
              {ownTicks > 0 && <li>{fmt(t.dashboard.ticked, { n: ownTicks })}</li>}
            </ul>
            {nextLesson && (
              <div className="mt-6">
                <Button as="a" href={nextLesson.href} size="lg">
                  {t.dashboard.resume}
                </Button>
              </div>
            )}
          </>
        )}
        <p className="readout mt-6">{t.dashboard.device}</p>
      </div>

      {/* GROUPS */}
      {GROUP_ORDER.map((group) => {
        const inGroup = stages.filter((s) => s.group === group);
        if (inGroup.length === 0) return null;
        const copy = t.groups[group];
        return (
          <section key={group} className="mt-14">
            <h2 className="text-headline text-foreground">{copy.title}</h2>
            <p className="mt-2 max-w-2xl text-muted">{copy.body}</p>
            <ol className="relative mt-8 space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[11px] before:border-l-2 before:border-dashed before:border-hairline">
              {inGroup.map((s) => {
                const stageCopy = t.stages[s.id];
                const items = countable(s);
                const done = items.filter(isDone).length;
                const allComing = items.length === 0;
                const minutes = s.items.reduce((m, i) => m + (i.coming ? 0 : (i.minutes ?? 0)), 0);
                const finished = !allComing && done === items.length;
                return (
                  <li key={s.id} className="relative pl-10">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-6 left-0.5 z-10 h-5 w-5 border-2 bg-background",
                        s.kind === "check" ? "rotate-45 rounded-md" : "rounded-full",
                        finished ? "border-foreground bg-foreground" : done > 0 ? "border-foreground" : "border-hairline",
                      )}
                    />
                    <div
                      className={cn(
                        "rounded-3xl border border-border bg-surface-2 p-6 shadow-e1 sm:p-7",
                        allComing && "opacity-70",
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow">
                          {s.kind === "check" ? t.labels.check : t.labels.stage} {s.mark}
                        </span>
                        {allComing ? (
                          <Badge variant="outline">{t.labels.comingBadge}</Badge>
                        ) : (
                          <span className="readout">{fmt(t.labels.progress, { n: done, t: items.length })}</span>
                        )}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{stageCopy.title}</h3>
                      <p className="mt-2 text-muted">{stageCopy.body}</p>

                      {(minutes > 0 || s.workHours) && (
                        <p className="readout mt-3">
                          {[
                            minutes > 0 ? fmt(t.labels.content, { m: minutes }) : null,
                            s.workHours ? fmt(t.labels.work, { h: s.workHours }) : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}

                      <ul className="mt-4 grid gap-1.5">
                        {s.items.map((item) => {
                          const title = item.title ?? t.items[item.titleKey ?? ""] ?? item.id;
                          const href = s.hrefs[item.id];
                          const ticked = isDone(item);
                          return (
                            <li
                              key={item.id}
                              className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface px-3 py-2.5"
                            >
                              {item.coming ? (
                                <span aria-hidden="true" className="h-7 w-7 rounded-full border border-dashed border-hairline" />
                              ) : item.auto ? (
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-full border text-2xs font-bold",
                                    ticked ? "border-foreground bg-foreground text-background" : "border-hairline bg-background",
                                  )}
                                >
                                  {ticked ? "✓" : ""}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={ticked}
                                  aria-label={`${t.labels.markDone}: ${title}`}
                                  onClick={() => toggleTick(item.id)}
                                  className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-full border text-2xs font-bold",
                                    ticked ? "border-foreground bg-foreground text-background" : "border-hairline bg-background",
                                  )}
                                >
                                  {ticked ? "✓" : ""}
                                </button>
                              )}
                              {item.coming || !href ? (
                                <span className="text-sm font-medium text-muted">{title}</span>
                              ) : (
                                <a
                                  href={href}
                                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                  className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                  {title}
                                  {item.external ? " ↗" : ""}
                                </a>
                              )}
                              <span className="readout">
                                {item.coming ? t.labels.comingBadge : item.minutes ? fmt(t.labels.minutes, { m: item.minutes }) : ""}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {allComing && <p className="mt-3 text-sm text-muted">{t.labels.comingNote}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
