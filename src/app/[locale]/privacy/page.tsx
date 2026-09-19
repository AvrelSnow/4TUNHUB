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
    title: dict.privacy.title,
    description: dict.privacy.intro,
    alternates: { canonical: `/${locale}/privacy` },
  };
}

/** The privacy note: short, plain, and true of what the forms actually do. */
export default async function PrivacyPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.privacy;

  return (
    <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <Container size="narrow">
        <p className="text-sm text-muted">{t.updated}</p>
        <h1 className="mt-3 text-display text-foreground">{t.title}</h1>
        <p className="mt-6 text-lead text-muted">{t.intro}</p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {t.sections.map((s) => (
            <div key={s.title} className="grid gap-3 py-8 sm:grid-cols-[12rem_1fr] sm:gap-10">
              <h2 className="font-semibold text-foreground">{s.title}</h2>
              <p className="text-muted">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-foreground">
          {t.contact}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline hover:underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
