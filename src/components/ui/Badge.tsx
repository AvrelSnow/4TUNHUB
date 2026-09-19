import { cn } from "@/lib/cn";

type Variant = "amber" | "neutral" | "outline";

const variants: Record<Variant, string> = {
  // Pale amber tint with accent text: 4.8:1 by day, 9:1 by night.
  amber: "bg-brand-500/15 text-accent",
  neutral: "bg-surface text-foreground",
  outline: "border border-hairline text-muted",
};

/** Small status or category label. One shape, three intents. */
export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-2xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
