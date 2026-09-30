import type { Metadata } from "next";
import { PersonCard } from "@/components/people/person";
import { PageHeader } from "@/components/ui/blocks";
import { Container, SampleNote, Section, SectionHeading } from "@/components/ui/layout";
import { getAlumniByClass, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Alumni" };

export default async function AlumniPage() {
  const [classes, s] = await Promise.all([getAlumniByClass(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Alumni"
        title="Where RUIF members go"
        intro={`${s.stats.alumni.value} alumni since the fund's founding in 2017, now working across investment banking, investing, consulting and beyond.`}
      />

      <Section className="!pb-0">
        <Container>
          <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-5">
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

      <Section>
        <Container>
          <div className="mb-4">
            <SampleNote>Demonstration entries: real alumni to be added</SampleNote>
          </div>
          <div className="space-y-20">
            {classes.map(({ year, people }) => (
              <div key={year}>
                <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
                  <SectionHeading title={`Class of ${year}`} />
                  <p className="shrink-0 text-sm text-slate">{people.length} alumni</p>
                </div>
                <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
                  {people.map((p) => (
                    <li key={p.id}>
                      <PersonCard
                        person={p}
                        role={p.employer}
                        details={[p.jobTitle, p.location]}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
