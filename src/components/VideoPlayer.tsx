"use client";

import { useState } from "react";
import { seconds, type Chapter } from "@/lib/lsdyna";
import { cn } from "@/lib/cn";

/**
 * A YouTube video that costs nothing until it is wanted.
 *
 * The page renders a plain panel with a play button: no request to
 * YouTube, no cookie, no 1 MB of player script on a phone plan. The
 * iframe, from the no-cookie domain, is mounted only when the visitor
 * presses play or a chapter, and starts at that chapter.
 */
export function VideoPlayer({
  videoId,
  title,
  chapters,
  t,
}: {
  videoId: string;
  title: string;
  chapters?: Chapter[];
  t: { play: string; playerNote: string; chaptersTitle: string; chaptersHint: string };
}) {
  const [start, setStart] = useState<number | null>(null);
  const playing = start !== null;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&start=${start ?? 0}`;

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-surface">
        {playing ? (
          <iframe
            // A new key per start time remounts the player at that chapter.
            key={start}
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setStart(0)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
          >
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105 sm:h-20 sm:w-20"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor">
                <path d="M8 5.5v13a.75.75 0 0 0 1.14.64l10.5-6.5a.75.75 0 0 0 0-1.28l-10.5-6.5A.75.75 0 0 0 8 5.5Z" />
              </svg>
            </span>
            <span className="text-base font-medium text-foreground">{t.play}</span>
            <span className="readout max-w-sm">{t.playerNote}</span>
          </button>
        )}
      </div>

      {chapters && chapters.length > 0 && (
        <div className="mt-10">
          <h2 className="text-headline text-foreground">{t.chaptersTitle}</h2>
          <p className="mt-2 text-sm text-muted">{t.chaptersHint}</p>
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {chapters.map((c) => {
              const at = seconds(c.at);
              return (
                <li key={c.at}>
                  <button
                    type="button"
                    onClick={() => setStart(at)}
                    className={cn(
                      "flex w-full items-baseline gap-4 py-3 text-left transition-colors hover:text-accent",
                      start === at ? "text-accent" : "text-foreground",
                    )}
                  >
                    <span className="readout w-12 shrink-0 tabular-nums">{c.at}</span>
                    <span className="text-sm">{c.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
