"use client";

import { useEffect, useRef, useState } from "react";
import type { Person } from "@/lib/content/types";
import { PersonPhoto } from "@/components/people/person";

/**
 * Executive Board: portrait cards; clicking one opens a profile panel
 * (photo, role, bio, LinkedIn, email) with previous/next to browse the board.
 * Uses the same native <dialog> pattern as the sector modal.
 */
export function BoardGrid({ people }: { people: Person[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const person = index == null ? null : people[index];
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (person && !d.open) d.showModal();
    if (!person && d.open) d.close();
  }, [person]);

  const close = () => setIndex(null);
  const go = (step: number) => setIndex((i) => (i == null ? i : (i + step + people.length) % people.length));

  return (
    <>
      <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5">
        {people.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-haspopup="dialog"
              className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rice-blue"
            >
              <div className="relative overflow-hidden">
                <PersonPhoto
                  person={p}
                  portrait
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                  className="transition-transform duration-500 ease-out-soft group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-rice-blue/90 px-4 py-2.5 text-xs font-semibold tracking-wide text-white transition-transform duration-300 ease-out-soft group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  View profile <span aria-hidden>→</span>
                </span>
              </div>
              <p className="mt-4 font-serif text-lg leading-snug text-ink group-hover:text-rice-blue">{p.name}</p>
              {p.boardPosition && <p className="mt-1 text-sm leading-snug text-muted">{p.boardPosition}</p>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-labelledby="board-profile-name"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="m-auto h-dvh max-h-dvh w-full max-w-none bg-transparent p-0 open:animate-[modal-in_240ms_var(--ease-out-soft)] sm:h-auto sm:max-h-[min(92dvh,760px)] sm:w-[calc(100%-3rem)] sm:max-w-4xl"
      >
        {person && (
          <div className="flex h-full max-h-[inherit] flex-col bg-white shadow-2xl shadow-rice-blue-deep/40">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain sm:flex-row sm:overflow-hidden">
              {/* Photo */}
              <div className="relative shrink-0 sm:w-[42%]">
                <PersonPhoto person={person} portrait large sizes="(min-width: 640px) 360px, 100vw" className="sm:h-full" />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-3 right-3 flex size-10 items-center justify-center bg-white/90 text-rice-blue transition-colors hover:bg-white sm:hidden"
                >
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>

              {/* Profile */}
              <div className="flex flex-1 flex-col sm:overflow-y-auto">
                <div className="hidden justify-end px-4 pt-3 sm:flex">
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="flex size-10 items-center justify-center text-rice-blue transition-colors hover:bg-mist"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 pt-7 pb-10 sm:px-10 sm:pt-2">
                  {person.boardPosition && (
                    <p className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">{person.boardPosition}</p>
                  )}
                  <h2 id="board-profile-name" className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">
                    {person.name}
                  </h2>
                  <span aria-hidden className="mt-6 block h-px w-12 bg-rice-blue" />
                  {person.bio && <p className="mt-6 leading-relaxed text-slate text-pretty">{person.bio}</p>}
                  {(person.linkedin || person.email) && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {person.linkedin && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 items-center gap-2 bg-rice-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-rich-blue"
                        >
                          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.3 21 14.7V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {person.email && (
                        <a
                          href={`mailto:${person.email}`}
                          className="inline-flex h-11 items-center gap-2 border border-rice-blue px-5 text-sm font-semibold text-rice-blue transition-colors hover:bg-rice-blue hover:text-white"
                        >
                          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                            <rect x="3" y="5" width="18" height="14" />
                            <path d="M3 6l9 7 9-7" />
                          </svg>
                          {person.email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Prev / next */}
            {people.length > 1 && (
              <div className="grid grid-cols-2 border-t border-line text-sm font-semibold text-rice-blue">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="flex h-14 items-center gap-2 px-5 transition-colors hover:bg-mist sm:px-8"
                >
                  <span aria-hidden>←</span> {people[(index! - 1 + people.length) % people.length].name}
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="flex h-14 items-center justify-end gap-2 border-l border-line px-5 transition-colors hover:bg-mist sm:px-8"
                >
                  {people[(index! + 1) % people.length].name} <span aria-hidden>→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
