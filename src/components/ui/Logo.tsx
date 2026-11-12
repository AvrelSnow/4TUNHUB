import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * ============================================================
 * 4TUNHub logo — the one component for the brand mark (R4).
 * ============================================================
 * Standards enforced here so usage stays consistent:
 *  - SVG-only artwork (infinite scale, crisp at every density).
 *  - One drawn lockup: the logo is black and amber on white, and the
 *    site has one theme.
 *  - `variant`: "full" wordmark, or "mark" (roundel) for tight spaces.
 *  - `size`: fixed heights — the minimum (sm = 28px) is the floor;
 *    never render the logo smaller.
 *  - Clear-space: callers must leave ≥ the roundel's radius around it.
 *  - Hover: a subtle opacity dip when it links home; never distort.
 *  - Always carries an accessible name.
 * Plain <img>: trusted local SVGs need no image optimizer.
 */

type Variant = "full" | "mark";
type Size = "sm" | "md" | "lg";

/** Fixed heights. `sm` is the minimum permitted size. */
const sizeHeights: Record<Size, string> = {
  sm: "h-7", // 28px — floor
  md: "h-9", // 36px — default (nav/footer)
  lg: "h-12", // 48px — hero / large surfaces
};

/** The drawn files. A mark is not a token: never recolour it with a filter. */
const sources: Record<Variant, string> = {
  full: "/4tunhub-logo.svg",
  mark: "/4tunhub-mark.svg",
};

export function Logo({
  className,
  href = "/",
  variant = "full",
  size = "md",
}: {
  className?: string;
  href?: string | null;
  variant?: Variant;
  size?: Size;
}) {
  const height = sizeHeights[size];
  const src = sources[variant];

  const art = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="4TUNHub" className={cn(height, "w-auto", className)} />
  );

  if (href === null) {
    return <span className="inline-flex items-center">{art}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="4TUNHub — home"
      className="inline-flex items-center rounded-md transition-opacity duration-200 hover:opacity-80"
    >
      {art}
    </Link>
  );
}
