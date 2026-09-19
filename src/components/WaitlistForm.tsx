"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { InputField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitWaitlist } from "@/lib/waitlist-action";
import { TRACK_VALUES, WAITLIST_LIMITS, initialWaitlistState } from "@/lib/waitlist";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type WaitlistCopy = Dictionary["waitlist"];

/**
 * The waitlist form. The server action is the gate; this is presentation.
 *
 * The tracks are the heart of it: each one says what is coming and when,
 * so the same control that signs a person up also tells them what they
 * are signing up for. Ticking a box is the consent — we never email
 * anyone about a track they did not choose.
 */
export function WaitlistForm({
  t,
  privacyHref,
  defaultTrack,
}: {
  t: WaitlistCopy;
  privacyHref: string;
  /** Pre-ticked when the visitor arrived from that pillar's page. */
  defaultTrack?: string;
}) {
  const [state, formAction, pending] = useActionState(submitWaitlist, initialWaitlistState);
  const f = t.form;
  const err = (code?: string) => (code ? f.errors[code] : undefined);
  const v = state.values ?? {};
  const groupId = useId();

  if (state.status === "success") {
    return (
      <div role="status" className="py-12 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success text-white"
        >
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5 8 14l7.5-8" />
          </svg>
        </span>
        <h2 className="mt-6 text-display-sm text-foreground">{t.success.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">{t.success.body}</p>
      </div>
    );
  }

  // Delivery can fail — no key on the host, a provider outage. When it
  // does, the address is handed back as a ready-written email rather than
  // lost.
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "[Waitlist] Sign me up",
  )}&body=${encodeURIComponent(
    [`Email: ${v.email ?? ""}`, `Name: ${v.name ?? ""}`, `Tracks: ${(v.tracks ?? []).join(", ")}`].join("\n"),
  )}`;

  const tracksError = err(state.fieldErrors?.tracks);
  // First render has no submitted values, so the pillar the visitor came
  // from decides. After an error, their own choices win.
  const ticked = (key: string) =>
    state.status === "idle" ? key === defaultTrack : (v.tracks ?? []).includes(key as never);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">{f.tracksLabel}</legend>
        <p className="text-2xs text-muted">{f.tracksHint}</p>
        <div
          className="mt-1 grid gap-3 sm:grid-cols-2"
          aria-describedby={tracksError ? `${groupId}-error` : undefined}
        >
          {TRACK_VALUES.map((key) => {
            const copy = f.tracks[key];
            return (
              <label
                key={key}
                className={cn(
                  "group flex cursor-pointer gap-3 rounded-2xl border border-hairline bg-surface-2 p-5",
                  "transition-[border-color,background-color] duration-200 hover:border-subtle",
                  "has-[:checked]:border-foreground has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15",
                )}
              >
                <input
                  type="checkbox"
                  name="tracks"
                  value={key}
                  defaultChecked={ticked(key)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[var(--color-primary)]"
                />
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">{copy.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{copy.desc}</span>
                  <span className="readout mt-2 block">{copy.when}</span>
                </span>
              </label>
            );
          })}
        </div>
        {tracksError && (
          <p id={`${groupId}-error`} className="text-2xs font-medium text-danger">
            {tracksError}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          label={f.email.label}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={WAITLIST_LIMITS.emailMax}
          placeholder={f.email.placeholder}
          defaultValue={v.email}
          error={err(state.fieldErrors?.email)}
          required
        />
        <InputField
          label={f.name.label}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={WAITLIST_LIMITS.nameMax}
          placeholder={f.name.placeholder}
          hint={f.name.hint}
          defaultValue={v.name}
        />
      </div>

      {/* Honeypot — off-screen, ignored by real users, filled by naive bots. */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.formError && (
        <div
          role="alert"
          className={cn(
            "rounded-2xl p-5 text-sm",
            state.formError === "unavailable" || state.formError === "failed"
              ? "bg-surface-2 text-foreground"
              : "text-danger",
          )}
        >
          <p className="font-medium">{err(state.formError)}</p>
          {(state.formError === "unavailable" || state.formError === "failed") && (
            <Button as="a" href={mailto} size="md" className="mt-4">
              {f.emailInstead}
            </Button>
          )}
        </div>
      )}

      {/* A block, not a flex column: a stretched flex child would widen the
          pill to the whole form. */}
      <div>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? f.submitting : f.submit}
        </Button>
        <p className="mt-5 max-w-lg text-2xs leading-5 text-muted">
          {f.promise}{" "}
          <Link href={privacyHref} className="text-accent hover:underline hover:underline-offset-4">
            {f.privacy}
          </Link>
        </p>
      </div>
    </form>
  );
}
