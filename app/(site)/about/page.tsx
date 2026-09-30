import type { Metadata } from "next";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { PhotoHero, PillarGrid, ProcessSteps, StatRow } from "@/components/ui/blocks";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { getPortfolio, getSiteSettings, getTimeline } from "@/lib/content";
import { photos } from "@/lib/images";

export const metadata: Metadata = { title: "About" };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default async function AboutPage() {
  const [s, portfolio, timeline] = await Promise.all([
    getSiteSettings(),
    getPortfolio(),
    getTimeline(),
  ]);

  return (
    <>
      <PhotoHero image={photos.presidentVpWide} eyebrow="About Rice Finance" title="Learning finance by managing real capital">
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">{s.intro}</p>
      </PhotoHero>

      <Section>
        <Container>
          <SectionHeading eyebrow="Our Mission" title={s.mission.heading} />
          <div className="mt-14">
            <PillarGrid pillars={s.mission.pillars} />
          </div>
        </Container>
      </Section>

      <Section tone="blue">
        <Container>
          <SectionHeading eyebrow="The Fund" title="A real fund, run by students" light />
          <div className="mt-14">
            <StatRow
              light
              stats={[
                s.stats.members,
                s.stats.sectors,
                { value: portfolio.aum ? usd(portfolio.aum) : "$—", label: "Assets Under Management" },
                { value: String(portfolio.inceptionYear), label: "Fund Established" },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="How We Operate"
            title="From training to portfolio decisions"
            intro="Every member follows the same path, from the Training Program to managing real capital."
          />
          <div className="mt-16">
            <ProcessSteps steps={s.operatingModel} />
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading eyebrow="Our History" title="Since 2017" />
          <ol className="relative border-l border-rice-blue/30">
            {timeline.map((e, i) => (
              <li key={`${e.year}-${i}`} className="relative pb-12 pl-10 last:pb-0">
                <span
                  aria-hidden
                  className="absolute top-2 -left-[4px] size-[9px] rounded-full bg-rice-blue ring-4 ring-mist"
                />
                <p className="font-serif text-3xl text-rice-blue tabular-nums">{e.year}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{e.title}</p>
                {e.description && <p className="mt-1 text-slate">{e.description}</p>}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="!py-16 sm:!py-20">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl text-rice-blue sm:text-4xl">Meet the people behind the fund.</h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/people/board">
              The Board <Arrow />
            </ButtonLink>
            <ButtonLink href="/sectors" variant="secondary">
              Our Sectors
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
