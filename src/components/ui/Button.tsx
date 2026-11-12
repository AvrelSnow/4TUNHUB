import { cn } from "@/lib/cn";

type Variant = "primary" | "ink" | "secondary" | "raised" | "ghost";
type Size = "sm" | "md" | "lg";

// Controls are pills. Focus uses the global :focus-visible outline.
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Amber: the logo's colour is the action colour, in both themes.
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  // Indigo: an action that should not compete with the amber one.
  ink: "bg-secondary text-secondary-foreground hover:opacity-90",
  secondary: "bg-surface text-foreground hover:bg-border",
  // Secondary for use on a grey band, where `surface` would disappear.
  raised: "bg-surface-2 text-foreground shadow-e1 hover:bg-border",
  ghost: "text-accent hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-4 text-2xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
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
