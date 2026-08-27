import { cn } from "@/lib/cn";

/**
 * Stat block — a single number with its label. Digits are tabular
 * (precision contract §8) so rows of stats never jitter.
 */
export function Stat({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-background px-5 py-4", className)}>
      <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
