import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col justify-center py-28 sm:py-36">
      <Container size="narrow" className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-display text-foreground">This page isn&apos;t here.</h1>
        <p className="mx-auto mt-6 max-w-md text-lead text-muted">
          It doesn&apos;t exist, or it has moved. Start again from the home page, or tell us
          which link brought you here.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Button as="a" href="/" size="lg">
            Back to home
          </Button>
          <ArrowLink href="/contact">Report a broken link</ArrowLink>
        </div>
      </Container>
    </section>
  );
}
