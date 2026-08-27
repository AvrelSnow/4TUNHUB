/** Tiny className joiner — filters falsy values. Keeps components dependency-free. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
