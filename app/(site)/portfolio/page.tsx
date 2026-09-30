import type { Metadata } from "next";
import { AllocationChart } from "@/components/portfolio/allocation-chart";
import { PageHeader, ProcessSteps, StatRow } from "@/components/ui/blocks";
import { Container, SampleNote, Section, SectionHeading } from "@/components/ui/layout";
import { getFeaturedHoldings, getPortfolio, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Portfolio" };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n >= 0 ? "+" : ""}${Math.round(n * 100)}%`;

export default async function PortfolioPage() {
  const [p, holdings, s] = await Promise.all([
    getPortfolio(),
    getFeaturedHoldings(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Our Portfolio"
        title="A real portfolio, managed by students"
        intro="RUIF manages a portion of Rice University's endowment. Every position is researched, pitched and approved collectively by members."
      />

      <Section>
        <Container>
          {p.isSample && (
            <div className="mb-10">
              <SampleNote>Figures pending: placeholders until real data is published</SampleNote>
            </div>
          )}
          <StatRow
            stats={[
              { value: p.aum ? usd(p.aum) : "$—", label: "Assets Under Management" },
              {
                value: p.returnSinceInception != null ? pct(p.returnSinceInception) : "—",
                label: "Return Since Inception",
              },
              { value: s.stats.sectors.value, label: "Sectors" },
              { value: String(p.inceptionYear), label: "Fund Established" },
            ]}
          />
          {p.asOf && <p className="mt-8 text-sm text-slate">As of {p.asOf}</p>}
        </Container>
      </Section>

      <Section tone="mist">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Allocation"
              title="Portfolio allocation"
              intro={`Diversified across ${s.stats.sectors.value} sector teams, each responsible for its own positions.`}
            />
          </div>
          <div className="bg-white p-4 sm:p-8">
            <AllocationChart allocations={p.allocations} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Select Holdings" title="Selected positions" />
          <ul className="mt-12 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {holdings.map((h) => (
              <li key={h.id} className="flex min-h-48 flex-col border-r border-b border-line bg-white p-7">
                <span className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">
                  {h.ticker}
                </span>
                <span className="mt-3 font-serif text-2xl text-ink">{h.company}</span>
                <span className="mt-auto pt-6 text-sm text-slate">{h.sector}</span>
              </li>
            ))}
          </ul>
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
