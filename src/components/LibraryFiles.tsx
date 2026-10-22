"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { submitWaitlist } from "@/lib/waitlist-action";
import { initialWaitlistState, WAITLIST_LIMITS } from "@/lib/waitlist";
import { ANALYTICS_EVENTS, track, useTrackOnce } from "@/lib/track";
import type { LibraryFile } from "@/lib/lsdyna";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The files for an episode, behind one email address.
 *
 * The address goes on the same list as every other signup, under the
 * `lsdyna` track, and the copy above the field says so: that is the
 * consent. Once given, this browser remembers it and every episode's files
 * are open, so nobody types their address twice.
 *
 * It is a courtesy gate, not a lock: the files are public URLs, and that
 * is deliberate. If the list cannot be reached, the files open anyway — a
 * learner is never kept from a tutorial file because our mail failed.
 */

/** Listed in the privacy note's storage table; keep the two in step. */
const STORAGE_KEY = "4tun.library";
const UNLOCK_EVENT = "4tun:library";

/** Where the answer lives when storage refuses it (private windows). */
let inMemory = false;

function readUnlocked(): boolean {
  try {
    return inMemory || localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return inMemory;
  }
}

function unlock() {
  inMemory = true;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Costs the address again on the next visit, nothing on this one.
  }
  window.dispatchEvent(new Event(UNLOCK_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(UNLOCK_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(UNLOCK_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function LibraryFiles({
  files,
  t,
  waitlist,
  privacyHref,
}: {
  files: LibraryFile[];
  t: Dictionary["library"]["files"];
  waitlist: Dictionary["waitlist"];
  privacyHref: string;
}) {
  const unlocked = useSyncExternalStore(subscribe, readUnlocked, () => false);
  const [state, formAction, pending] = useActionState(submitWaitlist, initialWaitlistState);
  const id = useId();

  const lost =
    state.formError === "unavailable" || state.formError === "failed" || state.formError === "rateLimited";
  const opened = state.status === "success" || lost;
  useTrackOnce(state.status === "success", ANALYTICS_EVENTS.waitlist, { track: "lsdyna", form: "library" });

  useEffect(() => {
    if (opened) unlock();
  }, [opened]);

  const fieldError = state.fieldErrors?.email ? waitlist.form.errors[state.fieldErrors.email] : undefined;

  return (
    <div className="rounded-3xl bg-surface p-6 sm:p-8">
      <h2 className="text-headline text-foreground">{t.title}</h2>

      {files.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{t.none}</p>
      ) : (
        <>
          {opened && (
            <p role="status" className="mt-3 text-sm font-medium text-foreground">
              {lost ? t.unlockedLost : t.unlocked}
            </p>
          )}

          <ul className="mt-5 divide-y divide-border border-y border-border">
            {files.map((f) => (
              <li key={f.href} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-foreground">{f.name}</p>
                  <p className="readout mt-1">
                    {t.kinds[f.kind]} · {f.size}
                  </p>
                </div>
                {unlocked && (
                  <Button
                    as="a"
                    href={f.href}
                    download={f.name}
                    size="sm"
                    variant="raised"
                    onClick={() => track(ANALYTICS_EVENTS.download, { file: f.name })}
                  >
                    {t.download}
                  </Button>
                )}
              </li>
            ))}
          </ul>

          {!unlocked && (
            <form action={formAction} noValidate className="mt-6">
              <input type="hidden" name="tracks" value="lsdyna" />
              <p className="font-medium text-foreground">{t.gateTitle}</p>
              <p className="mt-2 text-sm text-muted">{t.gateBody}</p>

              <label htmlFor={id} className="sr-only">
                {waitlist.inline.label}
              </label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  id={id}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={WAITLIST_LIMITS.emailMax}
                  placeholder={waitlist.inline.placeholder}
                  defaultValue={state.values?.email}
                  aria-invalid={fieldError ? true : undefined}
                  aria-describedby={fieldError ? `${id}-error` : undefined}
                  className="h-11 w-full min-w-0 flex-1 rounded-full border border-hairline bg-surface-2 px-5 text-sm text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted hover:border-subtle focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none aria-[invalid=true]:border-danger"
                />
                <Button type="submit" disabled={pending} className="shrink-0">
                  {pending ? t.submitting : t.submit}
                </Button>
              </div>

              {/* Honeypot — off-screen, ignored by real users, filled by naive bots. */}
              <div className="sr-only" aria-hidden="true">
                <label>
                  Company website
                  <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {fieldError && (
                <p id={`${id}-error`} role="alert" className="mt-3 text-2xs font-medium text-danger">
                  {fieldError}
                </p>
              )}

              <p className="mt-4 text-2xs leading-5 text-muted">
                {waitlist.inline.promise}{" "}
                <Link
                  href={privacyHref}
                  className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {t.privacy}
                </Link>
              </p>
            </form>
          )}
        </>
      )}
    </div>
  );
}
