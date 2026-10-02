import type { Metadata } from "next";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { CoverImage, PhotoHero, PillarGrid, ProcessSteps, StatRow } from "@/components/ui/blocks";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { fmtPct } from "@/components/portfolio/performance-table";
import { getPortfolio, getSiteSettings, getTimeline, type Stat, type TimelineEvent } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** Description text with the milestone's link words turned into a link. */
function MilestoneText({ e }: { e: TimelineEvent }) {
  const text = e.description ?? "";
  const i = e.linkText && e.linkUrl ? text.indexOf(e.linkText) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <a
        href={e.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-rice-blue underline decoration-rice-blue/30 underline-offset-4 transition-colors hover:decoration-rice-blue"
      >
        {e.linkText}
      </a>
      {text.slice(i + e.linkText!.length)}
    </>
  );
}

export default async function AboutPage() {
  const [s, portfolio, timeline] = await Promise.all([
    getSiteSettings(),
    getPortfolio(),
    getTimeline(),
  ]);

  // Trailing 12-month alpha vs. the benchmark (same figure as the Portfolio page table).
  const outperformance = portfolio.performance.find((r) => /12.?month|LTM|1.?year/i.test(r.period));

  const fundStats: Stat[] = [
    s.stats.members,
    s.stats.sectors,
    { value: portfolio.aum ? usd(portfolio.aum) : "$—", label: "Assets Under Management" },
    ...(portfolio.returnSinceInception != null
      ? [{ value: fmtPct(portfolio.returnSinceInception), label: "Return Since Inception" }]
      : []),
    ...(outperformance
      ? [
          {
            value: fmtPct(outperformance.fund - outperformance.benchmark),
            label: `Alpha vs. ${portfolio.benchmarkName} (last 12 months)`,
          },
        ]
      : []),
    { value: String(portfolio.inceptionYear), label: "Fund Established" },
  ];

  return (
    <>
      <PhotoHero image={s.photos.aboutHero} eyebrow="About Rice Finance" title="Learning finance by managing real capital">
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">{s.intro}</p>
      </PhotoHero>

      {/* Mission: heading, then photo beside the three pillars */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Our Mission" title={s.mission.heading} />
          <div className="mt-14 grid lg:grid-cols-[1.15fr_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden bg-mist lg:aspect-auto lg:min-h-[480px]">
              <CoverImage image={s.photos.aboutMission} sizes="(min-width: 1024px) 55vw, 100vw" />
            </div>
            <PillarGrid pillars={s.mission.pillars} stacked />
          </div>
        </Container>
      </Section>

      {/* The fund: stats on the left, photo bleeding to the right edge */}
      <section className="bg-rice-blue text-white">
        <div className="grid lg:grid-cols-[1.25fr_1fr]">
          <div className="px-5 py-20 sm:px-8 sm:py-28 lg:pr-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <Eyebrow light>The Fund</Eyebrow>
            <h2 className="mt-4 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
              A real fund, run by students
            </h2>
            <div className="mt-14">
              <StatRow light columns={3} stats={fundStats} />
            </div>
          </div>
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-full">
            <CoverImage image={s.photos.aboutFund} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="How We Operate"
            title="From training to portfolio decisions"
          />
          <div className="mt-16">
            <ProcessSteps steps={s.operatingModel} />
          </div>
        </Container>
      </Section>

      {/* History: heading + photo on the left, timeline on the right */}
      <Section tone="mist">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Our History" title="Since 2017" />
            {s.photos.aboutHistory && (
              <div className="relative mt-10 aspect-[4/3] overflow-hidden">
                <CoverImage image={s.photos.aboutHistory} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            )}
          </div>
          <ol className="relative self-center border-l border-rice-blue/30">
            {timeline.map((e, i) => (
              <li key={`${e.year}-${i}`} className="relative pb-12 pl-10 last:pb-0">
                <span
                  aria-hidden
                  className="absolute top-2 -left-[4px] size-[9px] rounded-full bg-rice-blue ring-4 ring-mist"
                />
                <p className="font-serif text-3xl text-rice-blue tabular-nums">{e.year}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{e.title}</p>
                {e.description && (
                  <p className="mt-1 leading-relaxed text-slate">
                    <MilestoneText e={e} />
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="!py-16 sm:!py-20">
        <Container className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-3xl text-rice-blue sm:text-4xl">Learn More</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/sectors" variant="secondary">
              Sectors
            </ButtonLink>
            <ButtonLink href="/people/board" variant="secondary">
              The Board
            </ButtonLink>
            <ButtonLink href="/training">
              Training Program <Arrow />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
