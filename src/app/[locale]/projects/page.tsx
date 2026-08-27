import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/lib/projects";
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
    <Section pattern="dots" className="py-20">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {t.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.intro}</p>

      <div className="mt-12">
        <ProjectGrid
          projects={projects}
          items={t.items}
          categories={t.categories}
          labels={{ all: t.filterAll, filterLabel: t.filterLabel }}
          basePath={localizeHref(locale, "/about/founder/projects")}
        />
      </div>
    </Section>
  );
}
