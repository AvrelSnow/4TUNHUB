import { cn } from "@/lib/cn";

type Size = "narrow" | "default" | "wide";

const sizes: Record<Size, string> = {
  narrow: "max-w-3xl", // 768px — reading measure
  default: "max-w-6xl", // 1152px — grids
  wide: "max-w-7xl", // 1280px — full-bleed media rows
};

/** Horizontal rhythm wrapper. Three widths for the whole ecosystem. */
export function Container({
  size = "default",
  className,
  children,
}: {
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", sizes[size], className)}>
      {children}
    </div>
  );
}
