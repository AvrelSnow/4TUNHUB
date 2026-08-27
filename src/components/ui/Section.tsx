import { cn } from "@/lib/cn";
import { Container } from "./Container";

export type PatternVariant = "grid" | "dots" | "diamond" | "rings" | "hatch";

/**
 * Section shell — the repeatable vertical unit of the whole site.
 * eyebrow = small mono label, title = section heading, intro = lead text.
 *
 * `pattern` adds a decorative geometry layer behind the content. The layer
 * is masked so it dissolves across the middle — content always stays
 * readable — and each page uses a different geometry for its own identity.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  pattern,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  pattern?: PatternVariant;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28", pattern && "relative overflow-hidden", className)}
    >
      {pattern && <div aria-hidden="true" className={cn("pattern", `pattern-${pattern}`)} />}
      <Container className={cn(pattern && "relative", containerClassName)}>
        {(eyebrow || title || intro) && (
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-4 text-lg leading-8 text-muted">{intro}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
