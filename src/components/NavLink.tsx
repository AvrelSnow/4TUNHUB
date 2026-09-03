"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Navigation link with the signature amber sweep and active state.
 * aria-current="page" both announces the active page to screen readers
 * and pins the sweep underline via CSS.
 */
export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        // Mono micro-label: the nav is a row of instrument switches, not
        // a sentence (art-direction §"type").
        "link-sweep font-mono text-2xs font-medium uppercase tracking-[0.14em] transition-colors",
        active ? "text-foreground" : "text-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
