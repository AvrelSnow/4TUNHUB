"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Navigation link inside the floating bar. Hover lays a soft pill under
 * the word; the current page reads in full ink, is announced with
 * aria-current="page", and carries an amber dot under it, the nav's only
 * colour, so it always means "you are here".
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
        "group/nav relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 hover:bg-foreground/5",
        active ? "font-semibold text-foreground" : "font-medium text-muted hover:text-foreground",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-[opacity,transform] duration-300",
          "bg-brand-500",
          active ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover/nav:scale-100 group-hover/nav:opacity-60",
        )}
      />
    </Link>
  );
}
