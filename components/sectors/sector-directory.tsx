"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SectorWithPeople } from "@/lib/content";
import { Arrow } from "@/components/ui/button";
import { SectorModal } from "./sector-modal";

/**
 * Sector grid + modal. The open sector is mirrored in the URL hash
 * (/sectors#technology) so a specific sector can be linked to directly.
 */
export function SectorDirectory({ sectors }: { sectors: SectorWithPeople[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((slug: string, trigger?: HTMLButtonElement | null) => {
    if (trigger) lastTrigger.current = trigger;
    setActiveSlug(slug);
    history.replaceState(null, "", `#${slug}`);
  }, []);

  const close = useCallback(() => {
    setActiveSlug(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    lastTrigger.current?.focus();
  }, []);

  // Open from a shared link (#slug) on first load and on back/forward.
  useEffect(() => {
    const sync = () => {
      const slug = window.location.hash.slice(1);
      setActiveSlug(sectors.some((s) => s.slug === slug) ? slug : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sectors]);

  const index = sectors.findIndex((s) => s.slug === activeSlug);
  const active = index >= 0 ? sectors[index] : null;

  return (
    <>
      <ul className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s, i) => (
          <li key={s.slug} className="border-r border-b border-line bg-white">
            <button
              type="button"
              onClick={(e) => open(s.slug, e.currentTarget)}
              aria-haspopup="dialog"
              className="group flex h-full min-h-44 w-full flex-col items-start p-7 text-left transition-colors duration-300 ease-out-soft hover:bg-rice-blue focus-visible:bg-rice-blue sm:min-h-52 sm:p-9"
            >
              <span className="font-serif text-sm text-rice-gray tabular-nums transition-colors group-hover:text-white/60 group-focus-visible:text-white/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 font-serif text-2xl leading-snug text-rice-blue transition-colors group-hover:text-white group-focus-visible:text-white sm:text-[1.7rem]">
                {s.name}
              </span>
              <span className="mt-auto flex w-full items-center justify-between pt-8 text-sm text-slate transition-colors group-hover:text-white/80 group-focus-visible:text-white/80">
                <span>
                  {s.members.length + (s.director ? 1 : 0)} members
                </span>
                <span className="flex items-center gap-2 font-semibold text-rice-blue transition-colors group-hover:text-white group-focus-visible:text-white">
                  View team <Arrow className="group-hover:translate-x-1" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <SectorModal
        sector={active}
        onClose={close}
        onPrev={index > 0 ? () => open(sectors[index - 1].slug) : undefined}
        onNext={index >= 0 && index < sectors.length - 1 ? () => open(sectors[index + 1].slug) : undefined}
      />
    </>
  );
}
