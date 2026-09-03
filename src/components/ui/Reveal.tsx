"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll reveal — content fades up 16px as it enters the viewport.
 *
 * Art-direction §"motion": a reveal must never leave content invisible on
 * load. So the server-rendered state is VISIBLE, and an element only hides
 * itself after mount, and only if it is genuinely below the fold. Anything
 * already on screen (or rendered without JS, or under reduced-motion) is
 * painted immediately — no blank first frame, nothing to wait for.
 */
type State = "static" | "hidden" | "shown";

export function Reveal({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Above the fold on first paint → never hide it.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-quart)]",
        state === "hidden" ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
