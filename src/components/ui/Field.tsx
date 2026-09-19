import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Form primitives — label + control + error, correctly wired for
 * accessibility (htmlFor/id, aria-invalid, aria-describedby).
 * Server-side validation remains the gate (security contract §2);
 * these are the presentation layer.
 */

const controlBase =
  "w-full rounded-xl border border-hairline bg-surface-2 px-4 py-3.5 text-base text-foreground placeholder:text-muted transition-[border-color,box-shadow] duration-200 hover:border-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-danger";

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
    <div className={cn("flex flex-col gap-2", className)}>
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
        <p id={`${id}-hint`} className="text-2xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-2xs font-medium text-danger">
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
    <div className={cn("flex flex-col gap-2", className)}>
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
        <p id={`${id}-hint`} className="text-2xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-2xs font-medium text-danger">
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
    <div className={cn("flex flex-col gap-2", className)}>
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
        <p id={`${id}-hint`} className="text-2xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-2xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
