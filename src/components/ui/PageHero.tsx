import { cn } from "@/lib/cn";
import type { Hue } from "@/lib/hues";
import { Container } from "./Container";

/**
 * The top of every page: the page's name, one large claim, one paragraph,
 * and at most two actions. Centred, because it is the one place on a page
 * that speaks to everyone at once.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  align = "center",
  hue,
  className,
  children,
}: {
  /** A pillar page's hue (src/lib/hues.ts): lights the hero in it. */
  hue?: Hue;
  eyebrow?: string;
  title: string;
  intro?: string;
  actions?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  /** Media or extra content under the text block. */
  children?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <section
      className={cn(
        "pt-16 pb-16 sm:pt-24 sm:pb-24",
        hue && `hue-${hue} relative isolate overflow-hidden`,
        className,
      )}
    >
      {/* A pillar's hero is lit in that pillar's hue alone, and the light
          fades into the page below (globals.css, `.atmosphere-pillar`). */}
      {hue && <div aria-hidden="true" className="atmosphere atmosphere-pillar atmosphere-fade" />}
      <Container className={cn(hue && "relative")}>
        <div className={cn(centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl")}>
          {eyebrow &&
            (hue ? (
              <p className="eyebrow text-hue inline-flex animate-fade-in items-center gap-2">
                <span aria-hidden="true" className="bg-hue-ink h-2 w-2 rounded-full" />
                {eyebrow}
              </p>
            ) : (
              <p className="eyebrow animate-fade-in">{eyebrow}</p>
            ))}
          <h1 className="mt-3 animate-fade-up text-display text-foreground">{title}</h1>
          {intro && (
            <p
              className={cn(
                "mt-5 animate-fade-up text-lead text-muted [animation-delay:80ms]",
                centered ? "mx-auto max-w-2xl" : "max-w-2xl",
              )}
            >
              {intro}
            </p>
          )}
          {actions && (
            <div
              className={cn(
                "mt-8 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:160ms]",
                centered && "justify-center",
              )}
            >
              {actions}
            </div>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
