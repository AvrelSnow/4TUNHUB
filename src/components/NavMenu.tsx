"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { tick } from "@/lib/sound";
import { cn } from "@/lib/cn";

/**
 * A mega-menu trigger in the floating bar. The panel's content is rendered
 * on the server and passed in as children; this component only owns the
 * open state.
 *
 * Opens on click, and on hover after a short intent delay for mouse users.
 * Closes on Escape (focus returns to the trigger), on a click outside, when
 * focus leaves the menu, and when the route changes. The trigger is a real
 * button with aria-expanded/aria-controls; the panel is a plain region of
 * links, so keyboard users tab through it in reading order.
 *
 * The panel spans the bar's full width (it is positioned against the pill,
 * which is `relative`), and a transparent 12px bridge above it keeps the
 * hover alive while the pointer crosses the gap.
 */
export function NavMenu({
  label,
  active = false,
  children,
}: {
  label: string;
  /** The current page lives in this menu. */
  active?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hover = (next: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), next ? 90 : 160);
  };

  return (
    <div
      ref={root}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen((o) => !o);
          tick();
        }}
        className={cn(
          "group/nav relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-200 hover:bg-foreground/5",
          open || active ? "text-foreground" : "text-muted hover:text-foreground",
          active ? "font-semibold" : "font-medium",
        )}
      >
        {label}
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 4.5 3 3 3-3" />
        </svg>
        {active && (
          <span aria-hidden="true" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-foreground" />
        )}
      </button>

      <div
        id={id}
        hidden={!open}
        className="absolute inset-x-0 top-full pt-3"
      >
        <div className="menu-panel animate-fade-in overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-e2">
          {children}
        </div>
      </div>
    </div>
  );
}
