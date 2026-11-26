"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { backupText, parseBackup, restore, startOver } from "@/lib/backup";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/** Take your progress to another device, or wipe it from this one. */
export function ProgressTools({ t }: { t: Dictionary["board"]["keep"] }) {
  const picker = useRef<HTMLInputElement>(null);
  const [said, setSaid] = useState("");

  const save = () => {
    const url = URL.createObjectURL(new Blob([backupText()], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `engineering-thinking-${new Date().toLocaleDateString("en-CA")}.json`;
    a.click();
    // Some phones start the download after this tick.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setSaid(t.saved);
  };

  const load = async (file: File) => {
    // A real one is a few kilobytes.
    const saved = file.size < 1_000_000 ? parseBackup(await file.text()) : null;
    if (!saved) return setSaid(t.notOurs);
    if (!window.confirm(t.confirmLoad)) return;
    restore(saved);
    setSaid(t.loaded);
  };

  const wipe = () => {
    if (!window.confirm(t.confirmReset)) return;
    startOver();
    setSaid(t.reset);
  };

  return (
    <section aria-labelledby="keep-progress" className="mt-12 rounded-3xl bg-surface p-6">
      <h2 id="keep-progress" className="text-xl font-semibold tracking-tight text-foreground">
        {t.title}
      </h2>
      <p className="mt-2 text-sm text-muted">{t.body}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="raised" onClick={save}>
          {t.save}
        </Button>
        <Button type="button" variant="raised" onClick={() => picker.current?.click()}>
          {t.load}
        </Button>
        <Button type="button" variant="ghost" onClick={wipe}>
          {t.startOver}
        </Button>
        <input
          ref={picker}
          type="file"
          accept="application/json,.json"
          aria-label={t.load}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            // The same file can be chosen again.
            e.target.value = "";
            if (file) void load(file);
          }}
        />
      </div>
      <p role="status" className="mt-3 text-sm text-foreground">
        {said}
      </p>
    </section>
  );
}
