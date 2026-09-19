"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Navigation link. The current page reads in full foreground colour and is
 * announced with aria-current="page"; the rest sit back in muted grey.
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
        "text-sm transition-colors duration-200",
        active ? "font-medium text-foreground" : "text-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
