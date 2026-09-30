import type { Allocation } from "@/lib/content";

/**
 * Portfolio allocation: single-series horizontal bar chart.
 * One hue (Rice Blue), sorted by weight, every bar direct-labeled so no legend
 * is needed. The list markup doubles as the accessible table view.
 */
export function AllocationChart({ allocations }: { allocations: Allocation[] }) {
  const rows = [...allocations].sort((a, b) => b.percent - a.percent);
  const max = Math.max(...rows.map((r) => r.percent), 1);
  const total = rows.reduce((t, r) => t + r.percent, 0);

  return (
    <figure>
      <ul className="space-y-1" aria-label="Portfolio allocation by sector">
        {rows.map((r) => (
          <li
            key={r.sector}
            className="group grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-4 rounded-sm px-2 py-2 transition-colors hover:bg-mist sm:grid-cols-[minmax(0,15rem)_1fr_3.5rem]"
            title={`${r.sector}: ${r.percent}%`}
          >
            <span className="truncate text-sm text-ink">{r.sector}</span>
            <span className="relative h-3" aria-hidden>
              <span className="absolute inset-y-0 left-0 w-full bg-mist group-hover:bg-white" />
              <span
                className="absolute inset-y-0 left-0 rounded-r-[4px] bg-rice-blue transition-colors group-hover:bg-rich-blue"
                style={{ width: `${(r.percent / max) * 100}%` }}
              />
            </span>
            <span className="text-right text-sm font-semibold text-ink tabular-nums">
              {r.percent}%
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 px-2 text-xs text-slate">
        Share of portfolio by sector. Total {total}%.
      </figcaption>
    </figure>
  );
}
