"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROOF_LIMITS, PROOF_SLOTS, proofField, type ApplyError, type ProofSlot } from "@/lib/cohort";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type Copy = Dictionary["cohort"]["form"]["proof"];
type Shots = Dictionary["cohort"]["screenshots"]["shots"];
type Picked = { file: File; thumb: string };

/**
 * The four screenshots, inside the application form.
 *
 * Each slot is a real `<input type="file">` named for the server action, so
 * the form still submits without JavaScript. With it, a picked image is
 * shrunk here to a JPEG of at most PROOF_LIMITS.maxEdge and put back into
 * the input, which keeps four phone screenshots well under the request
 * limit on a slow connection.
 *
 * React resets a form after its action runs, and a file input cannot be
 * given a value through props. So the picks live in state, and are put back
 * into the inputs whenever the action answers (`answer` changes): a
 * validation error elsewhere never costs anyone their four screenshots.
 *
 * Thumbnails are data: URLs because the CSP allows data: images, not blob:.
 */
export function ProofUpload({
  copy,
  shots,
  errors,
  errorText,
  guideHref,
  answer,
}: {
  copy: Copy;
  shots: Shots;
  /** The server's error code per slot. */
  errors: Partial<Record<ProofSlot, ApplyError>>;
  /** Resolves an error code to copy (the form's own error table). */
  errorText: (code: ApplyError) => string | undefined;
  guideHref: string;
  /** The action's latest answer; when it changes, the picks are restored. */
  answer: unknown;
}) {
  const [picked, setPicked] = useState<Partial<Record<ProofSlot, Picked>>>({});
  const [busy, setBusy] = useState<Partial<Record<ProofSlot, boolean>>>({});
  const [local, setLocal] = useState<Partial<Record<ProofSlot, ApplyError>>>({});
  // Slots re-picked since the server last answered: its verdict on them is
  // about a file that is gone, so it no longer shows.
  const [fresh, setFresh] = useState<Partial<Record<ProofSlot, boolean>>>({});
  const [seenAnswer, setSeenAnswer] = useState(answer);
  const inputs = useRef<Partial<Record<ProofSlot, HTMLInputElement | null>>>({});

  // A new answer makes every slot's server verdict current again.
  if (answer !== seenAnswer) {
    setSeenAnswer(answer);
    setFresh({});
  }

  useEffect(() => {
    for (const slot of PROOF_SLOTS) {
      const p = picked[slot];
      if (p) place(inputs.current[slot] ?? null, p.file);
    }
    // Only the action's answer triggers a restore; a new pick places itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  async function choose(slot: ProofSlot, input: HTMLInputElement) {
    const source = input.files?.[0];
    if (!source) return;
    setBusy((b) => ({ ...b, [slot]: true }));
    setLocal((l) => ({ ...l, [slot]: undefined }));
    setFresh((f) => ({ ...f, [slot]: true }));
    try {
      const shrunk = await shrink(source, slot);
      place(input, shrunk.file);
      setPicked((p) => ({ ...p, [slot]: shrunk }));
    } catch {
      // A browser that cannot decode the file (HEIC outside Safari, say)
      // can still send it as it is, if it is a type the server accepts.
      const ok = (PROOF_LIMITS.types as readonly string[]).includes(source.type);
      if (ok && source.size <= PROOF_LIMITS.maxBytes) {
        setPicked((p) => ({ ...p, [slot]: { file: source, thumb: "" } }));
      } else {
        input.value = "";
        setPicked((p) => ({ ...p, [slot]: undefined }));
        setLocal((l) => ({ ...l, [slot]: ok ? "proofTooLarge" : "proofUnreadable" }));
      }
    } finally {
      setBusy((b) => ({ ...b, [slot]: false }));
    }
  }

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-sm font-medium text-foreground">{copy.legend}</legend>
      <p className="-mt-1 text-2xs leading-5 text-muted">
        {copy.hint}{" "}
        <Link href={guideHref} className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent">
          {copy.guide}
        </Link>
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {PROOF_SLOTS.map((slot) => {
          const p = picked[slot];
          const title = shots[slot].title;
          // This pick's own problem first; the server's answer only until a
          // new file replaces the one it was about.
          const code = local[slot] ?? (fresh[slot] ? undefined : errors[slot]);
          const error = code ? errorText(code) : undefined;
          const errorId = `proof-${slot}-error`;
          return (
            <li key={slot} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
              <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface">
                {p?.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumb} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
                    <path d="m3.5 15.5 4.5-4.5 4 4 3-3 5.5 5.5" />
                    <circle cx="15.5" cy="9" r="1.5" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-5 text-foreground">{title}</p>
                <p className={cn("mt-0.5 text-2xs", error ? "font-medium text-danger" : "text-muted")} id={errorId}>
                  {busy[slot] ? copy.preparing : error ?? (p ? copy.added : "")}
                </p>
              </div>
              <label
                className={cn(
                  "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full px-4 text-2xs font-medium transition-colors",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2",
                  p ? "bg-surface text-foreground hover:bg-border" : "bg-primary text-primary-foreground hover:bg-primary-hover",
                )}
              >
                {p ? copy.replace : copy.add}
                <input
                  ref={(el) => {
                    inputs.current[slot] = el;
                  }}
                  type="file"
                  name={proofField(slot)}
                  accept="image/*"
                  required
                  aria-label={`${p ? copy.replace : copy.add}: ${title}`}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={errorId}
                  className="sr-only"
                  onChange={(e) => choose(slot, e.currentTarget)}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** Put a file into a file input. Old browsers without DataTransfer keep the original. */
function place(input: HTMLInputElement | null, file: File) {
  if (!input || typeof DataTransfer === "undefined") return;
  try {
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
  } catch {
    // Keep whatever the input holds.
  }
}

async function shrink(source: File, slot: ProofSlot): Promise<Picked> {
  const bitmap = await createImageBitmap(source);
  const scale = Math.min(1, PROOF_LIMITS.maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D canvas");
  // A transparent PNG would turn black as a JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let blob: Blob | null = null;
  for (const quality of [0.82, 0.7, 0.55, 0.4]) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= PROOF_LIMITS.maxBytes) break;
  }
  if (!blob || blob.size > PROOF_LIMITS.maxBytes) throw new Error("Could not shrink");

  const t = document.createElement("canvas");
  const ts = 240 / Math.max(w, h);
  t.width = Math.round(w * ts);
  t.height = Math.round(h * ts);
  t.getContext("2d")?.drawImage(canvas, 0, 0, t.width, t.height);

  return {
    file: new File([blob], `${slot}.jpg`, { type: "image/jpeg" }),
    thumb: t.toDataURL("image/jpeg", 0.7),
  };
}
