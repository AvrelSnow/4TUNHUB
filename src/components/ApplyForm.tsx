"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { InputField, SelectField, TextareaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitApplication } from "@/lib/apply-action";
import { APPLY_LIMITS, SW_VERSIONS, initialApplyState } from "@/lib/cohort";
import { ANALYTICS_EVENTS, useTrackOnce } from "@/lib/track";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type CohortCopy = Dictionary["cohort"];

/**
 * Cohort 0 application. The server action is the gate; this is the
 * presentation. If the host has no mail provider yet, the server says so
 * ("unavailable") and the visitor gets a ready-written email instead, so an
 * application can never vanish silently.
 */
export function ApplyForm({ t, privacyHref }: { t: CohortCopy; privacyHref: string }) {
  const [state, formAction, pending] = useActionState(submitApplication, initialApplyState);
  // Counted, never identified: the event carries no field of the form.
  useTrackOnce(state.status === "success", ANALYTICS_EVENTS.application);
  const f = t.form;
  const err = (code?: string) => (code ? f.errors[code] : undefined);
  const v = state.values ?? {};
  const consentId = useId();

  // Pre-addressed, pre-titled: the two screenshots arrive in one thread we
  // can match to the application by name.
  const proofMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "[Cohort 0] Screenshots",
  )}`;

  if (state.status === "success") {
    return (
      <div role="status" className="py-10 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success text-white"
        >
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5 8 14l7.5-8" />
          </svg>
        </span>
        <h3 className="mt-6 text-display-sm text-foreground">{t.success.title}</h3>
        <p className="mx-auto mt-3 max-w-md text-muted">{t.success.body}</p>

        {/* An application with no proof of membership cannot be selected,
            so the confirmation is where we ask for it — while they are
            still at the screen, not in an email they may not open. */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-surface-2 p-6 text-left">
          <p className="text-sm leading-6 text-foreground">{t.success.next}</p>
          <Button as="a" href={proofMailto} size="md" className="mt-5">
            {t.success.nextCta}
          </Button>
        </div>
      </div>
    );
  }

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `[Cohort 0] ${v.name ?? ""}`,
  )}&body=${encodeURIComponent(
    [
      `${f.name.label}: ${v.name ?? ""}`,
      `${f.email.label}: ${v.email ?? ""}`,
      `${f.whatsapp.label}: ${v.whatsapp ?? ""}`,
      `${f.linkedin.label}: ${v.linkedin ?? ""}`,
      `${f.org.label}: ${v.org ?? ""}`,
      `${f.sw.label}: ${v.sw ? f.sw.options[v.sw] ?? v.sw : ""}`,
      "",
      `${f.why.label}`,
      v.why ?? "",
    ].join("\n"),
  )}`;

  const consentError = err(state.fieldErrors?.consent);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          label={f.name.label}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={APPLY_LIMITS.nameMax}
          placeholder={f.name.placeholder}
          defaultValue={v.name}
          error={err(state.fieldErrors?.name)}
          required
        />
        <InputField
          label={f.email.label}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={APPLY_LIMITS.emailMax}
          placeholder={f.email.placeholder}
          defaultValue={v.email}
          error={err(state.fieldErrors?.email)}
          required
        />
        <InputField
          label={f.whatsapp.label}
          name="whatsapp"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={APPLY_LIMITS.whatsappMax}
          placeholder={f.whatsapp.placeholder}
          hint={f.whatsapp.hint}
          defaultValue={v.whatsapp}
          error={err(state.fieldErrors?.whatsapp)}
          required
        />
        <InputField
          label={f.linkedin.label}
          name="linkedin"
          type="url"
          inputMode="url"
          autoComplete="url"
          maxLength={APPLY_LIMITS.linkedinMax}
          placeholder={f.linkedin.placeholder}
          hint={f.linkedin.hint}
          defaultValue={v.linkedin}
          error={err(state.fieldErrors?.linkedin)}
          required
        />
        <InputField
          label={f.org.label}
          name="org"
          type="text"
          autoComplete="organization"
          maxLength={APPLY_LIMITS.orgMax}
          placeholder={f.org.placeholder}
          defaultValue={v.org}
          error={err(state.fieldErrors?.org)}
          required
        />
      </div>

      <SelectField
        label={f.sw.label}
        name="sw"
        placeholder={f.sw.placeholder}
        defaultValue={v.sw ?? ""}
        error={err(state.fieldErrors?.sw)}
        required
      >
        {SW_VERSIONS.map((value) => (
          <option key={value} value={value}>
            {f.sw.options[value]}
          </option>
        ))}
      </SelectField>

      <TextareaField
        label={f.why.label}
        name="why"
        rows={5}
        maxLength={APPLY_LIMITS.whyMax}
        placeholder={f.why.placeholder}
        hint={f.why.hint}
        defaultValue={v.why}
        error={err(state.fieldErrors?.why)}
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor={consentId} className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            id={consentId}
            type="checkbox"
            name="consent"
            value="yes"
            required
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? `${consentId}-error` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[var(--color-primary)]"
          />
          <span>
            {f.consent}{" "}
            <Link href={privacyHref} className="text-accent hover:underline hover:underline-offset-4">
              {f.privacy}
            </Link>
          </span>
        </label>
        {consentError && (
          <p id={`${consentId}-error`} className="text-2xs font-medium text-danger">
            {consentError}
          </p>
        )}
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

      <div>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? f.submitting : f.submit}
        </Button>
      </div>
    </form>
  );
}
