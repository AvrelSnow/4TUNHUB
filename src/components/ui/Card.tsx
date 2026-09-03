import { cn } from "@/lib/cn";

/**
 * Instrument panel — the surface primitive (art-direction §"instrument frame").
 * Every pillar tile, resource and course card is built on this, so the
 * ecosystem stays coherent as it grows.
 *
 * `interactive` adds the instrument behaviour: corner ticks appear and a
 * flow-ramp rule wipes across the top edge on hover. The panel lifts by a
 * hairline, not by a drop shadow — elevation on a dark ground is light.
 */
export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-surface p-6",
        interactive &&
          "ticks group transition-colors duration-300 ease-out before:opacity-0 after:opacity-0 before:transition-opacity after:transition-opacity before:duration-300 after:duration-300 hover:border-hairline hover:bg-surface-2 hover:shadow-e2 hover:before:opacity-100 hover:after:opacity-100",
        className,
      )}
    >
      {interactive && (
        <span
          aria-hidden="true"
          className="flow-rule absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-x-100"
        />
      )}
      {children}
    </div>
  );
}
