import { cn } from "@/lib/cn";
import type { ProjectCategory } from "@/lib/projects";

/**
 * Branded generative visual for a project card/header.
 * Real project photography doesn't exist yet, and stock imagery must never
 * stand in for real engineering work (craft contract §1) — so each project
 * gets an honest graphic: blueprint grid, its index, and a line glyph for
 * its discipline. Swap in a photo via Project.image the moment one exists.
 */

function Glyph({ category }: { category: ProjectCategory }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (category) {
    case "simulation": // triangular FE mesh
      return (
        <g {...common}>
          <path d="M8 40 L26 10 L44 40 Z" />
          <path d="M8 40 L44 40 M26 10 L26 40 M17 25 L35 25" />
        </g>
      );
    case "sustainability": // closed material loop
      return (
        <g {...common}>
          <path d="M26 8 a18 18 0 1 1 -12.7 5.3" />
          <path d="M13 6 L13 14 L21 14" />
          <path d="M20 30 q6 -10 12 0" />
        </g>
      );
    case "mechanical": // gear
      return (
        <g {...common}>
          <circle cx="26" cy="25" r="10" />
          <circle cx="26" cy="25" r="3.5" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={26 + Math.cos(a) * 12}
                y1={25 + Math.sin(a) * 12}
                x2={26 + Math.cos(a) * 16}
                y2={25 + Math.sin(a) * 16}
              />
            );
          })}
        </g>
      );
    case "electronics": // circuit
      return (
        <g {...common}>
          <path d="M6 34 L18 34 L18 16 L34 16 L34 34 L46 34" />
          <circle cx="18" cy="34" r="2.5" />
          <circle cx="34" cy="16" r="2.5" />
          <circle cx="46" cy="34" r="2.5" />
        </g>
      );
    case "user-centered": // operator
      return (
        <g {...common}>
          <circle cx="26" cy="15" r="6" />
          <path d="M14 40 q12 -14 24 0" />
          <path d="M10 44 L42 44" />
        </g>
      );
  }
}

export function ProjectVisual({
  category,
  index,
  image,
  alt,
  priority,
  className,
}: {
  category: ProjectCategory;
  index: number;
  /** Real photo/render. When present it's shown instead of the generative art. */
  image?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  if (image) {
    return (
      <div className={cn("plate rounded-xl border border-border", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "ticks relative flex items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-2",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute left-4 top-3 font-mono text-3xs tracking-widest text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <svg viewBox="0 0 52 52" className="h-16 w-16 text-brand-600" role="presentation">
        <Glyph category={category} />
      </svg>
      <span className="flow-rule absolute bottom-0 left-0 h-0.5 w-12" />
    </div>
  );
}
