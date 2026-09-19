import { cn } from "@/lib/cn";

/**
 * Card — the surface primitive. Every pillar tile, course and resource is
 * built on it, so the ecosystem stays coherent as it grows.
 *
 * It separates from the page by tone, not by border or shadow: `surface`
 * on a white section, `raised` on a grey one. Interactive cards lift a
 * little on hover.
 */
type Tone = "surface" | "raised" | "outline";

const tones: Record<Tone, string> = {
  surface: "bg-surface",
  raised: "bg-surface-2 shadow-e1",
  outline: "border border-border bg-transparent",
};

export function Card({
  className,
  tone = "surface",
  interactive = false,
  children,
}: {
  className?: string;
  tone?: Tone;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-7 sm:p-8",
        tones[tone],
        interactive &&
          "transition-[transform,box-shadow] duration-500 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1 hover:shadow-e2",
        className,
      )}
    >
      {children}
    </div>
  );
}
