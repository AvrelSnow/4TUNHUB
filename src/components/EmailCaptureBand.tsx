import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import type { TrackValue } from "@/lib/waitlist";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The email block a page ends on before its closing CTA: a card on the
 * default background, so it doesn't stack two grey bands on top of each
 * other. The heading says what the address is for — see EmailCapture for
 * why that matters.
 */
export function EmailCaptureBand({
  t,
  band,
  track,
  privacyHref,
  moreHref,
  className,
}: {
  t: Dictionary["waitlist"];
  /** Which heading to use: `academy`, `cohort` or `rem`. */
  band: keyof Dictionary["waitlist"]["inline"]["bands"];
  track: TrackValue;
  privacyHref: string;
  moreHref?: string;
  className?: string;
}) {
  const copy = t.inline.bands[band];

  return (
    <section className={cn("py-20 sm:py-24", className)}>
      <Container>
        <Reveal>
          <div className="grid gap-8 rounded-3xl bg-surface p-8 sm:p-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="text-display-sm text-foreground">{copy.title}</h2>
              <p className="mt-4 text-muted">{copy.body}</p>
            </div>
            <EmailCapture
              t={t}
              track={track}
              privacyHref={privacyHref}
              moreHref={moreHref}
              className="lg:justify-self-end"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
