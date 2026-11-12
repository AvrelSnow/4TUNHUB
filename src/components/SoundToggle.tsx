"use client";

import { useEffect, useState } from "react";
import { onSoundChange, setSoundEnabled, soundEnabled } from "@/lib/sound";
import { cn } from "@/lib/cn";

/**
 * The speaker in the nav. Off until the visitor turns it on; the state is
 * remembered (src/lib/sound.ts). A real toggle button: aria-pressed says
 * the state, the label says what it controls.
 */
export function SoundToggle({
  label,
  on: onLabel,
  off: offLabel,
  className,
}: {
  label: string;
  on: string;
  off: string;
  className?: string;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Read after mount: the server cannot know a stored preference.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(soundEnabled());
    return onSoundChange(setOn);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={on ? onLabel : offLabel}
      onClick={() => setSoundEnabled(!on)}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5",
        on ? "text-foreground" : "text-muted",
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.5 7.5h2.5L10 4v12l-4-3.5H3.5z" fill="currentColor" fillOpacity="0.15" />
        {on ? (
          <>
            <path d="M13 7.2a4 4 0 0 1 0 5.6" />
            <path d="M15.2 5a7 7 0 0 1 0 10" />
          </>
        ) : (
          <path d="m13.5 8 4 4m0-4-4 4" />
        )}
      </svg>
    </button>
  );
}
