"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A horizontal gallery. Native scrolling with snap points, so it swipes on
 * a phone and scrolls with a trackpad; two round buttons page it on a
 * desktop. The row bleeds to the viewport edge while its first card lines
 * up with the page's content column.
 */
export function Rail({
  labels,
  className,
  children,
}: {
  labels: { previous: string; next: string; region: string };
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const button =
    "flex h-11 w-11 items-center justify-center rounded-full bg-surface text-foreground transition-[background-color,opacity] duration-200 hover:bg-border disabled:cursor-default disabled:opacity-40";

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={labels.region}
        tabIndex={0}
        className="rail flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8 xl:scroll-px-[max(2rem,calc((100%_-_72rem)/2_+_2rem))] xl:px-[max(2rem,calc((100%_-_72rem)/2_+_2rem))]"
      >
        {children}
      </div>
      <div className="mx-auto mt-8 flex max-w-6xl justify-end gap-3 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={edge.start}
          aria-label={labels.previous}
          className={button}
        >
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.5 2 3.5 6l4 4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={edge.end}
          aria-label={labels.next}
          className={button}
        >
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 2 8.5 6l-4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** One card in a Rail: fixed width, snaps to the start. */
export function RailItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("w-[78vw] max-w-sm shrink-0 snap-start sm:w-80 lg:w-96", className)}>
      {children}
    </div>
  );
}
