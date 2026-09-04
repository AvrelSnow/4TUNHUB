import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Field, type FieldVariant } from "../Field";

export type { FieldVariant };

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
 * `field` runs a live simulation behind the section — each page gets the
 * phenomenon it is actually about (see fields/renderers.ts). When one is
 * present the header automatically takes `.copy-scrim`, so text contrast
 * over the field is guaranteed by the primitive rather than remembered by
 * whoever writes the next page.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  field,
  rhythm = "normal",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  field?: FieldVariant;
  rhythm?: Rhythm;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  const hasHeader = Boolean(eyebrow || title || intro);
  return (
    <section
      id={id}
      className={cn(rhythms[rhythm], field && "relative overflow-hidden", className)}
    >
      {field && <Field variant={field} />}
      <Container className={cn(field && "relative", containerClassName)}>
        {hasHeader && (
          <div className={cn("max-w-2xl", field && "copy-scrim")}>
            {eyebrow && (
              <div className="flex items-center gap-3">
                <p className="eyebrow shrink-0">{eyebrow}</p>
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
            )}
            {title && <h2 className="mt-5 text-display-sm text-foreground">{title}</h2>}
            {intro && <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
