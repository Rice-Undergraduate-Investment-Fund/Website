import type { Metadata } from "next";
import { AllocationChart } from "@/components/portfolio/allocation-chart";
import { LetterViewer } from "@/components/portfolio/letter-viewer";
import { PerformanceTable, fmtPct } from "@/components/portfolio/performance-table";
import { PositionMemos } from "@/components/portfolio/position-memos";
import { PhotoHero, ProcessSteps, StatRow } from "@/components/ui/blocks";
import { Container, SampleNote, Section, SectionHeading } from "@/components/ui/layout";
import {
  getMemoHoldings,
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
    getMemoHoldings(),
    getHoldingsBySector(),
    getLatestLetter(),
    getSiteSettings(),
  ]);
  const note = p.note || (p.isSample ? "Figures pending: placeholders until real data is published" : undefined);

  return (
    <>
      <PhotoHero
        image={s.photos.portfolioHero}
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
            <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20 [&>*]:min-w-0">
              <SectionHeading
                title={`Measured against ${p.benchmarkName}`}
                intro="The fund is benchmarked against the total U.S. stock market."
              />
              <PerformanceTable rows={p.performance} benchmark={p.benchmarkName} />
            </div>
          )}
        </Container>
      </Section>

      {/* Letter + allocation share one layout so the two panels line up */}
      <Section tone="mist">
        <Container className="space-y-24">
          {letter && (
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16 [&>*]:min-w-0">
              <div>
                <SectionHeading
                  title={`Our ${letter.semester.split(" ")[0] || "Semester"} Introductory Letter`}
                  intro={
                    letter.summary ||
                    "Each semester the Board reports on the fund: a letter from the President, the organization chart, current holdings and the portfolio review."
                  }
                />
              </div>
              <div className="bg-white p-3 sm:p-5">
                <LetterViewer letter={letter} />
              </div>
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16 [&>*]:min-w-0">
            <SectionHeading
              title="Portfolio allocation"
            />
            <div className="bg-white p-4 sm:p-8">
              <AllocationChart allocations={p.allocations} holdingsBySector={bySector} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Selected positions: holdings with an investment memo */}
      {featured.length > 0 && (
        <Section>
          <Container>
            <SectionHeading title="Selected positions" />
            <PositionMemos holdings={featured} />
          </Container>
        </Section>
      )}

      <Section tone="mist">
        <Container>
          <SectionHeading
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
