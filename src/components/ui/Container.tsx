import { cn } from "@/lib/cn";

/** Horizontal rhythm wrapper. One max-width for the whole ecosystem. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}
