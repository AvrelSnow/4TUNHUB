"use client";

import { useActionState, useState } from "react";
import { InputField, SelectField, TextareaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/contact-action";
import { initialContactState, TOPIC_VALUES } from "@/lib/contact";
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
      <div
        role="status"
        className="rounded-2xl border border-brand-500/40 bg-brand-500/15 p-8"
      >
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-xl font-bold text-ink-900"
        >
          ✓
        </span>
        <h3 className="mt-5 text-xl font-semibold text-foreground">{t.success.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">{t.success.body}</p>
        <button
          type="button"
          onClick={onReset}
          className="link-sweep mt-5 w-fit text-sm font-medium text-accent"
        >
          {t.success.again}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-foreground">{f.heading}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
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

      {state.formError && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {err(state.formError)}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? f.submitting : f.submit}
        </Button>
      </div>
    </form>
  );
}
