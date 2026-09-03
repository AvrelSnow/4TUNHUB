"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ProjectVisual } from "./ProjectVisual";
import type { Project, ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/cn";

type Item = { title: string; outcome: string };

/**
 * Filterable project grid. Filters are real <button>s with aria-pressed, so
 * the control works with keyboard, touch and screen readers alike. Filtering
 * is client-side over an already-rendered list — no navigation, no refetch.
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
  labels: { all: string; filterLabel: string };
  /** e.g. "/en/projects" */
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

  const chip =
    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div>
      <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={active === "all"}
          onClick={() => setActive("all")}
          className={cn(
            chip,
            active === "all"
              ? "border-brand-500 bg-brand-500 text-ink-900"
              : "border-border text-muted hover:border-brand-500 hover:text-foreground",
          )}
        >
          {labels.all}
        </button>
        {used.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={cn(
              chip,
              active === c
                ? "border-brand-500 bg-brand-500 text-ink-900"
                : "border-border text-muted hover:border-brand-500 hover:text-foreground",
            )}
          >
            {categories[c] ?? c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const copy = items[p.slug];
          if (!copy) return null;
          return (
            <Link key={p.slug} href={`${basePath}/${p.slug}`} className="block h-full">
              <Card interactive className="flex h-full flex-col bg-background">
                <ProjectVisual
                  category={p.category}
                  index={projects.indexOf(p)}
                  image={p.image}
                  alt={copy.title}
                  className="h-36 w-full"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Badge variant="amber">{categories[p.category] ?? p.category}</Badge>
                  <span className="font-mono text-3xs text-muted">{p.year}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-foreground">{copy.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{copy.outcome}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
