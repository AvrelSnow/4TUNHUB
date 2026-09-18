import { cn } from "@/lib/cn";

type Variant = "amber" | "neutral" | "outline";

const variants: Record<Variant, string> = {
  /**
   * `badge-amber` is a hook, not a style: the utilities below are the night
   * chip, and globals.css re-inks it for the day sheet. Measured, because
   * the failure here is not a contrast one — the text clears AA on both
   * grounds (5.23:1 on paper) — it is that the tinted chip is 1.09:1
   * against the panel it sits on, so the one element whose entire job is to
   * say LIVE NOW becomes invisible in daylight. Amber glows on black and
   * has to be inked on paper, exactly as the primary button is.
   */
  amber: "badge-amber bg-brand-500/15 text-accent border-brand-500/40",
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
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
