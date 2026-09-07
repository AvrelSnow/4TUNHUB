import { Section, type Rhythm } from "./Section";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

/**
 * ============================================================
 * CTA PANEL — the closing block, as one primitive.
 * ============================================================
 * This panel is the most-repeated block on the site: every pillar
 * page ends with it, and every one of them had its own hand-written
 * copy of the same markup. Two treatments had drifted apart — a
 * centred plain box, and the ticked panel with the flow-ramp rule
 * across its top edge that home, the blog and careers already use.
 *
 * The ticked one wins, because it is the signature move (art-direction
 * §"the instrument frame") and the plain one is a generic marketing
 * card that could sit on any site. Left-aligned, because the rest of
 * every page is, and a centred block at the bottom is the one place
 * the measure breaks for no reason.
 *
 * `external` is per-action: a WhatsApp or Medium destination opens in a
 * new tab with the safe rel, an internal route must already be
 * localized by the caller (`localizeHref`).
 */
export type CtaAction = {
  label: string;
  href: string;
  external?: boolean;
};

export function CtaPanel({
  title,
  subtitle,
  primary,
  secondary,
  rhythm = "normal",
  className,
}: {
  title: string;
  subtitle: string;
  primary: CtaAction;
  secondary?: CtaAction;
  rhythm?: Rhythm;
  className?: string;
}) {
  const action = (a: CtaAction, variant: "primary" | "secondary") => (
    <Button
      as="a"
      href={a.href}
      size="lg"
      variant={variant}
      {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {a.label}
    </Button>
  );

  return (
    <Section rhythm={rhythm} className={cn("pb-24", className)}>
      <Reveal>
        <div className="ticks relative rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <span aria-hidden="true" className="flow-rule absolute inset-x-0 top-0 h-px" />
          <h2 className="max-w-2xl text-display-sm text-foreground">{title}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">{subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {action(primary, "primary")}
            {secondary && action(secondary, "secondary")}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
