import type { Metadata } from "next";
import { BoardGrid } from "@/components/people/board-grid";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { getBoard, getSiteSettings } from "@/lib/content";
import { PhotoHero } from "@/components/ui/blocks";

export const metadata: Metadata = { title: "Board" };

export default async function BoardPage() {
  const [board, s] = await Promise.all([getBoard(), getSiteSettings()]);

  return (
    <>
      <PhotoHero
        // Portrait group photo in a wide banner: frame on the faces.
        image={s.photos.boardGroup && { ...s.photos.boardGroup, position: "50% 38%" }}
        title="The Board"
      >
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
          RUIF&apos;s executive leadership for the 2026–27 academic year oversees the fund, the Training
          Program and the sectors.
        </p>
      </PhotoHero>

      <Section>
        <Container>
          <SectionHeading title="Executive Board" />
          <BoardGrid people={board} />
        </Container>
      </Section>
    </>
  );
}
