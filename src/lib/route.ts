import { path, lessonPath } from "@/lib/engineering-thinking";
import { episodePath, episodes } from "@/lib/lsdyna";
import { freeResourceGroups } from "@/lib/free-resources";

/**
 * THE ROUTE — how someone moves through the free Academy: a shared
 * foundation, then one of two tracks, then the cohort. The design and the
 * reasons are in docs/academy-route.md; this file only turns it into data.
 *
 * Everything listed here is built from what really exists: the path's open
 * lessons, the library's episodes, the Free places list. What does not exist
 * yet (the Lab's practice problems) is an item with `coming` and no link, and
 * is never counted in a total.
 *
 * Words are not here: stage and item titles that are ours live in the
 * dictionaries (`route`), keyed by `id` / `titleKey`. Lesson, episode and
 * resource titles are the owners' own and stay as they are.
 */

export type RouteItem = {
  id: string;
  /** The owner's own title (a lesson, an episode, a resource). */
  title?: string;
  /** Else: our own words, in `route.items[titleKey]`. */
  titleKey?: string;
  /** An internal path (localised by the page) or an external address. */
  href?: string;
  external?: boolean;
  minutes?: number;
  /** Not built yet: no link, never counted. */
  coming?: boolean;
  /** Ticked by the guided path's own progress, not by the learner. */
  auto?: boolean;
};

export type StageKind = "stage" | "check";

export type RouteStage = {
  id: string;
  group: "foundation" | "simulation" | "solidworks" | "tolerances" | "cohort";
  kind: StageKind;
  /** Short label on the stage's marker: F, A1, B2... */
  mark: string;
  items: RouteItem[];
  /** Estimated hours of the learner's own work. An estimate, never a measurement. */
  workHours?: number;
};

const minutesOf = (length?: string) => {
  if (!length) return undefined;
  const [m, s] = length.split(":").map(Number);
  return Math.max(1, Math.round((m * 60 + (s || 0)) / 60));
};

const episodesOf = (series: string): RouteItem[] =>
  episodes
    .filter((e) => e.series === series)
    .map((e) => ({
      id: `ep:${e.slug}`,
      title: e.title,
      href: episodePath(e.slug),
      minutes: minutesOf(e.length),
    }));

const everyResource = freeResourceGroups.flatMap((g) => g.items);

/** A Free places entry, found by a piece of its address. A missing one fails the build, so the route cannot point at something removed. */
function resource(needle: string): RouteItem {
  const r = everyResource.find((x) => x.url.includes(needle));
  if (!r) throw new Error(`route.ts: no free resource whose address contains "${needle}"`);
  return { id: `res:${needle}`, title: r.name, href: r.url, external: !r.internal };
}

const foundationLessons: RouteItem[] = path.cards
  .filter((c) => c.open)
  .flatMap((c) =>
    c.lessons.map((l) => ({ id: l.id, title: l.title, href: lessonPath(l.id), minutes: l.minutes, auto: true })),
  );

export const routeStages: RouteStage[] = [
  { id: "foundation", group: "foundation", kind: "stage", mark: "F", items: foundationLessons, workHours: 1.5 },

  { id: "setup", group: "simulation", kind: "stage", mark: "A1", items: episodesOf("setup"), workHours: 1 },
  { id: "ballplate", group: "simulation", kind: "stage", mark: "A2", items: episodesOf("ball-plate"), workHours: 3.5 },
  {
    id: "checkA",
    group: "simulation",
    kind: "check",
    mark: "A",
    items: [{ id: "lab:p005", titleKey: "p005", coming: true }],
  },
  { id: "bracket", group: "simulation", kind: "stage", mark: "A3", items: episodesOf("bracket-static"), workHours: 1.5 },

  {
    id: "software",
    group: "solidworks",
    kind: "stage",
    mark: "B1",
    items: [{ id: "get-solidworks", titleKey: "getSolidworks", href: "/resources" }],
    workHours: 0.5,
  },
  {
    id: "basics",
    group: "solidworks",
    kind: "stage",
    mark: "B2",
    items: [resource("swconntutorial")],
    workHours: 3,
  },
  {
    id: "exam",
    group: "solidworks",
    kind: "stage",
    mark: "B3",
    items: [resource("swugn.org"), resource("solidworks.com/fr/media"), resource("solidworks.com/solution/education/practice-problems")],
    workHours: 2,
  },
  {
    id: "checkB",
    group: "solidworks",
    kind: "check",
    mark: "B",
    items: [
      { id: "lab:p001", titleKey: "p001", coming: true },
      { id: "lab:p002", titleKey: "p002", coming: true },
      { id: "lab:p003", titleKey: "p003", coming: true },
    ],
  },

  {
    id: "tolerances",
    group: "tolerances",
    kind: "stage",
    mark: "T",
    items: [
      resource("3787-tolerancement-gps"),
      { id: "lab:p004", titleKey: "p004", coming: true },
      { id: "lab:p006", titleKey: "p006", coming: true },
    ],
  },

  {
    id: "cohort",
    group: "cohort",
    kind: "stage",
    mark: "C",
    items: [{ id: "cohort", titleKey: "cohort", href: "/waitlist?track=academy" }],
  },
];

export const ROUTE_PATH = "/academy/route";

/** Lessons the foundation is made of, in order: the dashboard's "next" and "left". */
export const foundationOrder = foundationLessons.map((l) => ({ id: l.id, minutes: l.minutes ?? 0 }));
