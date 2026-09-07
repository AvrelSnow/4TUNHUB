import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * ============================================================
 * 4TUN Hub logo — the one component for the brand mark (R4).
 * ============================================================
 * Standards enforced here so usage stays consistent:
 *  - SVG-only artwork (infinite scale, crisp at every density).
 *  - Dark is the only theme, so the dark lockup is the lockup.
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

/**
 * The site now runs two grounds, so the lockup is drawn twice: the dark
 * lockup sets its wordmark in #A8B0B8 for the night surface, the light one
 * in #14181D for the day sheet. Both ship in the markup and CSS picks with
 * `.only-light` / `.only-dark`, rather than JavaScript swapping a `src`
 * after mount — a logo that arrives one frame late is the most conspicuous
 * possible place to put a flash.
 *
 * They are two drawn files and not one recoloured file on purpose: a mark
 * is not a token, and pushing it through a filter is precisely what
 * art-direction §"imagery" rule 3 forbids.
 */
const sources: Record<Variant, { light: string; dark: string }> = {
  full: { light: "/4tunhub-logo.svg", dark: "/4tunhub-logo-dark.svg" },
  // The mark reads on either ground, so one asset serves both.
  mark: { light: "/4tunhub-mark.svg", dark: "/4tunhub-mark.svg" },
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

  // One alt text between them: this is one logo shown two ways, so a screen
  // reader must not hear the brand twice. The hidden copy is display:none,
  // which takes it out of the accessibility tree along with its alt.
  const art =
    src.light === src.dark ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src.dark} alt="4TUN Hub" className={cn(height, "w-auto", className)} />
    ) : (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src.dark}
          alt="4TUN Hub"
          className={cn("only-dark", height, "w-auto", className)}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src.light}
          alt="4TUN Hub"
          className={cn("only-light", height, "w-auto", className)}
        />
      </>
    );

  if (href === null) {
    return <span className="inline-flex items-center">{art}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="4TUN Hub — home"
      className="inline-flex items-center transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {art}
    </Link>
  );
}
