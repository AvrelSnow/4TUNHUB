import { cn } from "@/lib/cn";

type Variant = "amber" | "neutral" | "outline";

const variants: Record<Variant, string> = {
  amber: "bg-brand-500/15 text-accent border-brand-500/40",
  neutral: "bg-surface-2 text-foreground border-hairline",
  outline: "border-dashed bg-transparent text-muted border-hairline",
};

/** Small status/category chip. One family, three intents. */
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
