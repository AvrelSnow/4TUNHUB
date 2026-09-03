import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProjectVisual } from "@/components/ProjectVisual";
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

  const index = projects.findIndex((p) => p.slug === slug);

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

  const blocks = [
    { label: t.detail.problem, body: copy.problem },
    { label: t.detail.approach, body: copy.approach },
    { label: t.detail.results, body: copy.results },
  ];

  const gallery = t.galleries[slug] ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section pattern="diamond" className="pb-12 pt-16">
        <Link
          href={localizeHref(locale, "/about/founder")}
          className="link-sweep text-sm font-medium text-accent"
        >
          ← {dict.founderPage.sections.portfolio}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Badge variant="amber">{t.categories[project.category]}</Badge>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{copy.outcome}</p>
          </div>

          <div>
            {project.image ? (
              <>
                <Zoomable
                  src={project.image}
                  alt={copy.title}
                  label={t.detail.zoom}
                  closeLabel={t.detail.close}
                  className="aspect-[4/3] w-full rounded-xl border border-border"
                />
                {project.imageIllustrative && (
                  <p className="mt-2 text-3xs text-muted">{t.detail.illustrativeNote}</p>
                )}
              </>
            ) : (
              <>
                <ProjectVisual
                  category={project.category}
                  index={index}
                  className="aspect-[4/3] w-full"
                />
                <p className="mt-2 text-3xs text-muted">{t.detail.visualNote}</p>
              </>
            )}

            <dl className="mt-6 divide-y divide-border border-t border-border">
              <div className="flex justify-between gap-4 py-3">
                <dt className="font-mono text-3xs uppercase tracking-wider text-muted">
                  {t.detail.year}
                </dt>
                <dd className="text-sm text-foreground">{project.year}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="font-mono text-3xs uppercase tracking-wider text-muted">
                  {t.detail.category}
                </dt>
                <dd className="text-sm text-foreground">{t.categories[project.category]}</dd>
              </div>
              <div className="py-3">
                <dt className="font-mono text-3xs uppercase tracking-wider text-muted">
                  {t.detail.tools}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted"
                    >
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* Problem → Approach → Result */}
      <section className="border-t border-border bg-surface/50">
        <Container className="py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            {blocks.map((b, i) => (
              <div key={b.label}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">{b.label}</h2>
                </div>
                <p className="mt-3 text-base leading-7 text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery — every real image for the project, each zoomable */}
      {project.gallery && project.gallery.length > 0 && (
        <Container className="py-16">
          <p className="eyebrow">{t.galleryTitle}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((src, i) => (
              <figure
                key={src}
                className="overflow-hidden rounded-xl border border-border"
              >
                <Zoomable
                  src={src}
                  alt={gallery[i] ?? copy.title}
                  label={t.detail.zoom}
                  closeLabel={t.detail.close}
                  fit="contain"
                  className="aspect-[4/3] w-full"
                />
                {gallery[i] && (
                  <figcaption className="border-t border-border bg-background px-4 py-3 text-sm text-muted">
                    {gallery[i]}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Container>
      )}

      <Container className="py-16">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t.detail.ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">{t.detail.ctaBody}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button as="a" href={localizeHref(locale, "/contact")} size="lg">
              {t.detail.cta}
            </Button>
            {project.portfolioUrl && (
              <Button
                as="a"
                href={project.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant="secondary"
              >
                {t.detail.portfolio} →
              </Button>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
