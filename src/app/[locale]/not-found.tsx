import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-start justify-center py-28">
      <p className="eyebrow">404 · Not found</p>
      <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        This drawing isn&apos;t in the archive.
      </h1>
      <p className="mt-4 max-w-md text-lg leading-8 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. The
        ecosystem map below will get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button as="a" href="/" size="lg">
          Back to home
        </Button>
        <Link
          href="/contact"
          className="link-sweep inline-flex h-13 items-center text-base font-medium text-muted hover:text-foreground"
        >
          Report a broken link
        </Link>
      </div>
    </Container>
  );
}
