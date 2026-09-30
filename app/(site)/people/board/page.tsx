import type { Metadata } from "next";
import { PersonCard } from "@/components/people/person";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { getBoard, getSiteSettings } from "@/lib/content";
import { CoverImage } from "@/components/ui/blocks";

export const metadata: Metadata = { title: "Board" };

/**
 * DRAFT: the spec asks to preserve the current site's Board design and
 * hierarchy. This version will be aligned with the existing Wix page next.
 */
export default async function BoardPage() {
  const [board, s] = await Promise.all([getBoard(), getSiteSettings()]);

  return (
    <>
      <section className="bg-rice-blue text-white">
        <Container className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow light>People</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">The Board</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              RUIF&apos;s executive leadership for the 2026–27 academic year oversees the fund, the
              Training Program and the sector teams.
            </p>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden">
            <CoverImage image={s.photos.boardGroup} priority sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="2026–27" title="Executive Board" />
          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
            {board.map((p) => (
              <li key={p.id}>
                <PersonCard
                  person={p}
                  role={p.boardPosition}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
