"use client";

import { useActionState, useState } from "react";
import { InputField, SelectField, TextareaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/contact-action";
import { initialContactState, TOPIC_VALUES } from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type ContactCopy = Dictionary["contact"];

export function ContactForm({ t }: { t: ContactCopy }) {
  // Remounting on reset clears useActionState back to idle.
  const [resetKey, setResetKey] = useState(0);
  return (
    <ContactFormFields
      key={resetKey}
      t={t}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}

function ContactFormFields({ t, onReset }: { t: ContactCopy; onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const f = t.form;
  const err = (code?: string) => (code ? f.errors[code] : undefined);

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
        <button
          type="button"
          onClick={onReset}
          className="mt-6 font-medium text-accent hover:underline hover:underline-offset-4"
        >
          {t.success.again}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <h2 className="text-headline text-foreground">{f.heading}</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          label={f.name.label}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          placeholder={f.name.placeholder}
          defaultValue={state.values?.name}
          error={err(state.fieldErrors?.name)}
          required
        />
        <InputField
          label={f.email.label}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={200}
          placeholder={f.email.placeholder}
          defaultValue={state.values?.email}
          error={err(state.fieldErrors?.email)}
          required
        />
      </div>

      <SelectField
        label={f.topic.label}
        name="topic"
        placeholder={f.topic.placeholder}
        defaultValue={state.values?.topic ?? ""}
        error={err(state.fieldErrors?.topic)}
        required
      >
        {TOPIC_VALUES.map((value) => (
          <option key={value} value={value}>
            {f.topic.options[value]}
          </option>
        ))}
      </SelectField>

      <TextareaField
        label={f.message.label}
        name="message"
        rows={6}
        maxLength={3000}
        placeholder={f.message.placeholder}
        hint={f.message.hint}
        defaultValue={state.values?.message}
        error={err(state.fieldErrors?.message)}
        required
      />

      {/* Honeypot — off-screen, ignored by real users, filled by naive bots. */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.formError &&
        (state.formError === "unavailable" || state.formError === "failed" ? (
          // Delivery failed: hand the visitor a ready-written email so the
          // message can't be lost.
          <div role="alert" className="rounded-2xl bg-surface-2 p-5 text-sm text-foreground">
            <p className="font-medium">{err(state.formError)}</p>
            <Button
              as="a"
              size="md"
              className="mt-4"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                `[4TUN Hub] ${state.values?.topic ?? ""}: ${state.values?.name ?? ""}`,
              )}&body=${encodeURIComponent(state.values?.message ?? "")}`}
            >
              {f.emailInstead}
            </Button>
          </div>
        ) : (
          <p role="alert" className="text-sm font-medium text-danger">
            {err(state.formError)}
          </p>
        ))}

      <div>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? f.submitting : f.submit}
        </Button>
      </div>
    </form>
  );
}
