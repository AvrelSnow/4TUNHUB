import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ConsentControl } from "@/components/ConsentControl";
import { CONSENT_ANCHOR } from "@/lib/consent";
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

/**
 * The privacy note: short, plain, and true of what the forms and the
 * browser actually do.
 *
 * The storage table and the control below it are deliberately on this
 * page rather than behind a floating "cookie settings" widget. There is
 * one place where everything we keep is listed and everything we ask can
 * be withdrawn, it is linked from the footer of every page, and it is
 * readable by someone who has never heard of a consent manager.
 */
export default async function PrivacyPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.privacy;
  const s = t.storage;

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

        {/* ---- Cookies and storage: the inventory, then the switch ---- */}
        <div id={CONSENT_ANCHOR} className="mt-16 scroll-mt-24">
          <h2 className="text-display-sm text-foreground">{s.title}</h2>
          <p className="mt-4 text-muted text-pretty">{s.intro}</p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-left text-sm">
              <caption className="sr-only">{s.title}</caption>
              <thead>
                <tr className="border-b border-border">
                  {[s.columns.what, s.columns.why, s.columns.kept, s.columns.refuse].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="py-3 pr-6 align-bottom font-semibold text-foreground last:pr-0"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((row) => (
                  <tr key={row.what} className="border-b border-border align-top">
                    <th scope="row" className="py-4 pr-6 font-medium text-foreground">
                      {row.what}
                      <span className="mt-1 block font-mono text-2xs font-normal text-muted">
                        {row.key}
                      </span>
                    </th>
                    <td className="py-4 pr-6 text-muted">{row.why}</td>
                    <td className="py-4 pr-6 text-muted">{row.kept}</td>
                    <td className="py-4 text-muted">{row.refuse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ConsentControl strings={s.control} />
        </div>

        <p className="mt-12 text-foreground">
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
