"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Media } from "@/components/ui/Media";
import { VideoPlayer } from "@/components/VideoPlayer";
import type { Talk } from "@/lib/talks";

/**
 * A session we hosted, shown the way it deserves: a picture of it, who gave
 * it and when, and (when a recording exists) a pop-up that plays it right
 * here, with what it covers and its chapters. No trip to YouTube.
 *
 * The poster is our own file. The video costs nothing until it is wanted:
 * the dialog's contents are mounted only when it opens, and the player
 * inside loads from YouTube's no-cookie domain (VideoPlayer). A session
 * without a recording is a plain card that goes to its event page, with
 * no play button.
 */

export type SessionLabels = {
  with: string;
  watch: string;
  noRecording: string;
  eventPage: string;
  onYoutube: string;
  close: string;
  learnTitle: string;
  length: string;
};

type PlayerLabels = {
  play: string;
  playerNote: string;
  chaptersTitle: string;
  chaptersHint: string;
};

export function SessionCard({
  talk,
  roleLabel,
  labels,
  playerLabels,
}: {
  talk: Talk;
  roleLabel: string;
  labels: SessionLabels;
  playerLabels: PlayerLabels;
}) {
  const rec = talk.recording;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // The page behind must not scroll while the pop-up is open.
  useEffect(() => {
    if (!open) return;
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = before;
    };
  }, [open]);

  const meta = (
    <>
      <p className="text-2xs font-semibold tracking-wide text-accent">
        {talk.org}
        {talk.date ? ` · ${talk.date}` : ""}
      </p>
      <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-foreground">{talk.title}</h3>
      {talk.speaker && (
        <p className="mt-2 text-sm leading-6 text-muted">
          {labels.with} {talk.speaker}
        </p>
      )}
    </>
  );

  if (!rec) {
    return (
      <div className="flex h-full flex-col rounded-3xl bg-surface p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{roleLabel}</Badge>
          <Badge variant="outline">{labels.noRecording}</Badge>
        </div>
        <div className="mt-4">{meta}</div>
        <a
          href={talk.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-6 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {labels.eventPage} ↗
        </a>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          dialogRef.current?.showModal();
        }}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-surface text-left transition-transform duration-200 hover:-translate-y-0.5"
        aria-label={`${labels.watch}: ${talk.title}`}
      >
        <div className="relative">
          <Media src={rec.poster} alt="" className="aspect-video w-full" />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
                <path d="M8 5.5v13a.75.75 0 0 0 1.14.64l10.5-6.5a.75.75 0 0 0 0-1.28l-10.5-6.5A.75.75 0 0 0 8 5.5Z" />
              </svg>
            </span>
          </span>
          <span className="readout absolute right-3 bottom-3 rounded-full bg-background px-2.5 py-1">
            {rec.length}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{roleLabel}</Badge>
          </div>
          {meta}
        </div>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // A click on the dimmed backdrop is a click on the dialog itself.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-label={talk.title}
        className="m-auto max-h-[92vh] w-[min(56rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-3xl bg-background p-5 text-foreground backdrop:bg-foreground/60 sm:p-8"
      >
        {open && (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xs font-semibold tracking-wide text-accent">
                  {talk.org}
                  {talk.date ? ` · ${talk.date}` : ""} · {rec.length}
                </p>
                <h2 className="mt-2 text-2xl leading-tight font-bold tracking-tight">{talk.title}</h2>
                {talk.speaker && (
                  <p className="mt-2 text-sm text-muted">
                    {labels.with} {talk.speaker}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={labels.close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg text-foreground hover:bg-border"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <VideoPlayer
                videoId={rec.videoId}
                title={talk.title}
                chapters={rec.chapters}
                autoStart
                t={playerLabels}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-headline text-foreground">{labels.learnTitle}</h2>
              <ul className="mt-4 grid gap-2 text-muted">
                {rec.learn.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent">
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-5 text-sm">
              <a
                href={`https://www.youtube.com/watch?v=${rec.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {labels.onYoutube} ↗
              </a>
              <a
                href={talk.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {labels.eventPage} ↗
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
