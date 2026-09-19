"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Media } from "./ui/Media";
import type { Project, ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/cn";

type Item = { title: string; outcome: string };

/**
 * Filterable project grid. The filter is a row of real <button>s with
 * aria-pressed, so it works with keyboard, touch and screen readers alike.
 * Filtering is client-side over an already-rendered list: no navigation.
 */
export function ProjectGrid({
  projects,
  items,
  categories,
  labels,
  basePath,
}: {
  projects: Project[];
  items: Record<string, Item>;
  categories: Record<string, string>;
  labels: { all: string; filterLabel: string; illustrative: string };
  /** e.g. "/en/about/founder/projects" */
  basePath: string;
}) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const used = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects],
  );
  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [projects, active],
  );

  const options: { key: ProjectCategory | "all"; label: string }[] = [
    { key: "all", label: labels.all },
    ...used.map((c) => ({ key: c, label: categories[c] ?? c })),
  ];

  return (
    <div>
      <div className="flex justify-center">
        <div
          role="group"
          aria-label={labels.filterLabel}
          className="rail inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface p-1"
        >
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={active === o.key}
              onClick={() => setActive(o.key)}
              className={cn(
                "h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-200",
                active === o.key
                  ? "bg-surface-2 text-foreground shadow-e2"
                  : "text-muted hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const copy = items[p.slug];
          if (!copy) return null;
          return (
            <Link key={p.slug} href={`${basePath}/${p.slug}`} className="group block">
              {p.image ? (
                <Media src={p.image} alt={copy.title} zoom className="aspect-[4/3] rounded-3xl" />
              ) : (
                <div className="aspect-[4/3] rounded-3xl bg-surface" aria-hidden="true" />
              )}
              <p className="mt-5 text-2xs font-medium text-muted">
                {categories[p.category] ?? p.category} · <span className="figure">{p.year}</span>
              </p>
              <h2 className="mt-1.5 text-headline text-foreground group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {copy.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.outcome}</p>
              {p.imageIllustrative && (
                <p className="mt-2 text-2xs text-muted">{labels.illustrative}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
