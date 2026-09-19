import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * "Learn more ›" — the site's text link to somewhere else. The chevron
 * nudges right on hover. External links open in a new tab with a safe rel
 * and get an outward arrow instead.
 */
export function ArrowLink({
  href,
  external = false,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "group/arrow inline-flex items-center gap-1 text-base font-medium text-accent hover:underline hover:underline-offset-4",
    className,
  );
  const icon = <Chevron external={external} />;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {icon}
    </Link>
  );
}

/** Also used inside cards whose whole surface is the link. */
export function Chevron({ external = false }: { external?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover/arrow:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {external ? <path d="M4 2.5h5.5V8M9.5 2.5 2.5 9.5" /> : <path d="M4.5 2 8.5 6l-4 4" />}
    </svg>
  );
}
