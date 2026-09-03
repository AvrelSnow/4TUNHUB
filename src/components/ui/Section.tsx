import { cn } from "@/lib/cn";
import { Container } from "./Container";

export type PatternVariant = "grid" | "dots" | "diamond" | "rings" | "hatch";

/**
 * Three rhythms, and only three (art-direction §"rhythm"). A page must not
 * use the same one three times running — uniform vertical padding is the
 * single strongest signal of a template.
 */
export type Rhythm = "compressed" | "normal" | "cinematic";

const rhythms: Record<Rhythm, string> = {
  compressed: "py-12 sm:py-16",
  normal: "py-20 sm:py-28",
  cinematic: "py-32 sm:py-44",
};

/**
 * Section shell — the repeatable vertical unit of the whole site.
 * eyebrow = mono readout label, title = section heading, intro = lead text.
 *
 * The header carries the instrument treatment: the eyebrow sits on a ticked
 * hairline that runs to the edge of the measure, so a section reads as a
 * labelled panel on a drawing rather than as a text block.
 *
 * `pattern` adds the lattice behind the content — one texture, at a density
 * you can actually see. `rings` is reserved for in-progress surfaces.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  pattern,
  backdrop,
  rhythm = "normal",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  pattern?: PatternVariant;
  /** Live layer rendered beneath the pattern — e.g. <FlowField />. */
  backdrop?: React.ReactNode;
  rhythm?: Rhythm;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  const layered = Boolean(pattern || backdrop);
  return (
    <section
      id={id}
      className={cn(rhythms[rhythm], layered && "relative overflow-hidden", className)}
    >
      {/* Order matters: the live field sits underneath the lattice, so the
          two read as one instrument — a measurement grid over moving flow. */}
      {backdrop}
      {pattern && <div aria-hidden="true" className={cn("pattern", `pattern-${pattern}`)} />}
      <Container className={cn(layered && "relative", containerClassName)}>
        {(eyebrow || title || intro) && (
          <div className="max-w-2xl">
            {eyebrow && (
              <div className="flex items-center gap-3">
                <p className="eyebrow shrink-0">{eyebrow}</p>
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
            )}
            {title && (
              <h2 className="mt-5 text-display-sm text-foreground">{title}</h2>
            )}
            {intro && <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
