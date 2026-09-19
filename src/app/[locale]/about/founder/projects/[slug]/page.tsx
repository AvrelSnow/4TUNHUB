import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Chevron } from "@/components/ui/ArrowLink";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Zoomable } from "@/components/Zoomable";
import { projects, getProject, projectDetailPath } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** One static page per project (× each locale). */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(slug);
  if (!project) return {};
  const dict = await getDictionary(locale);
  const copy = dict.projects.items[slug];
  if (!copy) return {};
  return {
    title: copy.title,
    description: copy.outcome,
    alternates: { canonical: `/${locale}${projectDetailPath(slug)}` },
    openGraph: { title: copy.title, description: copy.outcome, type: "article" },
  };
}

export default async function ProjectDetail({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const dict = await getDictionary(locale);
  const t = dict.projects;
  const copy = t.items[slug];
  if (!copy) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: copy.title,
    abstract: copy.outcome,
    dateCreated: project.year,
    genre: t.categories[project.category],
    url: `${SITE_URL}/${locale}${projectDetailPath(slug)}`,
    creator: { "@type": "Person", name: "Donfack Fortune" },
    keywords: project.tools.join(", "),
  };

  const chapters = [
    { label: t.detail.problem, body: copy.problem },
    { label: t.detail.approach, body: copy.approach },
    { label: t.detail.results, body: copy.results },
  ];

  const captions = t.galleries[slug] ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
      <section className="pt-10 sm:pt-14">
        <Container>
          <Link
            href={localizeHref(locale, "/about/founder")}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="rotate-180">
              <Chevron />
            </span>
            {dict.founderPage.sections.portfolio}
          </Link>

          <div className="mx-auto mt-12 max-w-4xl text-center">
            <p className="eyebrow">
              {t.categories[project.category]} · <span className="figure">{project.year}</span>
            </p>
            <h1 className="mt-3 animate-fade-up text-display text-foreground">{copy.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lead text-muted [animation-delay:80ms]">
              {copy.outcome}
            </p>
          </div>

          {project.image && (
            <figure className="mt-14 animate-fade-up [animation-delay:160ms] sm:mt-16">
              <Zoomable
                src={project.image}
                alt={copy.title}
                label={t.detail.zoom}
                closeLabel={t.detail.close}
                className="aspect-[4/3] rounded-3xl sm:aspect-[16/9]"
              />
              {project.imageIllustrative && (
                <figcaption className="readout mt-3 text-center">{t.detail.illustrativeNote}</figcaption>
              )}
            </figure>
          )}

          {/* Facts */}
          <dl className="mt-12 grid gap-8 border-y border-border py-8 sm:grid-cols-[auto_auto_1fr] sm:gap-16">
            <div>
              <dt className="text-sm text-muted">{t.detail.year}</dt>
              <dd className="figure mt-1 font-medium text-foreground">{project.year}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t.detail.category}</dt>
              <dd className="mt-1 font-medium text-foreground">{t.categories[project.category]}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t.detail.tools}</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-surface px-3 py-1 text-sm text-foreground">
                    {tool}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* THE STORY — problem, approach, result, read top to bottom. */}
      <section className="py-24 sm:py-32">
        <Container size="narrow" className="space-y-16 sm:space-y-20">
          {chapters.map((c) => (
            <Reveal key={c.label}>
              <h2 className="text-display-sm text-foreground">{c.label}</h2>
              <p className="mt-6 text-lead text-muted">{c.body}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* DOCUMENTATION — every real image, each zoomable. */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="bg-surface py-24 sm:py-32">
          <Container>
            <h2 className="text-display-sm text-foreground">{t.galleryTitle}</h2>
            <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                <Reveal key={src} delay={(i % 3) * 60}>
                  <figure>
                    <Zoomable
                      src={src}
                      alt={captions[i] ?? copy.title}
                      label={t.detail.zoom}
                      closeLabel={t.detail.close}
                      fit="contain"
                      className="aspect-[4/3] rounded-2xl"
                    />
                    {captions[i] && (
                      <figcaption className="mt-3 text-sm leading-6 text-muted">{captions[i]}</figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaPanel
        title={t.detail.ctaTitle}
        subtitle={t.detail.ctaBody}
        primary={{ label: t.detail.cta, href: localizeHref(locale, "/contact") }}
        secondary={
          project.portfolioUrl
            ? { label: t.detail.portfolio, href: project.portfolioUrl, external: true }
            : undefined
        }
        className={project.gallery && project.gallery.length > 0 ? "border-t border-border" : undefined}
      />
    </>
  );
}
