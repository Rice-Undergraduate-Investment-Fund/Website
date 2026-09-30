import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">404</p>
      <h1 className="mt-4 text-4xl text-rice-blue sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-slate">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
