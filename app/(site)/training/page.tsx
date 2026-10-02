import type { Metadata } from "next";
import { Arrow, ButtonLink, DisabledButton } from "@/components/ui/button";
import { CoverImage, PhotoHero, ProcessSteps } from "@/components/ui/blocks";
import { Container, Eyebrow, SampleNote, Section, SectionHeading, cx } from "@/components/ui/layout";
import { getSiteSettings, getTrainingProgram } from "@/lib/content";

export const metadata: Metadata = { title: "Training Program" };

export default async function TrainingPage() {
  const [t, s] = await Promise.all([getTrainingProgram(), getSiteSettings()]);
  const applyHref = t.applyUrl ?? "#apply";
  // Curriculum: sessions 1–2, 3–5, 6–7, each beside a photo (alternating sides on desktop).
  const curriculum = [
    { sessions: t.sessions.slice(0, 2), photo: s.photos.trainingCurriculum1 },
    { sessions: t.sessions.slice(2, 5), photo: s.photos.trainingCurriculum2 },
    { sessions: t.sessions.slice(5), photo: s.photos.trainingCurriculum3 },
  ].filter((b) => b.sessions.length > 0);

  return (
    <>
      <PhotoHero
        image={s.photos.trainingHero}
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
            <DisabledButton onDark reason="Applications are not open yet">
              Apply Now <Arrow />
            </DisabledButton>
          )}
          <ButtonLink href="#curriculum" variant="outlineLight">
            View Curriculum
          </ButtonLink>
        </div>
        {!t.applicationsOpen && (
          <p className="mt-4 text-sm text-white/70">{t.closedMessage || "Applications are not open yet."}</p>
        )}
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
            intro="Upon program completion, students are given a chance to be placed in an RUIF sector for the following semester."
          />
          <div className="mt-14 space-y-4">
            {curriculum.map((band, i) => (
              <div
                key={i}
                className={cx("grid gap-4 lg:grid-cols-2", i % 2 === 1 && "lg:[&>*:first-child]:order-2")}
              >
                <ol className={cx("grid gap-4", !band.photo && "lg:col-span-2 lg:grid-cols-2")}>
                  {band.sessions.map((s) => (
                    <li key={s.number} className="flex gap-6 bg-white p-7 sm:p-9">
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
                {band.photo && (
                  <div className="relative aspect-[3/2] overflow-hidden bg-rice-blue/10 lg:aspect-auto lg:min-h-full">
                    <CoverImage image={band.photo} sizes="(min-width: 1024px) 40vw, 100vw" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section id="apply" className="scroll-mt-20 bg-rice-blue text-white">
        <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            {t.applicationsOpen && <Eyebrow light>{t.semesterLabel} Applications</Eyebrow>}
            <h2 className={cx("text-4xl leading-tight sm:text-5xl", t.applicationsOpen && "mt-5")}>
              {t.applicationsOpen ? "Applications are open." : t.closedHeadline || "Applications are closed."}
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/80">
              {t.applicationsOpen
                ? "No prior finance experience required. We welcome students of every major."
                : t.closedNote || "Check back at the start of next semester for the next application cycle."}
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
