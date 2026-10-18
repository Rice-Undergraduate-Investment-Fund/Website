/**
 * Upload sector member headshots to Sanity.
 *
 *   npm run import:sector-photos                 ← uses ../Photos/Website/Sectors
 *   npm run import:sector-photos -- --dry-run    ← check matches without uploading
 *   npm run import:sector-photos -- --photos="path/to/folder"
 *
 * Folder layout: one subfolder per sector ("Energy", "PUI", …), one photo per
 * person named after them ("Jane Smith.jpg", "Jane_Smith_Fall26_Headshot.png",
 * "Jane Smith - Headshot.heic" all work). Each photo is matched to the sector's
 * Director or members in Sanity by name. A photo identical to the one already on
 * the site is left alone; a new one replaces it. HEIC files are converted to JPEG
 * with macOS `sips`.
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local.
 */
import "./env";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const photosArg = args.find((a) => a.startsWith("--photos="))?.slice("--photos=".length);
const ROOT = resolve(photosArg ?? "../Photos/Website/Sectors");

/** Folder names that differ from the sector's name in Sanity. */
const FOLDER_ALIASES: Record<string, string> = {
  "communications & sports": "communication & sports",
  pui: "power, utilities & infrastructure",
};
/** File names that use a different form of the person's name than Sanity does. */
const NAME_ALIASES: Record<string, string> = {
  "ben viafore": "benjamin viafore",
  "david wang": "daiwei wang", // Technology
};

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !dryRun) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

type P = { _id: string; name: string; ref?: string } | null;
type Sector = { name: string; director: P; members: P[] | null };

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z& ,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const nameOnly = (s: string) => norm(s).replace(/[&,]/g, " ").replace(/\s+/g, " ").trim();
/** "Jane_Smith_Fall26_Headshot.png" → "jane smith" */
const nameFromFile = (file: string) =>
  nameOnly(
    basename(file, extname(file))
      .replace(/_/g, " ")
      .replace(/\b(fall|spring|summer)\s?\d+\b/gi, " ")
      .replace(/\bhead\s?shot\b/gi, " ")
      .replace(/-/g, " "),
  );

function withTimeout<T>(p: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error(message)), ms);
    p.then((v) => (clearTimeout(t), res(v)), (e) => (clearTimeout(t), rej(e)));
  });
}

async function main() {
  if (!existsSync(ROOT)) {
    console.error(`✗ Folder not found: ${ROOT}`);
    process.exit(1);
  }
  const sectors = await client.fetch<Sector[]>(`*[_type == "sector" && !(_id in path("drafts.**"))]{
    name,
    "director": director->{ _id, name, "ref": photo.asset._ref },
    "members": members[]->{ _id, name, "ref": photo.asset._ref }
  }`);
  const byFolder = new Map(sectors.map((s) => [norm(s.name), s]));

  const jobs: { file: string; person: NonNullable<P>; sector: string }[] = [];
  const problems: string[] = [];
  const covered = new Set<string>();

  for (const folder of readdirSync(ROOT).filter((f) => statSync(join(ROOT, f)).isDirectory())) {
    const sector = byFolder.get(FOLDER_ALIASES[norm(folder)] ?? norm(folder));
    if (!sector) {
      problems.push(`Folder "${folder}" doesn't match a sector in Sanity. Skipped.`);
      continue;
    }
    const people = [sector.director, ...(sector.members ?? [])].filter((p): p is NonNullable<P> => !!p);
    for (const file of readdirSync(join(ROOT, folder)).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))) {
      const raw = nameFromFile(file);
      const want = NAME_ALIASES[raw] ?? raw;
      let match = people.filter((p) => nameOnly(p.name) === want);
      // e.g. "Maemi Carillo" → "Maemi Carillo-Inagaki"
      if (!match.length) match = people.filter((p) => nameOnly(p.name).startsWith(want + " "));
      if (match.length !== 1) {
        problems.push(`${folder}/${file}: no unique match in ${sector.name}. Skipped.`);
        continue;
      }
      jobs.push({ file: join(ROOT, folder, file), person: match[0], sector: sector.name });
      covered.add(match[0]._id);
    }
  }

  console.log(`\nFolder: ${ROOT}\nPhotos matched: ${jobs.length}`);
  problems.forEach((p) => console.log(`  ! ${p}`));
  const missing = sectors.flatMap((s) =>
    [s.director, ...(s.members ?? [])]
      .filter((p): p is NonNullable<P> => !!p && !covered.has(p._id) && !p.ref)
      .map((p) => `${p.name} (${s.name})`),
  );
  if (missing.length) console.log(`\nStill without a photo: ${missing.join(", ")}`);
  if (dryRun) {
    jobs.forEach((j) => console.log(`  ${j.sector}: ${basename(j.file)} → ${j.person.name}`));
    console.log("\nDry run: nothing was changed.");
    return;
  }

  const tmp = mkdtempSync(join(tmpdir(), "ruif-photos-"));
  let updated = 0;
  let same = 0;
  const failed: string[] = [];
  for (const [i, j] of jobs.entries()) {
    process.stdout.write(`Photo ${i + 1}/${jobs.length}: ${j.person.name} … `);
    try {
      let path = j.file;
      if (/\.heic$/i.test(path)) {
        const out = join(tmp, `${basename(path, extname(path))}.jpg`);
        execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", path, "--out", out], { stdio: "ignore" });
        path = out;
      }
      const data = await withTimeout(readFile(path), 60_000, "reading the file took too long");
      const asset = await withTimeout(
        client.assets.upload("image", data, { filename: `${j.person.name}${extname(path).toLowerCase()}` }),
        120_000,
        "upload took too long",
      );
      if (asset._id === j.person.ref) {
        same++;
        console.log("unchanged");
        continue;
      }
      const photo = { _type: "photo", asset: { _type: "reference", _ref: asset._id }, alt: j.person.name };
      const tx = client.transaction().patch(j.person._id, (p) => p.set({ photo }));
      // Keep an unpublished Studio draft of this person in step, if there is one.
      const draftId = `drafts.${j.person._id}`;
      if (await client.getDocument(draftId)) tx.patch(draftId, (p) => p.set({ photo }));
      await tx.commit();
      updated++;
      console.log("✓");
    } catch (err) {
      failed.push(`${basename(j.file)} (${(err as Error).message})`);
      console.log("skipped");
    }
  }

  console.log(`\n✓ ${updated} photo(s) updated, ${same} already up to date.`);
  if (failed.length) {
    console.log("\nSkipped (everything else was saved):");
    failed.forEach((f) => console.log(`  - ${f}`));
    console.log(
      'If a photo is stored only in iCloud, right-click the Sectors folder in Finder → "Keep Downloaded", then run this again.',
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Import failed:", err.message ?? err);
    process.exit(1);
  });
