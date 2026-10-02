import type { Metadata } from "next";
import { BoardGrid } from "@/components/people/board-grid";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { getBoard, getSiteSettings } from "@/lib/content";
import { CoverImage } from "@/components/ui/blocks";

export const metadata: Metadata = { title: "Board" };

export default async function BoardPage() {
  const [board, s] = await Promise.all([getBoard(), getSiteSettings()]);

  return (
    <>
      {/* Header: text on Rice Blue, group photo full-bleed on the right (same height as the other page banners). */}
      <section className="bg-rice-blue text-white lg:grid lg:min-h-[max(560px,72svh)] lg:grid-cols-2">
        <div className="flex items-end">
          <Container className="pt-32 pb-14 sm:pb-20 lg:mr-0 lg:max-w-[40rem] lg:pr-12">
            <Eyebrow light>People</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">The Board</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85 text-pretty">
              RUIF&apos;s executive leadership for the 2026–27 academic year oversees the fund, the
              Training Program and the sectors.
            </p>
          </Container>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto">
          <CoverImage image={s.photos.boardGroup} priority sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="2026–27" title="Executive Board" />
          <BoardGrid people={board} />
        </Container>
      </Section>
    </>
  );
}
