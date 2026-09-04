import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  CONTACT_EMAIL,
  LINKEDIN_URL,
  SITE_LOCATION,
  WHATSAPP_COMMUNITY_URL,
} from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.contact,
    description: dict.contact.subtitle,
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.contact;
  const c = t.channels;

  return (
    <>
      {/* 1 · HERO */}
      <Section field="network" className="pb-10 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-display text-foreground">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-6">
            <Badge variant="amber">{t.slaBadge}</Badge>
          </div>
        </Reveal>
      </Section>

      {/* 2 · FORM + DIRECT CHANNELS */}
      <Container className="pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Form */}
          <Reveal className="order-2 lg:order-1">
            <ContactForm t={t} />
          </Reveal>

          {/* Direct channels */}
          <Reveal className="order-1 lg:order-2" delay={80}>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{c.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {c.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">{c.intro}</p>

              <ul className="mt-8 flex flex-col gap-6">
                <li>
                  <p className="eyebrow text-muted">{c.email}</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="link-sweep mt-1 inline-block text-base font-medium text-foreground"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>

                <li>
                  <p className="eyebrow text-muted">{c.whatsapp}</p>
                  <a
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep mt-1 inline-block text-base font-medium text-foreground"
                  >
                    {c.whatsapp} →
                  </a>
                  <p className="mt-1 text-xs text-muted">{c.whatsappNote}</p>
                </li>

                <li>
                  <p className="eyebrow text-muted">{c.linkedin}</p>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep mt-1 inline-block text-base font-medium text-foreground"
                  >
                    {c.linkedin} →
                  </a>
                </li>

                <li>
                  <p className="eyebrow text-muted">{c.location}</p>
                  <p className="mt-1 text-base font-medium text-foreground">{SITE_LOCATION}</p>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
