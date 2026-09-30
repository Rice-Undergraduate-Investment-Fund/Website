"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/lib/navigation";
import { Container, cx } from "@/components/ui/layout";

export function Header({ showApply, applyHref }: { showApply: boolean; applyHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href.split("/").slice(0, 2).join("/")));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <Container className="flex h-18 items-center justify-between gap-6 sm:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Rice Finance home">
          <Image src="/images/logo.png" alt="" width={44} height={44} priority className="size-10 sm:size-11" />
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold text-rice-blue sm:text-xl">
              Rice Finance
            </span>
            <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-slate uppercase">
              <span className="sm:hidden">RUIF</span>
              <span className="hidden sm:inline">Undergraduate Investment Fund</span>
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className={cx(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-rice-blue",
                    isActive(item.href) ? "text-rice-blue" : "text-ink/80",
                  )}
                >
                  {item.label}
                  <svg aria-hidden viewBox="0 0 12 12" className="size-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
                <div className="invisible absolute top-full left-1/2 w-48 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="border border-line bg-white py-2 shadow-lg shadow-rice-blue/5">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={cx(
                            "block px-4 py-2.5 text-sm transition-colors hover:bg-mist hover:text-rice-blue",
                            pathname === c.href ? "text-rice-blue" : "text-ink/80",
                          )}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cx(
                  "relative px-3 py-2 text-sm font-medium transition-colors hover:text-rice-blue",
                  isActive(item.href)
                    ? "text-rice-blue after:absolute after:inset-x-3 after:-bottom-[1.3rem] after:h-0.5 after:bg-rice-blue"
                    : "text-ink/80",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
          {showApply && (
            <Link
              href={applyHref}
              className="ml-3 inline-flex h-10 items-center bg-rice-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-rich-blue"
            >
              Apply
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 flex size-11 items-center justify-center text-rice-blue lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => {
            setOpenedAt(pathname);
            setOpen((o) => !o);
          }}
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" />
            )}
          </svg>
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-18 bottom-0 overflow-y-auto border-t border-line bg-white sm:top-20 lg:hidden"
      >
        <Container className="flex min-h-full flex-col py-6">
          <nav aria-label="Mobile" className="flex-1">
            <ul className="divide-y divide-line">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div className="py-4">
                      <p className="text-xs font-semibold tracking-[0.2em] text-slate uppercase">{item.label}</p>
                      <ul className="mt-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block py-2 font-serif text-2xl text-rice-blue">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link href={item.href} className="block py-4 font-serif text-2xl text-rice-blue">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {showApply && (
            <Link
              href={applyHref}
              className="mt-6 flex h-14 items-center justify-center bg-rice-blue text-base font-semibold text-white"
            >
              Apply to the Training Program
            </Link>
          )}
        </Container>
      </div>
    </header>
  );
}
