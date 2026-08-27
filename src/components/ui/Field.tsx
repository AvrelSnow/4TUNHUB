import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Form primitives — label + control + error, correctly wired for
 * accessibility (htmlFor/id, aria-invalid, aria-describedby).
 * Server-side validation remains the gate (security contract §2);
 * these are the presentation layer.
 */

const controlBase =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-ink-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-red-600";

type CommonProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function InputField({
  label,
  error,
  hint,
  className,
  ...props
}: CommonProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={controlBase}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className,
  placeholder,
  children,
  ...props
}: CommonProps & { placeholder?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlBase, "cursor-pointer")}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextareaField({
  label,
  error,
  hint,
  className,
  ...props
}: CommonProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlBase, "resize-y")}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
