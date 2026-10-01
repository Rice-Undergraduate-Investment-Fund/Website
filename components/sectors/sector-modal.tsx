"use client";

import { useEffect, useRef } from "react";
import type { SectorWithPeople } from "@/lib/content";
import { PersonPhoto } from "@/components/people/person";

/**
 * Sector modal (spec §6.2).
 *
 * Hierarchy: sector name → Sector Director (large square photo) → members in
 * rows of three. The director photo and the member grid share one column, so
 * the director is exactly as wide as three member photos plus their gaps.
 *
 * Built on the native <dialog> element: focus trapping, Escape to close and
 * the backdrop come from the browser.
 */
export function SectorModal({
  sector,
  onClose,
  onPrev,
  onNext,
}: {
  sector: SectorWithPeople | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (sector && !d.open) d.showModal();
    if (!sector && d.open) d.close();
  }, [sector]);

  // Moving between sectors starts at the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [sector?.slug]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="sector-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // backdrop click
      }}
      className="m-auto h-dvh max-h-dvh w-full max-w-none bg-transparent p-0 open:animate-[modal-in_240ms_var(--ease-out-soft)] sm:h-auto sm:max-h-[min(92dvh,1000px)] sm:w-[calc(100%-3rem)] sm:max-w-2xl"
    >
      {sector && (
        <div className="flex h-full max-h-[inherit] flex-col bg-white shadow-2xl shadow-rice-blue-deep/40">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate uppercase">Sector</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 flex size-10 items-center justify-center text-rice-blue transition-colors hover:bg-mist"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto max-w-lg px-5 pt-8 pb-12 sm:px-0 sm:pt-10">
              <h2
                id="sector-modal-title"
                className="text-center text-3xl leading-tight text-rice-blue sm:text-4xl"
              >
                {sector.name}
              </h2>

              {/* Director */}
              {sector.director && (
                <figure className="mt-8">
                  <PersonPhoto
                    person={sector.director}
                    sizes="(min-width: 640px) 512px, 100vw"
                    large
                  />
                  <figcaption className="mt-4 text-center">
                    <p className="font-serif text-2xl text-ink">{sector.director.name}</p>
                    <p className="mt-1 text-sm text-muted">Sector Director</p>
                  </figcaption>
                </figure>
              )}

              {/* Members */}
              {sector.members.length > 0 && (
                <section className="mt-12" aria-label={`${sector.name} members`}>
                  <div className="flex items-center gap-4">
                    <span className="h-px flex-1 bg-line" />
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate uppercase">
                      Members · {sector.members.length}
                    </p>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 min-[360px]:grid-cols-3 sm:gap-x-4 sm:gap-y-7">
                    {sector.members.map((m) => (
                      <li key={m.id}>
                        <PersonPhoto person={m} sizes="(min-width: 640px) 160px, 33vw" />
                        <p className="mt-2.5 text-center text-sm leading-snug font-medium text-ink">
                          {m.name}
                        </p>
                        {m.sectorRole && (
                          <p className="mt-0.5 text-center text-xs leading-snug text-muted">{m.sectorRole}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* Prev / next */}
          <div className="grid grid-cols-2 border-t border-line text-sm font-semibold text-rice-blue">
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev}
              className="flex h-14 items-center gap-2 px-5 transition-colors hover:bg-mist disabled:pointer-events-none disabled:opacity-30 sm:px-8"
            >
              <span aria-hidden>←</span> Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!onNext}
              className="flex h-14 items-center justify-end gap-2 border-l border-line px-5 transition-colors hover:bg-mist disabled:pointer-events-none disabled:opacity-30 sm:px-8"
            >
              Next <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
