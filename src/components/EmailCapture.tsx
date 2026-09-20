"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { Button } from "@/components/ui/Button";
import { submitWaitlist } from "@/lib/waitlist-action";
import { initialWaitlistState, WAITLIST_LIMITS, type TrackValue } from "@/lib/waitlist";
import { ANALYTICS_EVENTS, useTrackOnce } from "@/lib/track";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * One field, one track, one promise — the waitlist where the reader
 * already is.
 *
 * It posts to the same server action as the full form on /waitlist, so
 * there is no second list and no second pipeline; the difference is that
 * the track isn't chosen from four checkboxes, it is fixed by the page
 * and *named in the copy above the field*. That is what keeps the
 * consent honest: nobody can end up subscribed to something the block
 * they typed into didn't say out loud.
 */
export function EmailCapture({
  t,
  track,
  privacyHref,
  moreHref,
  tone = "band",
  className,
}: {
  t: Dictionary["waitlist"];
  /** What this block subscribes the visitor to. The copy must say it. */
  track: TrackValue;
  privacyHref: string;
  /** /waitlist, for someone who wants the other tracks too. */
  moreHref?: string;
  /** `footer` is the small type on the grey band. */
  tone?: "band" | "footer";
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(submitWaitlist, initialWaitlistState);
  const done = state.status === "success";
  useTrackOnce(done, ANALYTICS_EVENTS.waitlist, { track, form: tone });

  const f = t.inline;
  const id = useId();
  const footer = tone === "footer";
  const fieldError = state.fieldErrors?.email ? t.form.errors[state.fieldErrors.email] : undefined;
  const formError = state.formError ? t.form.errors[state.formError] : undefined;
  const lost = state.formError === "unavailable" || state.formError === "failed";

  if (done) {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-2.5 font-medium text-foreground",
          footer ? "text-sm" : "text-base",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5 8 14l7.5-8" />
          </svg>
        </span>
        {f.done}
      </p>
    );
  }

  return (
    <form action={formAction} noValidate className={cn("w-full", className)}>
      {/* The track is the consent. It is fixed here and stated in the copy
          this block renders under; it is never taken from the URL. */}
      <input type="hidden" name="tracks" value={track} />

      <label htmlFor={id} className="sr-only">
        {f.label}
      </label>
      <div className={cn("flex flex-col gap-3 sm:flex-row", footer ? "sm:max-w-md" : "sm:max-w-xl")}>
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={WAITLIST_LIMITS.emailMax}
          placeholder={f.placeholder}
          defaultValue={state.values?.email}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError || formError ? `${id}-error` : undefined}
          className={cn(
            "w-full min-w-0 flex-1 rounded-full border border-hairline bg-surface-2 px-5 text-foreground placeholder:text-muted",
            "transition-[border-color,box-shadow] duration-200 hover:border-subtle",
            "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15",
            "aria-[invalid=true]:border-danger",
            footer ? "h-11 text-sm" : "h-12 text-base",
          )}
        />
        <Button type="submit" size={footer ? "md" : "lg"} disabled={pending} className="shrink-0">
          {pending ? f.submitting : f.submit}
        </Button>
      </div>

      {/* Honeypot — off-screen, ignored by real users, filled by naive bots. */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {(fieldError || formError) && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-2xs font-medium text-danger">
          {fieldError ?? formError}{" "}
          {lost && (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[Waitlist] Sign me up")}`}
              className="font-medium text-accent hover:underline hover:underline-offset-4"
            >
              {t.form.emailInstead}
            </a>
          )}
        </p>
      )}

      <p className={cn("text-2xs leading-5 text-muted", footer ? "mt-3" : "mt-4")}>
        {f.promise}{" "}
        <Link href={privacyHref} className="text-accent hover:underline hover:underline-offset-4">
          {f.privacy}
        </Link>
        {moreHref && (
          <>
            {" · "}
            <Link href={moreHref} className="text-accent hover:underline hover:underline-offset-4">
              {f.more}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
