import { Container } from "./Container";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

/**
 * The closing block every pillar page ends on: one question, one sentence,
 * two ways forward. Centred on the grey band, so the page comes to rest
 * before the footer.
 *
 * `external` is per action: WhatsApp or Medium open in a new tab with the
 * safe rel; internal routes must already be localized by the caller.
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
  className,
}: {
  title: string;
  subtitle: string;
  primary: CtaAction;
  secondary?: CtaAction;
  className?: string;
}) {
  const action = (a: CtaAction, variant: "primary" | "raised") => (
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
    <section className={cn("bg-surface py-24 sm:py-32", className)}>
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-sm text-foreground">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lead text-muted">{subtitle}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {action(primary, "primary")}
            {secondary && action(secondary, "raised")}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
