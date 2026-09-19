import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLink, Chevron } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { publishedPosts, publications } from "@/lib/blog";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/i18n/format";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.routes.blog,
    description: dict.blog.subtitle,
    alternates: { canonical: `/${locale}/blog` },
  };
}

export default async function BlogPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.blog;
  const items = publishedPosts();

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        actions={
          <>
            <Button as="a" href={publications[0].href} size="lg" target="_blank" rel="noopener noreferrer">
              {t.primaryCta}
            </Button>
            <ArrowLink href={localizeHref(locale, "/contact")}>{t.secondaryCta}</ArrowLink>
          </>
        }
      />

      {/* The index, or the honest empty state: nothing is listed until it exists. */}
      {items.length > 0 ? (
        <Section tone="surface" eyebrow={t.indexEyebrow} title={t.indexTitle}>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {items.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <a
                  href={p.canonical ?? localizeHref(locale, `/blog/${p.slug}`)}
                  target={p.canonical ? "_blank" : undefined}
                  rel={p.canonical ? "noopener noreferrer" : undefined}
                  className="group block h-full"
                >
                  <Card tone="raised" interactive className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={p.source === "native" ? "amber" : "outline"}>
                        {t.sources[p.source]}
                      </Badge>
                      <span className="readout">{formatDate(p.date, locale)}</span>
                    </div>
                    <h2 className="mt-6 text-headline text-foreground">
                      {dict.blogPosts?.[p.slug]?.title ?? p.slug}
                    </h2>
                    <p className="mt-3 flex-1 text-muted">{dict.blogPosts?.[p.slug]?.excerpt ?? ""}</p>
                    <span className="readout mt-5">
                      {p.readingMinutes} {t.minRead}
                    </span>
                  </Card>
                </a>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <section className="pb-8">
          <Container>
            <Reveal>
              <EmptyState eyebrow={t.emptyEyebrow} title={t.emptyTitle} body={t.emptyBody} />
            </Reveal>
          </Container>
        </section>
      )}

      <Section eyebrow={t.hubEyebrow} title={t.hubTitle} intro={t.hubIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {publications.map((pub, i) => {
            const copy = t.publications[pub.key];
            if (!copy) return null;
            return (
              <Reveal key={pub.key} delay={i * 80}>
                <a href={pub.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
                  <Card interactive className="flex h-full flex-col">
                    <h3 className="text-headline text-foreground">{copy.title}</h3>
                    {pub.readers && (
                      <p className="figure mt-2 text-sm font-medium text-muted">
                        {pub.readers} {t.readers}
                      </p>
                    )}
                    <p className="mt-4 flex-1 text-muted">{copy.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-1 font-medium text-accent">
                      {copy.cta}
                      <Chevron external />
                    </span>
                  </Card>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaPanel
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primary={{ label: t.cta.primary, href: localizeHref(locale, "/contact") }}
        secondary={{ label: t.cta.secondary, href: localizeHref(locale, "/projects") }}
      />
    </>
  );
}
