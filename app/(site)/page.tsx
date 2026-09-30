import Link from "next/link";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { CoverImage, PhotoHero, StatRow } from "@/components/ui/blocks";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { getSiteSettings, getTrainingProgram } from "@/lib/content";

const explore = [
  {
    href: "/sectors",
    title: "Sectors",
    body: "Sector teams cover the public markets, each led by a Sector Director.",
  },
  {
    href: "/portfolio",
    title: "Portfolio",
    body: "A real portfolio, managed collectively as part of the University's endowment.",
  },
  {
    href: "/training",
    title: "Training Program",
    body: "Seven sessions on accounting, valuation and markets: the path into the fund.",
  },
  {
    href: "/people/board",
    title: "People",
    body: "Meet the Board leading the fund and the alumni who came before.",
  },
];

export default async function HomePage() {
  const [s, training] = await Promise.all([getSiteSettings(), getTrainingProgram()]);
  const applyHref = training.applyUrl ?? "/training#apply";

  return (
    <>
      <PhotoHero image={s.photos.homeHero} eyebrow={s.orgName} title={s.tagline} tall>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">{s.intro}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/training" variant="light">
            Join the Training Program <Arrow />
          </ButtonLink>
          <ButtonLink href="/about" variant="outlineLight">
            About the Fund
          </ButtonLink>
        </div>
      </PhotoHero>

      {/* Key stats */}
      <section className="bg-rice-blue py-14 text-white sm:py-16">
        <Container>
          <StatRow
            light
            stats={[s.stats.members, s.stats.sectors, s.stats.trainingStudents, s.stats.alumni]}
          />
        </Container>
      </section>

      {/* Intro split */}
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Who We Are" title={s.mission.heading} />
            <p className="mt-6 text-lg leading-relaxed text-slate">
              Members manage a portion of Rice University&apos;s endowment, overseen by Rice
              Management Company. They learn by researching companies, pitching ideas and making
              investment decisions as a team.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-rice-blue"
            >
              How the fund works <Arrow className="group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]">
            <CoverImage image={s.photos.homeFeature} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Container>
      </Section>

      {/* Explore */}
      <Section tone="mist">
        <Container>
          <SectionHeading eyebrow="Explore" title="Inside the fund" />
          <div className="mt-12 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {explore.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="group flex min-h-52 flex-col border-r border-b border-line bg-white sm:min-h-64 p-8 transition-colors duration-300 hover:bg-rice-blue"
              >
                <h3 className="text-2xl text-rice-blue transition-colors group-hover:text-white">
                  {e.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate transition-colors group-hover:text-white/80">
                  {e.body}
                </p>
                <span className="mt-auto pt-8 text-rice-blue transition-colors group-hover:text-white">
                  <Arrow className="size-5 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Training CTA */}
      <section className="bg-rice-blue text-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px]">
            <CoverImage image={s.photos.homeTraining} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="flex items-center px-5 py-16 sm:px-12 sm:py-20 lg:px-16 xl:px-24">
            <div className="max-w-lg">
              <Eyebrow light>{training.semesterLabel} Recruiting</Eyebrow>
              <h2 className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Learn finance. Apply it. Join the fund.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/80">
                The Training Program is how students join RUIF. No prior finance experience is
                required, just curiosity and commitment.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {training.applicationsOpen && (
                  <ButtonLink href={applyHref} variant="light">
                    Apply Now <Arrow />
                  </ButtonLink>
                )}
                <ButtonLink href="/training" variant="outlineLight">
                  About the Program
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni credibility */}
      <Section>
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Alumni"
              title="Where RUIF members go"
              intro={`${s.stats.alumni.value} alumni since the fund's founding in 2017.`}
            />
            <Link
              href="/people/alumni"
              className="group inline-flex shrink-0 items-center gap-2 font-semibold text-rice-blue"
            >
              View alumni <Arrow className="group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className="mt-14 grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-5">
            {s.alumniEmployers.map((name) => (
              <li
                key={name}
                className="flex h-28 items-center justify-center border-r border-b border-line px-4 text-center font-serif text-lg text-slate sm:text-xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section tone="mist" className="!py-16 sm:!py-20">
        <Container className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl text-rice-blue sm:text-4xl">Questions about RUIF?</h2>
            <p className="mt-3 text-lg text-slate">
              Reach out about the fund, the Training Program or working with us.
            </p>
          </div>
          <ButtonLink href="/contact">
            Contact Us <Arrow />
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
