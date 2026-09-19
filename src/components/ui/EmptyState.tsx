import { Badge } from "./Badge";
import { cn } from "@/lib/cn";

/**
 * The honest zero. Three pillars ship empty on purpose (store, blog,
 * careers); this says so plainly, in the same quiet panel on each, and
 * carries whatever the visitor can do instead as children.
 */
export function EmptyState({
  eyebrow,
  title,
  body,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-3xl bg-surface px-8 py-14 text-center sm:px-14 sm:py-20", className)}>
      <Badge variant="outline">{eyebrow}</Badge>
      <h2 className="mx-auto mt-6 max-w-2xl text-display-sm text-foreground">{title}</h2>
      <p className="mx-auto mt-5 max-w-xl text-lead text-muted">{body}</p>
      {children}
    </div>
  );
}
