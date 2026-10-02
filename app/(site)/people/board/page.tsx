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
      {/* Header: the group photo sits on the right and fades into Rice Blue, so it reads as part of the banner. */}
      <section className="relative isolate flex flex-col overflow-hidden bg-rice-blue text-white lg:min-h-[max(560px,72svh)] lg:flex-row lg:items-end">
        <div className="relative order-2 aspect-[4/3] sm:aspect-[16/10] lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:aspect-auto lg:w-[62%]">
          <CoverImage image={s.photos.boardGroup} priority sizes="(min-width: 1024px) 62vw, 100vw" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-rice-blue via-transparent to-transparent lg:bg-gradient-to-r lg:from-rice-blue lg:via-rice-blue/30 lg:via-30% lg:to-transparent lg:to-60%"
          />
        </div>
        <Container className="relative order-1 pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-md">
            <Eyebrow light>People</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">The Board</h1>
            <p className="mt-6 text-lg leading-relaxed text-white/85 text-pretty">
              RUIF&apos;s executive leadership for the 2026–27 academic year oversees the fund, the
              Training Program and the sectors.
            </p>
          </div>
        </Container>
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
