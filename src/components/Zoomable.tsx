"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Zoomable image — click to open the full-size image in a lightbox so
 * detailed drawings and photos are legible. Accessible: role=dialog +
 * aria-modal, Escape / backdrop / button to close, body scroll locked
 * while open. Uses the top z-layer (50), consistent with the z-scale.
 */
export function Zoomable({
  src,
  alt,
  label,
  closeLabel,
  fit = "cover",
  className,
}: {
  src: string;
  alt: string;
  label: string;
  closeLabel: string;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        className={cn(
          // `plate` carries the one image treatment. It lifts on hover and
          // on keyboard focus, so the graded state never hides detail from
          // someone inspecting the work.
          "plate group block cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // `contain` means "show the whole sheet" — a drawing, a BOM, a
          // schematic. Those are read, so they take the document variant
          // rather than the photographic grade.
          fit === "contain" && "plate-doc",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn("h-full w-full", fit === "cover" ? "object-cover" : "object-contain")}
        />
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/70 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5 L18 18 M9 6.5v5 M6.5 9h5" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 5 L15 15 M15 5 L5 15" />
            </svg>
          </button>
          {/* Deliberately outside `.plate`: the lightbox shows the photograph
              ungraded. The treatment is presentation; the evidence stays
              available at full fidelity. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[94vw] cursor-zoom-out rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
