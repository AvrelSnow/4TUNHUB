"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useConsent } from "./consent-store";
import { Button } from "./ui/Button";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";

/**
 * The narrated tour, offered as a question in the page's language: a small
 * card that slides into a corner a few seconds after the visitor starts
 * scrolling and asks whether they want a free walkthrough.
 *
 * It asks and never plays by itself. The video (several megabytes, on what
 * may be a phone plan) is requested only when the card is pressed, and then
 * plays with its sound. It waits for the privacy bar to be answered, so the
 * two never sit on top of each other. Closing it, or watching, is remembered
 * on this device only, under TOUR_KEY (listed in the privacy note's storage
 * table; keep the two in step).
 */

const TOUR_KEY = "4tun.tour";
const EVENT = "4tun:tour";
const DELAY_MS = 4000;

/** Where the answer lives when storage refuses it (private windows). */
let inMemory = false;

function readSeen(): boolean {
  try {
    return inMemory || localStorage.getItem(TOUR_KEY) !== null;
  } catch {
    return inMemory;
  }
}

function markSeen() {
  inMemory = true;
  try {
    localStorage.setItem(TOUR_KEY, "seen");
  } catch {
    // Kept for this visit only.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function TourCard({ locale, t }: { locale: Locale; t: Dictionary["tour"] }) {
  // The server renders as if already seen: nothing appears until we know.
  const seen = useSyncExternalStore(subscribe, readSeen, () => true);
  const { answered } = useConsent();
  const [due, setDue] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const poster = `/images/previews/tour-${locale}.webp`;

  // The clock starts at the first scroll, not at page load.
  useEffect(() => {
    if (seen) return;
    let timer: number | undefined;
    const start = () => {
      window.removeEventListener("scroll", start);
      timer = window.setTimeout(() => setDue(true), DELAY_MS);
    };
    window.addEventListener("scroll", start, { passive: true });
    return () => {
      window.removeEventListener("scroll", start);
      window.clearTimeout(timer);
    };
  }, [seen]);

  // The page behind must not scroll while the pop-up is open.
  useEffect(() => {
    if (!open) return;
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = before;
    };
  }, [open]);

  return (
    <>
      {due && answered && !seen && (
        <aside
          aria-label={t.label}
          className="fixed inset-x-3 bottom-3 z-30 animate-fade-up rounded-2xl border border-border bg-surface-2 p-5 shadow-e2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
        >
          <p className="text-lg font-semibold tracking-tight text-foreground">{t.question}</p>
          <p className="mt-1.5 text-sm text-muted text-pretty">{t.body}</p>
          <p className="readout mt-2">{t.note}</p>
          {/* Saying no is as easy as saying yes: side by side, one press. */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setOpen(true);
                dialogRef.current?.showModal();
                markSeen();
              }}
            >
              {t.yes}
            </Button>
            <Button variant="secondary" onClick={markSeen}>
              {t.no}
            </Button>
          </div>
        </aside>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // A click on the dimmed backdrop is a click on the dialog itself.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-label={t.label}
        className="m-auto max-h-[92vh] w-[min(56rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-3xl bg-background p-4 text-foreground backdrop:bg-foreground/60 sm:p-6"
      >
        {open && (
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">{t.label}</h2>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={t.close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg text-foreground hover:bg-border"
              >
                ×
              </button>
            </div>
            {/* The captions are drawn into the picture itself. */}
            <video
              src={`/videos/tour-${locale}.mp4`}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="mt-4 aspect-video w-full rounded-2xl bg-foreground"
            />
          </div>
        )}
      </dialog>
    </>
  );
}
