import type { Metadata } from "next";
import { AllocationChart } from "@/components/portfolio/allocation-chart";
import { LetterViewer } from "@/components/portfolio/letter-viewer";
import { PerformanceTable, fmtPct } from "@/components/portfolio/performance-table";
import { PhotoHero, ProcessSteps, StatRow } from "@/components/ui/blocks";
import { Container, SampleNote, Section, SectionHeading } from "@/components/ui/layout";
import {
  getFeaturedHoldings,
  getHoldingsBySector,
  getLatestLetter,
  getPortfolio,
  getSiteSettings,
} from "@/lib/content";

export const metadata: Metadata = { title: "Portfolio" };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default async function PortfolioPage() {
  const [p, featured, bySector, letter, s] = await Promise.all([
    getPortfolio(),
    getFeaturedHoldings(),
    getHoldingsBySector(),
    getLatestLetter(),
    getSiteSettings(),
  ]);
  const holdingCount = bySector.reduce((n, g) => n + g.holdings.length, 0);
  const note = p.note || (p.isSample ? "Figures pending: placeholders until real data is published" : undefined);

  return (
    <>
      <PhotoHero
        image={s.photos.portfolioHero}
        eyebrow="Our Portfolio"
        title="Long-Only Value Investing, Demonstrated Through Performance"
      >
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
          Deploying a portion of Rice University&apos;s endowment, we pursue a fundamental, long-only investment
          strategy focused on identifying undervalued businesses with strong long-term growth potential.
        </p>
      </PhotoHero>

      {/* Key figures + performance */}
      <Section>
        <Container>
          {(note || p.asOf) && (
            <div className="mb-10 flex flex-wrap items-center gap-3">
              {p.asOf && (
                <span className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">As of {p.asOf}</span>
              )}
              {note && <SampleNote>{note}</SampleNote>}
            </div>
          )}
          <StatRow
            stats={[
              { value: p.aum ? usd(p.aum) : "$—", label: "Assets Under Management" },
              {
                value: p.returnSinceInception != null ? fmtPct(p.returnSinceInception) : "—",
                label: "Return Since Inception",
              },
              { value: s.stats.sectors.value, label: "Sectors" },
              { value: String(p.inceptionYear), label: "Fund Established" },
            ]}
          />
          {p.performance.length > 0 && (
            <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
              <SectionHeading
                eyebrow="Performance"
                title={`Measured against ${p.benchmarkName}`}
                intro="The fund is benchmarked against the total U.S. stock market."
              />
              <PerformanceTable rows={p.performance} benchmark={p.benchmarkName} beta={p.beta} />
            </div>
          )}
        </Container>
      </Section>

      {/* Letter + allocation share one layout so the two panels line up */}
      <Section tone="mist">
        <Container className="space-y-24">
          {letter && (
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow={`${letter.semester} Letter`}
                  title="Letter to members"
                  intro={
                    letter.summary ||
                    "Each semester the Board reports on the fund: a letter from the President, the organization chart, current holdings and the portfolio review."
                  }
                />
                <p className="mt-6 text-sm text-slate">
                  Use the arrows to turn pages, or open the full-size view.
                </p>
              </div>
              <div className="bg-white p-3 sm:p-5">
                <LetterViewer letter={letter} />
              </div>
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Allocation"
              title="Portfolio allocation"
            />
            <div className="bg-white p-4 sm:p-8">
              <AllocationChart allocations={p.allocations} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Selected positions */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Select Holdings" title="Selected positions" />
          <ul className="mt-12 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((h) => (
              <li key={h.id} className="flex min-h-56 flex-col border-r border-b border-line bg-white p-7">
                <span className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">{h.ticker}</span>
                <span className="mt-3 font-serif text-2xl text-ink">{h.company}</span>
                {h.highlight && <span className="mt-3 text-sm leading-relaxed text-slate">{h.highlight}</span>}
                <span className="mt-auto pt-6 text-xs font-medium tracking-wide text-rice-gray uppercase">{h.sector}</span>
              </li>
            ))}
          </ul>

          {holdingCount > 0 && (
            <div className="mt-20">
              <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
                <h3 className="text-2xl text-rice-blue sm:text-3xl">All holdings</h3>
                <p className="shrink-0 text-sm text-slate">{holdingCount} positions</p>
              </div>
              <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {bySector.map((g) => (
                  <div key={g.sector}>
                    <p className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">
                      {g.sector} <span className="text-rice-gray">· {g.holdings.length}</span>
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {g.holdings.map((h) => (
                        <li key={h.id} className="flex gap-3">
                          <span className="w-12 shrink-0 font-semibold text-ink tabular-nums">{h.ticker}</span>
                          <span className="text-slate">{h.company}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="Our Investment Process"
            title="From research to allocation"
            intro="Every idea follows the same disciplined path before it reaches the portfolio."
          />
          <div className="mt-16">
            <ProcessSteps steps={s.investmentProcess} />
          </div>
        </Container>
      </Section>
    </>
  );
}
