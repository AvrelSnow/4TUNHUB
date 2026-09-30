import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAIL } from "@/lib/site";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.terms.title,
    description: dict.terms.intro,
    alternates: { canonical: `/${locale}/terms` },
  };
}

/**
 * Terms of use — the same shape as the privacy note, deliberately.
 *
 * It exists because of what the site now promises rather than because a
 * checklist asked for it: a free seat with conditions attached, sessions
 * that are recorded and republished, a $99 exam voucher owed to twenty
 * people in November, teaching material that took years to write, and a
 * bootcamp named after somebody else's certification. Each of those is a
 * sentence here, in the plainest words that are still true.
 */
export default async function TermsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.terms;

  return (
    <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <Container size="narrow">
        <p className="text-sm text-muted">{t.updated}</p>
        <h1 className="mt-3 text-display text-foreground">{t.title}</h1>
        <p className="mt-6 text-lead text-muted">{t.intro}</p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {t.sections.map((section) => (
            <div
              key={section.title}
              className="grid gap-3 py-8 sm:grid-cols-[12rem_1fr] sm:gap-10"
            >
              <h2 className="font-semibold text-foreground">{section.title}</h2>
              <p className="text-muted">{section.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-foreground">
          {t.contact}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:underline hover:underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
