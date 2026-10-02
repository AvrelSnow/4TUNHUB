import { MKV } from "@/lib/cohort";
import { cn } from "@/lib/cn";

/**
 * "In partnership with" and MKV Academy's logo, which opens their site.
 * The logo sits on its own white chip in both themes and on the dark
 * cohort panel: it is their artwork, drawn for a white ground.
 */
export function PartnerBadge({
  label,
  newTab,
  tone = "default",
  className,
}: {
  label: string;
  newTab: string;
  /** `dark` for the ink panel, where the label needs light type. */
  tone?: "default" | "dark";
  className?: string;
}) {
  return (
    <p className={cn("inline-flex flex-wrap items-center gap-3", className)}>
      <span className={cn("text-sm font-medium", tone === "dark" ? "text-white/70" : "text-muted")}>
        {label}
      </span>
      <a
        href={MKV.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${MKV.name} (${newTab})`}
        className={cn(
          "inline-flex h-11 items-center rounded-xl bg-white px-3 transition-colors",
          tone === "dark" ? "hover:bg-white/90" : "border border-border hover:border-foreground/30",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MKV.logo} alt={MKV.name} width={112} height={32} className="h-8 w-auto" />
      </a>
    </p>
  );
}
