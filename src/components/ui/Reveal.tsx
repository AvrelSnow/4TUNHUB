import { cn } from "@/lib/cn";

/**
 * Scroll reveal: content rises 32px and fades in as it enters the
 * viewport, driven by the scroll position itself (`.reveal` in
 * globals.css, CSS scroll-driven animations). No JavaScript, so nothing
 * here ships to the client and nothing can be left hidden: a browser
 * without scroll timelines, or a reader who asked for reduced motion,
 * simply sees the content.
 *
 * `delay` is kept for call sites; a scroll-driven entrance is already
 * staggered by where each element sits on the page.
 */
export function Reveal({
  className,
  delay: _delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
