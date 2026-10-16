"use client";

import { useId, useState, type CSSProperties } from "react";
import type { AlumniFirmGroup } from "@/lib/content/types";
import { cx } from "@/components/ui/layout";

/**
 * "Where RUIF members go": one tab per industry; inside a tab, firms appear as
 * logos (or names, where no logo is on file) in unlabeled rows by tier (e.g. bulge brackets, then elite
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
          <Tiers tiers={g.tiers} logos={g.logos} />
        </div>
      ))}
    </div>
  );
}

/**
 * Firm logos, centered and optically matched in size (wide wordmarks get less
 * height than square marks). Rows (tiers) are split by hairlines, so the
 * hierarchy reads without labels. Firms without a logo show their name.
 */
function Tiers({ tiers, logos }: { tiers: string[][]; logos: AlumniFirmGroup["logos"] }) {
  return (
    <div className="divide-y divide-line">
      {tiers.map((row, r) => (
        <ul
          key={r}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 py-10 first:pt-6 sm:gap-x-14 sm:gap-y-10"
        >
          {row.map((name) => {
            const logo = logos[name];
            if (!logo) {
              return (
                <li key={name} className="font-serif text-lg whitespace-nowrap text-rice-blue sm:text-2xl">
                  {name}
                </li>
              );
            }
            // Same visual area for every logo, within sensible bounds.
            const h = Math.min(44, Math.max(21, Math.sqrt(3800 / logo.aspect)));
            return (
              <li key={name} className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- small static logos, no optimisation needed */}
                <img
                  src={logo.src}
                  alt={name}
                  loading="lazy"
                  style={{ "--h": `${h.toFixed(1)}px`, aspectRatio: logo.aspect } as CSSProperties}
                  className="h-[calc(var(--h)*0.78)] w-auto max-w-[10rem] object-contain sm:h-[var(--h)] sm:max-w-[13rem]"
                />
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
