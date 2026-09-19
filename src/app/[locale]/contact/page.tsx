import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Chevron } from "@/components/ui/ArrowLink";
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

  const channels = [
    { label: c.email, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, external: false },
    {
      label: c.whatsapp,
      value: c.whatsappNote,
      href: WHATSAPP_COMMUNITY_URL,
      external: true,
    },
    { label: c.linkedin, value: "Donfack Fortune", href: LINKEDIN_URL, external: true },
  ];

  return (
    <>
      {/* 1 · HERO */}
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <Badge variant="amber">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {t.slaBadge}
          </Badge>
        }
        className="pb-12 sm:pb-16"
      />

      {/* 2 · FORM + DIRECT CHANNELS */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Reveal className="order-2 lg:order-1">
              <div className="rounded-3xl bg-surface p-6 sm:p-10">
                <ContactForm t={t} />
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2" delay={80}>
              <div className="lg:sticky lg:top-24">
                <h2 className="text-headline text-foreground">{c.title}</h2>
                <p className="mt-2 text-muted">{c.intro}</p>

                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {channels.map((ch) => (
                    <li key={ch.label}>
                      <a
                        href={ch.href}
                        {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center justify-between gap-4 py-5"
                      >
                        <span>
                          <span className="block text-sm text-muted">{ch.label}</span>
                          <span className="mt-0.5 block font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                            {ch.value}
                          </span>
                        </span>
                        <span className="text-accent">
                          <Chevron external={ch.external} />
                        </span>
                      </a>
                    </li>
                  ))}
                  <li className="py-5">
                    <span className="block text-sm text-muted">{c.location}</span>
                    <span className="mt-0.5 block font-medium text-foreground">{SITE_LOCATION}</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
