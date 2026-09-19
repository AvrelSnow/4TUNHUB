import { cn } from "@/lib/cn";

/**
 * Brand glyphs for the founder's connect links. Inline SVG so they scale
 * crisply and can carry their own colour.
 *
 * Each mark wears its OWN brand colour: a quotation of someone else's
 * brand, confined to that brand's own icon, never our surfaces or type.
 * Icons are non-text graphics, so the bar is WCAG 1.4.11's 3:1 rather than
 * 4.5:1: LinkedIn and Gmail both clear it on white and on black.
 */
const tones: Record<string, string> = {
  // Medium's mark is black on light grounds and white on dark ones. White
  // IS its dark-ground treatment, not a substitute for it.
  medium: "text-foreground",
  linkedin: "text-mark-linkedin",
  email: "text-mark-gmail",
  // GrabCAD's official brand colour isn't confirmed here, so it stays on
  // the neutral rather than inventing one. Swap in the real hex when known.
  grabcad: "text-foreground",
  portfolio: "text-accent",
};

function Glyph({ icon }: { icon: string }) {
  const p = { fill: "currentColor" };
  switch (icon) {
    case "portfolio":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/4tunhub-mark.svg" alt="" className="h-7 w-7" />
      );
    case "grabcad":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" />
          <path d="M12 2 V12 M12 12 L21 7 M12 12 L3 7" />
        </svg>
      );
    case "medium":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...p}>
          <ellipse cx="6.3" cy="12" rx="5.8" ry="5.2" />
          <ellipse cx="16.5" cy="12" rx="2.4" ry="5" />
          <ellipse cx="22" cy="12" rx="1" ry="4.4" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...p}>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.75-2.05 4 0 4.75 2.6 4.75 6V21H21v-5.6c0-1.35-.02-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3v5.7H13V9Z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3.5 6.5 12 13l8.5-6.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function FounderConnect({
  links,
  className,
}: {
  links: { label: string; href: string; icon: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith("http") ? "_blank" : undefined}
          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={l.label}
          className="group flex w-24 flex-col items-center gap-2.5 rounded-2xl bg-surface px-2 py-4 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-border"
        >
          {/* The glyph keeps its own brand colour; only the label responds
              to hover, so the marks stay recognisable at rest. */}
          <span className={cn("transition-transform duration-200 group-hover:scale-110", tones[l.icon] ?? "text-muted")}>
            <Glyph icon={l.icon} />
          </span>
          <span className="text-2xs font-medium text-muted transition-colors group-hover:text-foreground">
            {l.label}
          </span>
        </a>
      ))}
    </div>
  );
}
