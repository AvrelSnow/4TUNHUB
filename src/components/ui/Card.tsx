import { cn } from "@/lib/cn";

/**
 * Instrument panel — the surface primitive (art-direction §"instrument frame").
 * Every pillar tile, resource and course card is built on this, so the
 * ecosystem stays coherent as it grows.
 *
 * The corner ticks are always drawn. They used to appear only on hover,
 * which left every card at rest a plain rounded box, the one shape that
 * says "template" fastest. The frame is the identity, so it is permanent;
 * hover adds the behaviour: the ticks brighten and a flow-ramp rule wipes
 * across the top edge. The panel lifts by a hairline, not a drop shadow —
 * elevation on a dark ground is light.
 *
 * `readout` is the mono label in the frame's top-right gutter (an index,
 * a reference), the way a figure on a drawing carries its number.
 */
export function Card({
  className,
  interactive = false,
  readout,
  children,
}: {
  className?: string;
  interactive?: boolean;
  readout?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "ticks relative overflow-hidden rounded-xl border border-border bg-surface p-6",
        interactive &&
          "group transition-colors duration-300 ease-out before:transition-colors after:transition-colors before:duration-300 after:duration-300 hover:border-hairline hover:bg-surface-2 hover:shadow-e2 hover:before:border-accent hover:after:border-accent",
        className,
      )}
    >
      {interactive && (
        <span
          aria-hidden="true"
          className="flow-rule absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-x-100"
        />
      )}
      {readout && (
        <span aria-hidden="true" className="readout absolute right-3 top-1.5">
          {readout}
        </span>
      )}
      {children}
    </div>
  );
}
