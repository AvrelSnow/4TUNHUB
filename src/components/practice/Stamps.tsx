import { cn } from "@/lib/cn";
import type { Level, Marks } from "@/lib/marks";

/**
 * A card's inspection stamps. An earned stamp is solid and slightly turned,
 * as pressed by hand; one still to earn is a dashed outline, and says so to a
 * screen reader.
 */
export type StampWords = Record<Level, string> & { notYet: string; label: string };

export function Stamps({ mark, t, className }: { mark: Marks; t: StampWords; className?: string }) {
  const levels: Level[] = mark.provable ? ["seen", "practised", "proven"] : ["seen", "practised"];
  return (
    <ul aria-label={t.label} className={cn("flex flex-wrap gap-2", className)}>
      {levels.map((level) => (
        <li
          key={level}
          className={cn(
            "rounded-md px-2.5 py-0.5 text-2xs font-bold",
            mark[level]
              ? cn("-rotate-3 border-success text-success", level === "proven" ? "border-4 border-double" : "border-2")
              : "border-2 border-dashed border-hairline text-muted",
          )}
        >
          {t[level]}
          {!mark[level] && <span className="sr-only">: {t.notYet}</span>}
        </li>
      ))}
    </ul>
  );
}
