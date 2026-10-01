import type { PerformanceRow } from "@/lib/content";
import { cx } from "@/components/ui/layout";

export const fmtPct = (n: number, signed = true) => {
  const v = Math.round(n * 1000) / 10; // one decimal
  const s = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
  return `${signed && v > 0 ? "+" : v < 0 ? "−" : ""}${s.replace("-", "")}%`;
};

/** Fund vs. benchmark returns with alpha. Alpha is computed, never entered. */
export function PerformanceTable({
  rows,
  benchmark,
  beta,
}: {
  rows: PerformanceRow[];
  benchmark: string;
  beta?: number;
}) {
  if (!rows.length) return null;
  return (
    <figure>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left">
          <thead>
            <tr className="border-b-2 border-rice-blue text-xs font-semibold tracking-[0.15em] text-slate uppercase">
              <th scope="col" className="py-3 pr-4 font-semibold">Period</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">RUIF</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">{benchmark}</th>
              <th scope="col" className="py-3 pl-4 text-right font-semibold">Alpha</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((r) => {
              const alpha = r.fund - r.benchmark;
              return (
                <tr key={r.period} className="border-b border-line">
                  <th scope="row" className="py-4 pr-4 font-medium text-ink">{r.period}</th>
                  <td className="px-4 py-4 text-right font-serif text-lg text-rice-blue">{fmtPct(r.fund)}</td>
                  <td className="px-4 py-4 text-right text-slate">{fmtPct(r.benchmark)}</td>
                  <td className={cx("py-4 pl-4 text-right font-semibold", alpha >= 0 ? "text-rice-blue" : "text-slate")}>
                    {fmtPct(alpha)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-4 text-xs text-slate">
        Cumulative returns. Benchmark: {benchmark === "VTI" ? "Vanguard Total Stock Market Index (VTI)" : benchmark}.
        {beta != null && ` 5-year beta vs. ${benchmark}: ${beta.toFixed(2)}.`}
      </figcaption>
    </figure>
  );
}
