import { Badge } from "./Badge";
import { cn } from "@/lib/cn";

/**
 * ============================================================
 * EMPTY STATE — the honest zero, rendered as a reading.
 * ============================================================
 * Three pillars ship with nothing in them on purpose: the store
 * (`catalog`), the blog (`posts`) and careers (`roles`). Each one
 * had hand-written JSX for the same dashed box, which produced the
 * exact failure the art direction names — three pages whose main
 * panel is indistinguishable, which is the strongest signal a site
 * can send that it is a template.
 *
 * So the zero stops being an apology in a dashed box and becomes an
 * instrument reading. The panel carries the frame (corner ticks, a
 * mono readout in the gutter) and a gauge rule across the top whose
 * flow-ramp segment is scaled to `fill` — the fraction of the range
 * actually occupied. At zero the ramp has no width and the rule is
 * bare hairline, which is not a styling accident: it is the page's
 * argument drawn to scale. The instant real data lands the caller
 * stops rendering this and shows the grid instead, so the ramp is
 * only ever seen growing from a true reading.
 *
 * `readout` is what makes the three panels distinguishable — it names
 * the quantity being measured ("0 ITEMS LISTED", "0 POSTS PUBLISHED",
 * "0 ROLES OPEN"), so a visitor moving between them reads three
 * different gauges rather than one template three times.
 */
export function EmptyState({
  readout,
  eyebrow,
  title,
  body,
  fill = 0,
  className,
  children,
}: {
  /** Mono gutter label naming the measured quantity. */
  readout: string;
  eyebrow: string;
  title: string;
  body: string;
  /** 0–1. The occupied fraction of the range; 0 leaves bare hairline. */
  fill?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const width = `${Math.max(0, Math.min(1, fill)) * 100}%`;

  return (
    <div
      className={cn(
        "ticks relative rounded-2xl border border-dashed border-hairline bg-surface p-8 sm:p-12",
        className,
      )}
    >
      {/* The gauge. Hairline is the full range; the ramp is the reading. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-hairline" />
      <span
        aria-hidden="true"
        className="flow-rule absolute left-0 top-0 h-px"
        style={{ width }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="outline" className="w-fit">
          {eyebrow}
        </Badge>
        <span className="readout">{readout}</span>
      </div>
      <h2 className="mt-5 max-w-2xl text-display-sm text-foreground">{title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{body}</p>
      {children}
    </div>
  );
}
