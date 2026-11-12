import { Container } from "./Container";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { testimonials } from "@/lib/testimonials";
import { cn } from "@/lib/cn";

/**
 * The closing band every pillar page ends on (layout after Bonsai): the
 * question on the left, and on the right an action card lit by the
 * workshop atmosphere, with one real person's words under it.
 *
 * White, like the footer below it, with its cards in Ghost White, so a
 * page ends in one continuous white band.
 *
 * The quote is real and named (src/lib/testimonials.ts), printed in the
 * words its author wrote. A page picks one by its title, so different
 * pages show different people; the home page, which already prints all
 * of them, passes `quote={false}`.
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
  quote = true,
  className,
}: {
  title: string;
  subtitle: string;
  primary: CtaAction;
  secondary?: CtaAction;
  quote?: boolean;
  className?: string;
}) {
  const action = (a: CtaAction, variant: "primary" | "raised") => (
    <Button
      as="a"
      href={a.href}
      size="lg"
      variant={variant}
      className="text-center max-sm:h-auto max-sm:min-h-12 max-sm:whitespace-normal max-sm:py-3"
      {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(variant === "primary" ? { "data-magnetic": "" } : {})}
    >
      {a.label}
    </Button>
  );

  const pick =
    quote && testimonials.length > 0
      ? testimonials[[...title].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % testimonials.length]
      : null;

  return (
    <section className={cn("bg-background py-24 sm:py-32", className)}>
      <Container>
        <Reveal className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-display-sm text-foreground">{title}</h2>
            <p className="mt-5 max-w-xl text-lead text-muted">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* The action card: the atmosphere at full strength, so the
                brightest thing in the band is the way forward. */}
            <div className="relative isolate flex min-h-52 flex-wrap items-center justify-center gap-3 overflow-hidden rounded-3xl bg-surface p-6 sm:p-8">
              <div aria-hidden="true" className="atmosphere atmosphere-strong" />
              <div className="relative flex flex-wrap justify-center gap-3">
                {action(primary, "primary")}
                {secondary && action(secondary, "raised")}
              </div>
            </div>

            {pick && (
              <figure className="rounded-3xl bg-surface p-7 sm:p-8">
                <blockquote className="text-lg leading-relaxed text-foreground/85">“{pick.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {pick.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pick.photo} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{pick.name}</span>
                    <span className="block truncate text-2xs text-muted">{pick.role}</span>
                  </span>
                </figcaption>
              </figure>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
