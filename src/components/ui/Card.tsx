import { cn } from "@/lib/cn";

/**
 * Surface primitive. Every pillar tile, resource, course card, etc.
 * is built on this so the ecosystem stays visually coherent as it grows.
 */
export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6",
        interactive &&
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-e2",
        className,
      )}
    >
      {children}
    </div>
  );
}
