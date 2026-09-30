import type { Metadata } from "next";
import { SectorDirectory } from "@/components/sectors/sector-directory";
import { PageHeader } from "@/components/ui/blocks";
import { Container, Section } from "@/components/ui/layout";
import { getSectors } from "@/lib/content";

export const metadata: Metadata = { title: "Sectors" };

export default async function SectorsPage() {
  const sectors = await getSectors();
  return (
    <>
      <PageHeader
        eyebrow="Our Sectors"
        title="Sector teams covering the public markets"
        intro="Each sector is led by a Sector Director and staffed by members who research companies and pitch ideas to the fund. Select a sector to meet its team."
      />
      <Section>
        <Container>
          <SectorDirectory sectors={sectors} />
        </Container>
      </Section>
    </>
  );
}
