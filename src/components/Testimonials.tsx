import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { testimonials } from "@/lib/testimonials";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * What other people say. Renders nothing at all until there is something
 * real to print — see src/lib/testimonials.ts for why that matters and
 * where the quotes come from.
 *
 * Deliberately plain: a quote in large type, a name, a role. No stars, no
 * carousel, no five-column wall of praise. One person saying one specific
 * thing is more persuasive than twelve saying "great course".
 */
export function Testimonials({ t }: { t: Dictionary["home"]["testimonials"] }) {
  if (testimonials.length === 0) return null;

  // One quote gets the full width and a bigger size; several sit in a row.
  const solo = testimonials.length === 1;

  return (
    <section className="bg-surface py-24 sm:py-32">
      <Container>
        <SectionHeader eyebrow={t.eyebrow} title={t.title} centered />

        <div
          className={
            solo
              ? "mx-auto mt-14 max-w-3xl"
              : "mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 70} className="h-full">
              <figure
                className={
                  solo
                    ? "flex h-full flex-col items-center text-center"
                    : "flex h-full flex-col rounded-3xl bg-surface-2 p-8"
                }
              >
                <blockquote
                  className={
                    solo
                      ? "text-display-sm text-foreground"
                      : "flex-1 text-lg leading-8 text-foreground"
                  }
                >
                  {/* Curly quotes belong to the typeface, not to an image. */}
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption
                  className={
                    solo
                      ? "mt-8 flex items-center justify-center gap-4"
                      : "mt-7 flex items-center gap-4 border-t border-border pt-6"
                  }
                >
                  {item.photo && (
                    <Media
                      src={item.photo}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-full"
                    />
                  )}
                  <div className={solo ? "text-left" : undefined}>
                    <p className="font-semibold text-foreground">
                      {item.href ? (
                        <Link
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:underline-offset-4"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
