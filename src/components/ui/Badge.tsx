import { cn } from "@/lib/cn";

type Variant = "amber" | "neutral" | "outline";

const variants: Record<Variant, string> = {
  amber: "bg-brand-100 text-brand-800 border-brand-300",
  neutral: "bg-ink-100 text-ink-700 border-ink-300",
  outline: "border-dashed bg-transparent text-ink-500 border-ink-300",
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
