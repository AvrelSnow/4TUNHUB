"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Global error boundary: plain words, zero internals leaked (security
 * contract §6). The digest is safe to show: an opaque reference for
 * server logs, not a stack trace.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center py-28 sm:py-36">
      <Container size="narrow" className="text-center">
        <p className="eyebrow">Error</p>
        <h1 className="mt-3 text-display text-foreground">Something went wrong.</h1>
        <p className="mx-auto mt-6 max-w-md text-lead text-muted">
          The fault is on our side, not yours. Try again; if it keeps happening, tell us and
          we&apos;ll fix it.
        </p>
        {error.digest && <p className="mt-4 text-2xs text-muted">Reference: {error.digest}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Button as="a" href="/" size="lg" variant="secondary">
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  );
}
