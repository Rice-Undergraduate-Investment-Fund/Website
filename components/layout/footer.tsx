import Image from "next/image";
import Link from "next/link";
import { primaryNav } from "@/lib/navigation";
import { Container } from "@/components/ui/layout";

/** Links Rice requires on university-affiliated sites. */
const RICE_LINKS = [
  { label: "Privacy Policy", href: "https://privacy.rice.edu/" },
  { label: "Web Accessibility", href: "https://access.rice.edu/" },
];

export function Footer({ orgName }: { orgName: string }) {
  const links = primaryNav.flatMap((i) => i.children ?? [i]);
  return (
    <footer className="mt-auto bg-rice-blue-deep text-white">
      <Container className="grid gap-12 py-16 sm:py-20 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-full-white.png"
              alt="Rice Finance"
              width={900}
              height={439}
              className="h-auto w-56 sm:w-64"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/80">
            Rice University&apos;s student-run investment fund, established in 2017.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {orgName} ·{" "}
            <a href="https://www.rice.edu/" className="underline-offset-4 hover:text-white hover:underline">
              Rice University
            </a>
            , 6100 Main St, Houston, TX 77005
          </p>
          <ul className="flex gap-5">
            {RICE_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="underline-offset-4 hover:text-white hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
