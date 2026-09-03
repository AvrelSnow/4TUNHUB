import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

// Instruments are not pill-shaped (art-direction §"colour"/radii): the
// control reads as a machined key, not a bubble.
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-brand-400 shadow-e1 active:scale-[0.98]",
  secondary:
    "border border-hairline bg-surface text-foreground hover:border-brand-500 hover:bg-surface-2 hover:text-accent active:scale-[0.98]",
  ghost: "text-muted hover:text-foreground hover:bg-surface",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: "a" } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.as === "a") {
    const { as: _as, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }
  const { as: _as, ...rest } = props as { as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
