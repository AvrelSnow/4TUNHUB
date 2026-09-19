import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects, PROJECT_DETAIL_BASE } from "@/lib/projects";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.projects.title.replace(/\.$/, ""),
    description: dict.projects.intro,
    alternates: { canonical: `/${locale}/projects` },
  };
}

export default async function ProjectsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.projects;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro} className="pb-10 sm:pb-14" />

      <section className="pb-24 sm:pb-32">
        <Container>
          <ProjectGrid
            projects={projects}
            items={t.items}
            categories={t.categories}
            labels={{
              all: t.filterAll,
              filterLabel: t.filterLabel,
              illustrative: t.detail.illustrativeNote,
            }}
            basePath={localizeHref(locale, PROJECT_DETAIL_BASE)}
          />
        </Container>
      </section>

      <CtaPanel
        title={t.detail.ctaTitle}
        subtitle={t.detail.ctaBody}
        primary={{ label: t.detail.cta, href: localizeHref(locale, "/contact") }}
        secondary={{ label: dict.routes.services, href: localizeHref(locale, "/services") }}
      />
    </>
  );
}
