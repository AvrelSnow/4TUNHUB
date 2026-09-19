"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/**
 * Zoomable image: click to see it full size, so detailed drawings and
 * photographs are legible. role=dialog + aria-modal, Escape / backdrop /
 * button to close, page scroll locked while open, top z-layer (50).
 * The dialog is portalled to <body> so no transformed ancestor can clip it.
 */
export function Zoomable({
  src,
  alt,
  label,
  closeLabel,
  fit = "cover",
  position,
  className,
}: {
  src: string;
  alt: string;
  label: string;
  closeLabel: string;
  fit?: "cover" | "contain";
  position?: string;
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
          "media media-zoom group block w-full cursor-zoom-in",
          // `contain` is a sheet (drawing, BOM, schematic): shown whole on white.
          fit === "contain" && "media-doc",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={position ? { objectPosition: position } : undefined}
          className={cn("h-full w-full", fit === "cover" ? "object-cover" : "object-contain p-3")}
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/70 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 3h5v5M8 17H3v-5M17 3l-6 6M3 17l6-6" />
          </svg>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-ink-975/90 p-4 backdrop-blur-xl sm:p-10"
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 5 L15 15 M15 5 L5 15" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[94vw] cursor-zoom-out rounded-2xl bg-white object-contain"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
