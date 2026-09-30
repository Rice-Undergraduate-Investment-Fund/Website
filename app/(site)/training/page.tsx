import type { Metadata } from "next";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { PhotoHero, ProcessSteps } from "@/components/ui/blocks";
import { Container, Eyebrow, SampleNote, Section, SectionHeading } from "@/components/ui/layout";
import { getTrainingProgram } from "@/lib/content";
import { photos } from "@/lib/images";

export const metadata: Metadata = { title: "Training Program" };

export default async function TrainingPage() {
  const t = await getTrainingProgram();
  const applyHref = t.applyUrl ?? "#apply";

  return (
    <>
      <PhotoHero
        image={photos.trainingWide}
        eyebrow="RUIF Training Program"
        title={
          <>
            Learn Finance.
            <br />
            Apply It.
            <br />
            Join the Fund.
          </>
        }
      >
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
          Seven sessions covering accounting, finance and valuation. The Training Program is how
          students join the Rice Undergraduate Investment Fund.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          {t.applicationsOpen ? (
            <ButtonLink href={applyHref} variant="light">
              Apply Now <Arrow />
            </ButtonLink>
          ) : (
            <span className="inline-flex h-12 items-center border border-white/40 px-6 text-sm font-semibold text-white/80">
              Applications currently closed
            </span>
          )}
          <ButtonLink href="#curriculum" variant="outlineLight">
            View Curriculum
          </ButtonLink>
        </div>
      </PhotoHero>

      <Section>
        <Container>
          <SectionHeading eyebrow="How It Works" title="Your path into the fund" />
          <div className="mt-16">
            <ProcessSteps steps={t.steps} />
          </div>
        </Container>
      </Section>

      <Section tone="mist" id="curriculum">
        <Container>
          <SectionHeading
            eyebrow="Curriculum"
            title="Seven sessions, one complete foundation"
            intro="Each session builds on the last, ending with a pitch of your own."
          />
          <ol className="mt-14 grid border-t border-l border-line bg-white md:grid-cols-2">
            {t.sessions.map((s) => (
              <li key={s.number} className="flex gap-6 border-r border-b border-line bg-white p-7 sm:p-9">
                <span className="font-serif text-4xl leading-none text-rice-blue/25 tabular-nums">
                  {String(s.number).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">
                    Session {s.number}
                  </p>
                  <h3 className="mt-2 text-2xl text-ink">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <section id="apply" className="scroll-mt-20 bg-rice-blue text-white">
        <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <Eyebrow light>{t.semesterLabel} Applications</Eyebrow>
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
              {t.applicationsOpen ? "Applications are open." : "Applications are closed."}
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/80">
              {t.applicationsOpen
                ? "No prior finance experience required. We welcome students of every major."
                : "Check back at the start of next semester for the next application cycle."}
            </p>
            {t.isSample && (
              <div className="mt-6">
                <SampleNote>Dates and link to be confirmed</SampleNote>
              </div>
            )}
          </div>
          <div className="border border-white/20 p-8 sm:p-10">
            <dl className="grid grid-cols-2 gap-8">
              <div>
                <dt className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">Applications Open</dt>
                <dd className="mt-2 font-serif text-2xl">{t.openDate ?? "TBD"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">Deadline</dt>
                <dd className="mt-2 font-serif text-2xl">{t.deadline ?? "TBD"}</dd>
              </div>
            </dl>
            {t.applicationsOpen &&
              (t.applyUrl ? (
                <ButtonLink href={t.applyUrl} variant="light" className="mt-10 w-full">
                  Apply <Arrow />
                </ButtonLink>
              ) : (
                <span className="mt-10 flex h-12 w-full items-center justify-center bg-white/10 text-sm font-semibold text-white/70">
                  Application link coming soon
                </span>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}
