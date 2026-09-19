import { cn } from "@/lib/cn";
import { Container } from "./Container";

/**
 * Vertical spacing. Generous by default: the space between sections is
 * what lets each one be read on its own.
 */
export type Rhythm = "compressed" | "normal" | "cinematic";

const rhythms: Record<Rhythm, string> = {
  compressed: "py-14 sm:py-20",
  normal: "py-20 sm:py-28 lg:py-32",
  cinematic: "py-24 sm:py-36 lg:py-44",
};

/** `surface` is the soft grey band that separates one idea from the next. */
export type Tone = "default" | "surface";

const tones: Record<Tone, string> = {
  default: "bg-background",
  surface: "bg-surface",
};

/**
 * Section shell — the repeatable vertical unit of the whole site.
 * eyebrow = the section's name, title = its claim, intro = one paragraph.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "default",
  rhythm = "normal",
  className,
  containerClassName,
  headerClassName,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  align?: "left" | "center";
  tone?: Tone;
  rhythm?: Rhythm;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  children?: React.ReactNode;
}) {
  const hasHeader = Boolean(eyebrow || title || intro);
  const centered = align === "center";
  return (
    <section id={id} className={cn(rhythms[rhythm], tones[tone], className)}>
      <Container className={containerClassName}>
        {hasHeader && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            intro={intro}
            centered={centered}
            className={headerClassName}
          />
        )}
        {children}
      </Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  centered = false,
  className,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && (
        <h2 className={cn("text-display-sm text-foreground", eyebrow && "mt-3")}>{title}</h2>
      )}
      {intro && (
        <p
          className={cn(
            "mt-5 text-lead text-muted",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
