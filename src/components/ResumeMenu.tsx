"use client";

import { useState, useRef, useEffect } from "react";

type Item = { key: string; label: string; href: string; external: boolean };

/**
 * Résumé download menu — opens on hover or keyboard focus and offers the
 * three CV tracks. Escape and outside-click close it; the trigger reports
 * state via aria-expanded.
 */
export function ResumeMenu({ label, items }: { label: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface px-7 text-base font-medium tracking-tight text-foreground transition-colors duration-200 hover:bg-border"
      >
        {label}
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M3 4.5 L6 7.5 L9 4.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-2 w-64 animate-fade-in overflow-hidden rounded-2xl border border-border bg-surface-2 p-1.5 shadow-e2">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              {...(item.external ? {} : { download: "" })}
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm text-foreground transition-colors hover:bg-surface"
            >
              <span className="font-medium">{item.label}</span>
              <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {item.external ? (
                  <path d="M6 3h7v7 M13 3 L6.5 9.5 M11 9v4H3V5h4" />
                ) : (
                  <path d="M8 2v9 M4.5 7.5 L8 11l3.5-3.5 M3 13h10" />
                )}
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
