import Image from "next/image";
import Link from "next/link";
import { primaryNav } from "@/lib/navigation";
import { Container } from "@/components/ui/layout";

export function Footer({ orgName }: { orgName: string }) {
  const links = primaryNav.flatMap((i) => i.children ?? [i]);
  return (
    <footer className="mt-auto bg-rice-blue-deep text-white">
      <Container className="grid gap-12 py-16 sm:py-20 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-4">
            <span className="flex size-14 items-center justify-center bg-white">
              <Image src="/images/logo.png" alt="" width={48} height={48} className="size-12" />
            </span>
            <span>
              <span className="block font-serif text-2xl">Rice Finance</span>
              <span className="block text-xs tracking-[0.18em] text-white/70 uppercase">{orgName}</span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
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
        <Container className="flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {orgName}</p>
          <p>Rice University · Houston, Texas</p>
        </Container>
      </div>
    </footer>
  );
}
