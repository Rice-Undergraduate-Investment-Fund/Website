import type { Metadata } from "next";
import { SectorDirectory } from "@/components/sectors/sector-directory";
import { PhotoHero } from "@/components/ui/blocks";
import { Container, Section } from "@/components/ui/layout";
import { getSectors, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Sectors" };

export default async function SectorsPage() {
  const [sectors, s] = await Promise.all([getSectors(), getSiteSettings()]);
  return (
    <>
      <PhotoHero image={s.photos.sectorsHero} title={`${sectors.length} Sectors Across Every Industry`}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
          Each sector is led by a Sector Director and staffed by Senior and Junior Analysts, who research companies
          and pitch ideas to the fund.
        </p>
      </PhotoHero>
      <Section>
        <Container>
          <SectorDirectory sectors={sectors} />
        </Container>
      </Section>
    </>
  );
}
