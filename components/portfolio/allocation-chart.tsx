"use client";

import { useEffect, useRef, useState } from "react";
import type { Allocation, Holding } from "@/lib/content/types";
import { cx } from "@/components/ui/layout";

const key = (s: string) => s.trim().toLowerCase();
const pct = (n: number) => `${Number.isInteger(n * 10) ? n.toFixed(1) : n}%`;

/**
 * Portfolio allocation: single-series horizontal bar chart.
 * One hue (Rice Blue), sorted by weight, every bar direct-labeled so no legend
 * is needed. Each sector with holdings is a button that opens a pop-up listing
 * them (Cash has none, so it stays a plain row).
 */
export function AllocationChart({
  allocations,
  holdingsBySector,
}: {
  allocations: Allocation[];
  holdingsBySector: { sector: string; holdings: Holding[] }[];
}) {
  const rows = [...allocations].sort((a, b) => b.percent - a.percent);
  const max = Math.max(...rows.map((r) => r.percent), 1);
  const total = rows.reduce((t, r) => t + r.percent, 0);
  const holdings = new Map(holdingsBySector.map((g) => [key(g.sector), g.holdings]));
  const [open, setOpen] = useState<Allocation | null>(null);

  return (
    <figure>
      <ul className="space-y-1" aria-label="Portfolio allocation by sector">
        {rows.map((r) => {
          const list = holdings.get(key(r.sector)) ?? [];
          const inner = (
            <>
              <span className="truncate text-left text-sm text-ink">{r.sector}</span>
              <span className="relative h-3" aria-hidden>
                <span className="absolute inset-y-0 left-0 w-full bg-mist group-hover:bg-white" />
                <span
                  className="absolute inset-y-0 left-0 rounded-r-[4px] bg-rice-blue transition-colors group-hover:bg-rich-blue"
                  style={{ width: `${(r.percent / max) * 100}%` }}
                />
              </span>
              <span className="text-right text-sm font-semibold text-ink tabular-nums">{pct(r.percent)}</span>
              <span className="flex justify-end text-rice-blue" aria-hidden>
                {list.length > 0 && (
                  <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                )}
              </span>
            </>
          );
          const row =
            "group grid w-full grid-cols-[minmax(0,8rem)_1fr_3rem_1rem] items-center gap-3 rounded-sm px-2 py-2 sm:grid-cols-[minmax(0,15rem)_1fr_3.5rem_1rem] sm:gap-4";
          return (
            <li key={r.sector}>
              {list.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setOpen(r)}
                  className={cx(row, "cursor-pointer transition-colors hover:bg-mist")}
                >
                  {inner}
                  <span className="sr-only">: show {list.length} holdings</span>
                </button>
              ) : (
                <div className={row}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-4 px-2 text-xs text-slate">
        Share of portfolio by sector, including cash. Total {Math.round(total * 10) / 10}%. Select a sector to
        see its holdings.
      </figcaption>

      <HoldingsModal
        allocation={open}
        holdings={open ? (holdings.get(key(open.sector)) ?? []) : []}
        onClose={() => setOpen(null)}
      />
    </figure>
  );
}

function HoldingsModal({
  allocation,
  holdings,
  onClose,
}: {
  allocation: Allocation | null;
  holdings: Holding[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (allocation && !d.open) d.showModal();
    if (!allocation && d.open) d.close();
  }, [allocation]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="holdings-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // backdrop click
      }}
      className="m-auto max-h-[min(88dvh,760px)] w-[calc(100%-2rem)] max-w-lg bg-transparent p-0 open:animate-[modal-in_240ms_var(--ease-out-soft)]"
    >
      {allocation && (
        <div className="flex max-h-[inherit] flex-col bg-white shadow-2xl shadow-rice-blue-deep/40">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 pt-6 pb-5 sm:px-8">
            <div>
              <h2 id="holdings-modal-title" className="text-3xl leading-tight text-rice-blue">
                {allocation.sector}
              </h2>
              <p className="mt-1 text-sm text-slate">
                {pct(allocation.percent)} of the portfolio · {holdings.length}{" "}
                {holdings.length === 1 ? "holding" : "holdings"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-1 -mr-2 flex size-10 shrink-0 items-center justify-center text-rice-blue transition-colors hover:bg-mist"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6 sm:px-8">
            {holdings.map((h) => (
              <li key={h.id} className="flex items-baseline gap-4 py-3.5">
                <span className="w-14 shrink-0 text-sm font-bold text-rice-blue tabular-nums">{h.ticker}</span>
                <span className="text-ink">{h.company}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  );
}
