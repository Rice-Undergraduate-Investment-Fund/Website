"use client";

import { useId, useState } from "react";
import type { AlumniFirmGroup } from "@/lib/content/types";
import { cx } from "@/components/ui/layout";

/**
 * "Where RUIF members go": one tab per industry; inside a tab, firms appear as
 * wordmarks in unlabeled rows by tier (e.g. bulge brackets, then elite
 * boutiques, then middle market), each row A–Z.
 */
export function AlumniFirms({ groups }: { groups: AlumniFirmGroup[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  if (!groups.length) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : groups.length - 1)) % groups.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Industries" onKeyDown={onKey} className="flex min-w-max gap-8 border-b border-line">
          {groups.map((g, i) => (
            <button
              key={g.key}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cx(
                "-mb-px border-b-2 pb-4 text-xs font-semibold tracking-[0.2em] uppercase transition-colors",
                i === active ? "border-rice-blue text-rice-blue" : "border-transparent text-muted hover:text-rice-blue",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {groups.map((g, i) => (
        <div
          key={g.key}
          id={`${id}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          className="mt-10"
        >
          <Tiers tiers={g.tiers} />
        </div>
      ))}
    </div>
  );
}

/**
 * Firm names as wordmarks, centered. Rows (tiers) are split by hairlines and step down
 * slightly in size, so the hierarchy reads without labels.
 */
function Tiers({ tiers }: { tiers: string[][] }) {
  return (
    <div className="divide-y divide-line">
      {tiers.map((row, r) => (
        <ul key={r} className="flex flex-wrap justify-center gap-x-10 gap-y-4 py-8 first:pt-4 sm:gap-x-16 sm:gap-y-5">
          {row.map((name) => (
            <li
              key={name}
              className={cx(
                "font-serif whitespace-nowrap",
                r === 0
                  ? "text-xl text-rice-blue sm:text-[1.7rem]"
                  : r === 1
                    ? "text-lg text-rice-blue sm:text-2xl"
                    : "text-lg text-slate sm:text-xl",
              )}
            >
              {name}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
