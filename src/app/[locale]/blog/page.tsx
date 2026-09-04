import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
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
      {/* 1 · HERO — `wave`: interference of emitters. Writing is ideas
          propagating outward and meeting each other. */}
      <Section field="wave" className="pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-display text-foreground">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={publications[0].href} size="lg" target="_blank" rel="noopener noreferrer">
              {t.primaryCta}
            </Button>
            <Button
              as="a"
              href={localizeHref(locale, "/contact")}
              size="lg"
              variant="secondary"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* 2 · INDEX, or the honest empty state. Same contract as the store:
          nothing is listed until something real exists. */}
      {items.length > 0 ? (
        <Section eyebrow={t.indexEyebrow} title={t.indexTitle} className="pt-0">
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {items.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <a
                  href={p.canonical ?? localizeHref(locale, `/blog/${p.slug}`)}
                  target={p.canonical ? "_blank" : undefined}
                  rel={p.canonical ? "noopener noreferrer" : undefined}
                  className="block h-full"
                >
                  <Card interactive className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={p.source === "native" ? "amber" : "outline"}>
                        {t.sources[p.source]}
                      </Badge>
                      <span className="readout">{formatDate(p.date, locale)}</span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                      {dict.blogPosts?.[p.slug]?.title ?? p.slug}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                      {dict.blogPosts?.[p.slug]?.excerpt ?? ""}
                    </p>
                    <span className="readout mt-4">
                      {p.readingMinutes} {t.minRead}
                    </span>
                  </Card>
                </a>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <Container className="pt-0">
          <Reveal>
            <div className="rounded-2xl border border-dashed border-hairline bg-surface p-8 sm:p-12">
              <Badge variant="outline" className="w-fit">
                {t.emptyEyebrow}
              </Badge>
              <h2 className="mt-4 max-w-2xl text-display-sm text-foreground">
                {t.emptyTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{t.emptyBody}</p>
            </div>
          </Reveal>
        </Container>
      )}

      {/* 3 · THE REAL PUBLICATIONS — active surfaces, not announcements. */}
      <Section eyebrow={t.hubEyebrow} title={t.hubTitle} intro={t.hubIntro}>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {publications.map((pub, i) => {
            const copy = t.publications[pub.key];
            if (!copy) return null;
            return (
              <Reveal key={pub.key} delay={i * 80}>
                <a
                  href={pub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card interactive className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
                      {pub.readers && (
                        <span className="readout text-accent">
                          {pub.readers} {t.readers}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted">{copy.desc}</p>
                    <span className="link-sweep mt-4 w-fit text-sm font-medium text-accent">
                      {copy.cta} →
                    </span>
                  </Card>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 4 · CONVERSION */}
      <Section rhythm="compressed" className="pb-24">
        <Reveal>
          <div className="ticks relative rounded-2xl border border-border bg-surface p-8 sm:p-10">
            <span aria-hidden="true" className="flow-rule absolute inset-x-0 top-0 h-px" />
            <h2 className="max-w-2xl text-display-sm text-foreground">{t.cta.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">{t.cta.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
                {t.cta.primary}
              </Button>
              <Button
                as="a"
                href={localizeHref(locale, "/projects")}
                size="lg"
                variant="secondary"
              >
                {t.cta.secondary}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
