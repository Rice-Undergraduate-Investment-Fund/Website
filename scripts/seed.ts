/**
 * Seed an EMPTY Sanity dataset with the starter content in lib/content/data.ts
 * (including photos from public/images).
 *
 *   npm run seed            # refuses if the dataset already has Site Settings
 *   npm run seed -- --force # overwrite starter documents (Studio edits to them are lost!)
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (see README).
 */
import "./env";
import { createClient, type SanityClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import { apiVersion, dataset, projectId } from "../sanity/env";
import * as data from "../lib/content/data";
import type { ImageAsset, Step } from "../lib/content/types";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN. Add it to .env.local (see README → Sanity setup).");
  process.exit(1);
}

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const key = () => randomUUID().slice(0, 12);
const force = process.argv.includes("--force");

// ---- images ---------------------------------------------------------------
const uploaded = new Map<string, string>();

async function uploadImage(src: string): Promise<string> {
  if (uploaded.has(src)) return uploaded.get(src)!;
  const file = join(process.cwd(), "public", src);
  const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
  uploaded.set(src, asset._id);
  console.log(`  ↑ uploaded ${src}`);
  return asset._id;
}

async function photo(img?: ImageAsset) {
  if (!img) return undefined;
  const [x, y] = (img.position ?? "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
  return {
    _type: "photo",
    alt: img.alt,
    asset: { _type: "reference", _ref: await uploadImage(img.src) },
    hotspot: { _type: "sanity.imageHotspot", x, y, width: 0.4, height: 0.4 },
    crop: { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0 },
  };
}

const steps = (list: Step[]) => list.map((s) => ({ _type: "step", _key: key(), ...s }));
const ref = (id: string) => ({ _type: "reference", _ref: id });
const clean = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null)) as T;

// ---- main -----------------------------------------------------------------
async function main() {
  console.log(`Seeding Sanity project ${projectId}, dataset "${dataset}"…`);

  const exists = await client.fetch<boolean>(`defined(*[_id == "siteSettings"][0]._id)`);
  if (exists && !force) {
    console.error("✗ This dataset already has content (Site Settings exists). Nothing was changed.");
    console.error("  Run `npm run seed -- --force` only if you want to overwrite the starter documents.");
    process.exit(1);
  }

  const docs: Record<string, unknown>[] = [];
  const s = data.siteSettings;

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    orgName: s.orgName,
    shortName: s.shortName,
    tagline: s.tagline,
    intro: s.intro,
    stats: Object.fromEntries(Object.entries(s.stats).map(([k, v]) => [k, { _type: "stat", ...v }])),
    alumniEmployers: s.alumniEmployers,
    mission: { heading: s.mission.heading, pillars: steps(s.mission.pillars) },
    operatingModel: steps(s.operatingModel),
    investmentProcess: steps(s.investmentProcess),
    contacts: s.contacts.map((c) => clean({ _type: "contact", _key: key(), ...c })),
    socials: s.socials.map((c) => ({ _type: "social", _key: key(), ...c })),
    photos: clean({
      homeHero: await photo(s.photos.homeHero),
      homeFeature: await photo(s.photos.homeFeature),
      homeTraining: await photo(s.photos.homeTraining),
      aboutHero: await photo(s.photos.aboutHero),
      trainingHero: await photo(s.photos.trainingHero),
      boardGroup: await photo(s.photos.boardGroup),
    }),
  });

  for (const p of data.people) {
    docs.push(
      clean({
        _id: p.id,
        _type: "person",
        name: p.name,
        photo: await photo(p.photo),
        status: p.status,
        graduationYear: p.graduationYear,
        email: p.email,
        linkedin: p.linkedin,
        bio: p.bio,
        boardPosition: p.boardPosition,
        boardOrder: p.boardOrder,
        employer: p.employer,
        jobTitle: p.jobTitle,
        location: p.location,
        formerPosition: p.formerPosition,
        formerSector: p.formerSector,
      }),
    );
  }

  for (const sec of data.sectors) {
    docs.push(
      clean({
        _id: `sector-${sec.slug}`,
        _type: "sector",
        name: sec.name,
        slug: { _type: "slug", current: sec.slug },
        description: sec.description,
        director: sec.directorId ? ref(sec.directorId) : undefined,
        members: sec.memberIds.map((id) => ({ ...ref(id), _key: key() })),
        order: sec.order,
      }),
    );
  }

  data.holdings.forEach((h, i) =>
    docs.push({ _id: `holding-${h.id}`, _type: "holding", company: h.company, ticker: h.ticker, sector: h.sector, featured: h.featured, order: i + 1 }),
  );

  data.timeline.forEach((e, i) =>
    docs.push(clean({ _id: `timeline-${i + 1}`, _type: "timelineEvent", year: e.year, title: e.title, description: e.description, order: i + 1 })),
  );

  const p = data.portfolio;
  docs.push(
    clean({
      _id: "portfolio",
      _type: "portfolio",
      aum: p.aum ?? undefined,
      returnSinceInception: p.returnSinceInception != null ? p.returnSinceInception * 100 : undefined,
      inceptionYear: p.inceptionYear,
      isSample: p.isSample,
      allocations: p.allocations.map((a) => ({ _type: "allocation", _key: key(), ...a })),
    }),
  );

  const t = data.trainingProgram;
  docs.push(
    clean({
      _id: "trainingProgram",
      _type: "trainingProgram",
      semesterLabel: t.semesterLabel,
      applicationsOpen: t.applicationsOpen,
      openDate: t.openDate,
      deadline: t.deadline,
      applyUrl: t.applyUrl,
      isSample: t.isSample,
      steps: steps(t.steps),
      sessions: steps(t.sessions.map(({ title, description }) => ({ title, description }))),
    }),
  );

  // People first (sectors reference them), in chunks to keep requests small.
  const order = (d: Record<string, unknown>) => (d._type === "person" ? 0 : 1);
  docs.sort((a, b) => order(a) - order(b));
  for (let i = 0; i < docs.length; i += 50) {
    const tx = client.transaction();
    docs.slice(i, i + 50).forEach((d) => tx.createOrReplace(d as { _id: string; _type: string }));
    await tx.commit();
  }

  console.log(`✓ Seeded ${docs.length} documents and ${uploaded.size} photos.`);
  console.log("  Open http://localhost:3000/studio to edit. Placeholder people can be removed with `npm run seed:clean`.");
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message);
  process.exit(1);
});
