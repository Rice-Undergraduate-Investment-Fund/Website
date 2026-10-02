/**
 * Seed an EMPTY Sanity dataset with the starter content in lib/content/data.ts
 * (including photos from public/images).
 *
 *   npm run seed            # refuses if the dataset already has Site Settings
 *   npm run seed -- --force # overwrite starter documents (Studio edits to them are lost!)
 *
 * Update only some content groups in an existing dataset (replaces those documents):
 *   npm run seed -- --only=portfolio,holdings,letters      (alias: npm run seed:portfolio)
 *   npm run seed -- --only=people,sectors                 (alias: npm run seed:people)
 *   npm run seed -- --only=about                          (alias: npm run seed:about)
 *     → How-we-operate steps, About photos from seed-assets/site/, history timeline
 *   groups: settings, people, sectors, holdings, timeline, portfolio, training, letters,
 *           about (About page only), home (alumni count + applications open/closed),
 *           alumni (firms in "Where RUIF members go")
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (see README).
 */
import "./env";
import { createClient, type SanityClient } from "@sanity/client";
import { createReadStream, existsSync, readdirSync } from "node:fs";
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
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice(7).split(",").map((x) => x.trim())) : null;
const want = (group: string) => !only || only.has(group);

// ---- images ---------------------------------------------------------------
const uploaded = new Map<string, string>();

async function uploadImage(src: string): Promise<string> {
  if (uploaded.has(src)) return uploaded.get(src)!;
  // Paths starting with "seed-assets/" are local, git-ignored files; others live in public/.
  const file = src.startsWith("seed-assets/") ? join(process.cwd(), src) : join(process.cwd(), "public", src);
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

/** Page photos dropped into seed-assets/site/<photoKey>.jpg (e.g. aboutHero.jpg). */
async function localSitePhotos(): Promise<Record<string, unknown>> {
  const dir = join(process.cwd(), "seed-assets", "site");
  if (!existsSync(dir)) return {};
  const out: Record<string, unknown> = {};
  for (const f of readdirSync(dir)) {
    const m = f.match(/^([A-Za-z][A-Za-z0-9]*)\.(jpe?g|png)$/);
    if (!m) continue;
    out[m[1]] = await photo({
      src: `seed-assets/site/${f}`,
      alt: data.photoAlt[m[1]] ?? "",
      width: 2400,
      height: 1600,
      position: data.photoFocus[m[1]] ?? "50% 50%",
    });
  }
  return out;
}

// ---- main -----------------------------------------------------------------
async function main() {
  console.log(`Seeding Sanity project ${projectId}, dataset "${dataset}"…`);

  const exists = await client.fetch<boolean>(`defined(*[_id == "siteSettings"][0]._id)`);
  if (only) console.log(`  Only updating: ${[...only].join(", ")} (these documents are replaced)`);
  if (exists && !force && !only) {
    console.error("✗ This dataset already has content (Site Settings exists). Nothing was changed.");
    console.error("  Run `npm run seed -- --force` only if you want to overwrite the starter documents.");
    process.exit(1);
  }

  const docs: Record<string, unknown>[] = [];
  const s = data.siteSettings;

  if (want("settings")) docs.push({
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
      ...(await localSitePhotos()),
    }),
  });

  // Headshots: seed-assets/people/<person-id>.jpg (git-ignored, never pushed to GitHub).
  // If there's no local file, keep the photo already in Sanity (e.g. uploaded in the Studio).
  const existingPhotos = want("people")
    ? new Map(
        (await client.fetch<{ _id: string; photo?: unknown }[]>(`*[_type == "person" && defined(photo.asset)]{ _id, photo }`)).map(
          (d) => [d._id, d.photo],
        ),
      )
    : new Map<string, unknown>();
  const headshot = async (p: (typeof data.people)[number]) => {
    for (const ext of ["jpg", "jpeg", "png"]) {
      const rel = `seed-assets/people/${p.id}.${ext}`;
      if (existsSync(join(process.cwd(), rel))) {
        return photo({ src: rel, alt: p.name, width: 800, height: 800, position: "50% 40%" });
      }
    }
    return p.photo ? photo(p.photo) : existingPhotos.get(p.id);
  };

  if (want("people")) for (const p of data.people) {
    docs.push(
      clean({
        _id: p.id,
        _type: "person",
        name: p.name,
        photo: await headshot(p),
        status: p.status,
        graduationYear: p.graduationYear,
        email: p.email,
        linkedin: p.linkedin,
        bio: p.bio,
        boardPosition: p.boardPosition,
        boardOrder: p.boardOrder,
        sectorRole: p.sectorRole,
        employer: p.employer,
        jobTitle: p.jobTitle,
        location: p.location,
        formerPosition: p.formerPosition,
        formerSector: p.formerSector,
      }),
    );
  }

  if (want("sectors")) for (const sec of data.sectors) {
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

  if (want("holdings")) {
    data.holdings.forEach((h, i) =>
      docs.push(
        clean({
          _id: `holding-${h.id}`,
          _type: "holding",
          company: h.company,
          ticker: h.ticker,
          sector: h.sector,
          featured: h.featured,
          highlight: h.highlight,
          order: i + 1,
        }),
      ),
    );
  }

  if (want("timeline") || want("about")) data.timeline.forEach((e, i) =>
    docs.push(
      clean({
        _id: `timeline-${i + 1}`,
        _type: "timelineEvent",
        year: e.year,
        title: e.title,
        description: e.description,
        linkText: e.linkText,
        linkUrl: e.linkUrl,
        order: i + 1,
      }),
    ),
  );

  // "about": update only the About-page parts of Site Settings (keeps every other setting as is).
  if (only?.has("about")) {
    const sitePhotos = await localSitePhotos();
    const set: Record<string, unknown> = {
      operatingModel: steps(s.operatingModel),
      "mission.pillars": steps(s.mission.pillars),
      "stats.members": { _type: "stat", ...s.stats.members },
    };
    for (const [k, v] of Object.entries(sitePhotos)) set[`photos.${k}`] = v;
    await client.patch("siteSettings").setIfMissing({ photos: {}, mission: {}, stats: {} }).set(set).commit();
    console.log(`  ✎ updated Site Settings: mission boxes, member count, How we operate${Object.keys(sitePhotos).length ? ` + photos (${Object.keys(sitePhotos).join(", ")})` : ""}`);
  }

  // "home": Home-page figures + recruiting state (keeps every other setting as is).
  if (only?.has("home")) {
    await client
      .patch("siteSettings")
      .setIfMissing({ stats: {} })
      .setIfMissing({ photos: {} })
      .set({
        "stats.alumni": { _type: "stat", ...s.stats.alumni },
        // Any page photos in seed-assets/site/ (homeFeature, aboutHero, …)
        ...Object.fromEntries(Object.entries(await localSitePhotos()).map(([k, v]) => [`photos.${k}`, v])),
      })
      .commit();
    const tp = data.trainingProgram;
    await client
      .patch("trainingProgram")
      .set({ applicationsOpen: tp.applicationsOpen, closedMessage: tp.closedMessage ?? "" })
      .commit();
    console.log(`  ✎ updated alumni count (${s.stats.alumni.value}) and applications ${tp.applicationsOpen ? "OPEN" : "closed"}`);
  }

  // Percentages are stored in Sanity the way editors type them (25.6 = 25.6%).
  const toPct = (n: number) => Math.round(n * 1000) / 10;
  const p = data.portfolio;
  if (want("portfolio")) docs.push(
    clean({
      _id: "portfolio",
      _type: "portfolio",
      aum: p.aum ?? undefined,
      returnSinceInception: p.returnSinceInception != null ? toPct(p.returnSinceInception) : undefined,
      inceptionYear: p.inceptionYear,
      asOf: p.asOf,
      note: p.note,
      isSample: p.isSample,
      benchmarkName: p.benchmarkName,
      beta: p.beta,
      allocations: p.allocations.map((a) => ({ _type: "allocation", _key: key(), ...a })),
      performance: p.performance.map((r) => ({
        _type: "performanceRow",
        _key: key(),
        period: r.period,
        fund: toPct(r.fund),
        benchmark: toPct(r.benchmark),
      })),
    }),
  );

  if (want("letters")) {
    for (const l of data.letters) {
      const file = join(process.cwd(), "public", l.url);
      const asset = await client.assets.upload("file", createReadStream(file), {
        filename: l.filename,
        contentType: "application/pdf",
      });
      console.log(`  ↑ uploaded ${l.url}`);
      docs.push(
        clean({
          _id: l.id,
          _type: "letter",
          title: l.title,
          semester: l.semester,
          publishedAt: l.publishedAt,
          summary: l.summary,
          file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
        }),
      );
    }
  }

  const t = data.trainingProgram;
  if (want("training")) docs.push(
    clean({
      _id: "trainingProgram",
      _type: "trainingProgram",
      semesterLabel: t.semesterLabel,
      applicationsOpen: t.applicationsOpen,
      closedMessage: t.closedMessage,
      closedHeadline: t.closedHeadline,
      closedNote: t.closedNote,
      openDate: t.openDate,
      deadline: t.deadline,
      applyUrl: t.applyUrl,
      isSample: t.isSample,
      steps: steps(t.steps),
      sessions: steps(t.sessions.map(({ title, description }) => ({ title, description }))),
    }),
  );

  // Alumni firms ("Where RUIF members go"). One document per firm + industry.
  const firmId = (f: { name: string; industry: string }) =>
    `alumniFirm-${f.industry}-${f.name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  if (want("alumni")) data.alumniFirms.forEach((f) =>
    docs.push({ _id: firmId(f), _type: "alumniFirm", name: f.name, industry: f.industry, tier: f.tier, showOnHome: true }),
  );

  // People first (sectors reference them), in chunks to keep requests small.
  const order = (d: Record<string, unknown>) => (d._type === "person" ? 0 : 1);
  docs.sort((a, b) => order(a) - order(b));
  for (let i = 0; i < docs.length; i += 50) {
    const tx = client.transaction();
    docs.slice(i, i + 50).forEach((d) => tx.createOrReplace(d as { _id: string; _type: string }));
    await tx.commit();
  }

  // Remove seed-created firms that were dropped from data.ts. Firms added in the Studio are never touched.
  if (only?.has("alumni")) {
    const keep = data.alumniFirms.map(firmId);
    const stale = await client.fetch<string[]>(`*[_type == "alumniFirm" && _id match "alumniFirm-*" && !(_id in $keep)]._id`, { keep });
    if (stale.length) {
      const tx = client.transaction();
      stale.forEach((id) => tx.delete(id));
      await tx.commit();
      console.log(`  ✕ removed ${stale.length} old alumni firms`);
    }
  }

  // When replacing the timeline, remove milestones that are no longer in the list.
  if (only?.has("timeline") || only?.has("about")) {
    const keep = data.timeline.map((_, i) => `timeline-${i + 1}`);
    const stale = await client.fetch<string[]>(`*[_type == "timelineEvent" && !(_id in $keep) && !(_id in path("drafts.**"))]._id`, { keep });
    if (stale.length) {
      const tx = client.transaction();
      stale.forEach((id) => tx.delete(id));
      await tx.commit();
      console.log(`  ✕ removed ${stale.length} old milestones`);
    }
  }

  // When replacing sectors, remove sectors that are no longer in the list
  // (must happen before people, since sectors reference people).
  if (only?.has("sectors")) {
    const keep = data.sectors.map((sec) => `sector-${sec.slug}`);
    const stale = await client.fetch<string[]>(`*[_type == "sector" && !(_id in $keep) && !(_id in path("drafts.**"))]._id`, { keep });
    if (stale.length) {
      const tx = client.transaction();
      stale.forEach((id) => tx.delete(id));
      await tx.commit();
      console.log(`  ✕ removed ${stale.length} sectors no longer in the list`);
    }
  }

  // When replacing people, remove old placeholder people that are no longer used.
  // (Only IDs starting with "placeholder-" are ever removed; real people added in the Studio are kept.)
  if (only?.has("people")) {
    const keep = data.people.map((pp) => pp.id);
    const stale = await client.fetch<string[]>(
      `*[_type == "person" && string::startsWith(_id, "placeholder-") && !(_id in $keep) && count(*[references(^._id)]) == 0]._id`,
      { keep },
    );
    if (stale.length) {
      const tx = client.transaction();
      stale.forEach((id) => tx.delete(id));
      await tx.commit();
      console.log(`  ✕ removed ${stale.length} placeholder people no longer used`);
    }
  }

  // When replacing holdings, remove holdings that are no longer in the list.
  if (only?.has("holdings")) {
    const keep = data.holdings.map((h) => `holding-${h.id}`);
    const stale = await client.fetch<string[]>(`*[_type == "holding" && !(_id in $keep) && !(_id in path("drafts.**"))]._id`, { keep });
    if (stale.length) {
      const tx = client.transaction();
      stale.forEach((id) => tx.delete(id));
      await tx.commit();
      console.log(`  ✕ removed ${stale.length} holdings no longer in the list`);
    }
  }

  console.log(`✓ Seeded ${docs.length} documents and ${uploaded.size} photos.`);
  console.log("  Open http://localhost:3000/studio to edit. Placeholder people can be removed with `npm run seed:clean`.");
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message);
  process.exit(1);
});
