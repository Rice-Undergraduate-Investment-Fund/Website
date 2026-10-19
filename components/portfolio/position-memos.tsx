"use client";

import { useEffect, useRef, useState } from "react";
import type { Holding } from "@/lib/content/types";
import { LetterViewer } from "@/components/portfolio/letter-viewer";

/**
 * "Selected positions": a compact card per holding with an investment memo.
 * Clicking a card opens the memo (PDF) in a pop-up with the same page viewer
 * as the semester letter (flip pages, expand, download).
 */
export function PositionMemos({ holdings }: { holdings: Holding[] }) {
  const [open, setOpen] = useState<Holding | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {holdings.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => setOpen(h)}
              className="group flex aspect-square w-full flex-col border border-line bg-white p-5 text-left transition-colors hover:border-rice-blue hover:bg-rice-blue focus-visible:bg-rice-blue"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase transition-colors group-hover:text-white group-focus-visible:text-white">
                {h.ticker}
              </span>
              <span className="mt-2 font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-white group-focus-visible:text-white">
                {h.company}
              </span>
              {h.sector && (
                <span className="mt-1 text-xs text-slate transition-colors group-hover:text-white/80 group-focus-visible:text-white/80">
                  {h.sector}
                </span>
              )}
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-rice-blue transition-colors group-hover:text-white group-focus-visible:text-white">
                Read memo
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-labelledby="memo-modal-title"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null); // backdrop click
        }}
        className="m-auto max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-[min(42rem,calc((94dvh-12.5rem)*0.773))] bg-transparent p-0 open:animate-[modal-in_240ms_var(--ease-out-soft)]"
      >
        {open?.memo && (
          <div className="flex max-h-[inherit] flex-col bg-white shadow-2xl shadow-rice-blue-deep/40">
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 pt-5 pb-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">{open.ticker}</p>
                <h2 id="memo-modal-title" className="mt-1 text-2xl leading-tight text-rice-blue sm:text-3xl">
                  {open.company} investment memo
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="-mt-1 -mr-2 flex size-10 shrink-0 items-center justify-center text-rice-blue transition-colors hover:bg-mist"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain p-3 sm:p-5">
              <LetterViewer
                key={open.id}
                letter={{
                  id: open.id,
                  title: `${open.company} investment memo`,
                  semester: "",
                  url: open.memo.url,
                  filename: open.memo.filename,
                }}
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
