"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Global error boundary — brand voice, zero internals leaked
 * (security contract §6). The digest is safe to show: it's an
 * opaque reference for server logs, not a stack trace.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex flex-1 flex-col items-start justify-center py-28">
      <p className="eyebrow">Error · Something failed</p>
      <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        A component didn&apos;t hold.
      </h1>
      <p className="mt-4 max-w-md text-lg leading-8 text-muted">
        Something went wrong on our side — not yours. Try again; if it
        persists, tell us and we&apos;ll fix it.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-muted">ref: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button as="a" href="/" size="lg" variant="secondary">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
