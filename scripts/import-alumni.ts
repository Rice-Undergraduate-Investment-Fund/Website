/**
 * Import alumni from the Excel template (or the Google Form's response sheet,
 * downloaded as .xlsx) into Sanity.
 *
 *   npm run import:alumni                       ← uses ../Alumni Directory/RUIF Alumni Template.xlsx
 *   npm run import:alumni -- "path/to/file.xlsx"
 *   npm run import:alumni -- --dry-run          ← check the file without changing anything
 *
 * - Columns are matched by header name (same headers in the template and the form).
 * - Each person becomes a PRIVATE record "alumni.<name>-<class>" (members-only).
 *   Importing the same person again updates them (later rows win, so the newest
 *   form submission counts).
 * - Headshots: ../Photos/Website/Alumni/<Full Name>.jpg|jpeg|png (override: --photos=<folder>).
 *   People without a new photo keep the one they already have.
 * - The "Firms" tab (if present) adds/updates Alumni Firms.
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local.
 */
import "./env";
import { createReadStream, existsSync, readdirSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { createClient } from "@sanity/client";
import readXlsxFile, { readSheetNames } from "read-excel-file/node";
import { apiVersion, dataset, projectId } from "../sanity/env";
import { RUIF_ROLES, normalizeFirm } from "../lib/content/types";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const photosArg = args.find((a) => a.startsWith("--photos="))?.slice("--photos=".length);
const fileArg = args.find((a) => !a.startsWith("--"));
const FILE = resolve(fileArg ?? "../Alumni Directory/RUIF Alumni Template.xlsx");
const PHOTOS = resolve(photosArg ?? "../Photos/Website/Alumni");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !dryRun) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const SECTORS = [
  "Communication & Sports", "Consumer Goods", "Energy", "Financials", "Healthcare", "Industrials",
  "Natural Resources", "Portfolio Review", "Power, Utilities & Infrastructure", "Real Estate", "Technology",
];
const CATEGORY: Record<string, "ib" | "pe" | "hf"> = {
  "investment banking": "ib",
  "private equity": "pe",
  "hedge funds & trading": "hf",
};

const slug = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Row = Record<string, string>;

/** A sheet as objects keyed by lower-case header ("full name", "class", …). */
async function readSheet(file: string, sheet: string): Promise<{ headers: string[]; rows: Row[] }> {
  const grid = await readXlsxFile(file, { sheet });
  const headers = (grid[0] ?? []).map((h) => String(h ?? "").trim().toLowerCase());
  const rows = grid.slice(1).map((cells, i) => {
    const r: Row = { __row: String(i + 2) };
    headers.forEach((h, j) => {
      const v = cells[j];
      if (h) r[h] = v == null ? "" : v instanceof Date ? v.toISOString() : String(v).trim();
    });
    return r;
  });
  return { headers, rows };
}

function findPhoto(name: string): string | undefined {
  if (!existsSync(PHOTOS)) return undefined;
  const want = name.toLowerCase();
  const files = readdirSync(PHOTOS).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const exact = files.find((f) => basename(f, extname(f)).toLowerCase() === want);
  return exact ? join(PHOTOS, exact) : undefined;
}

async function main() {
  if (!existsSync(FILE)) {
    console.error(`✗ File not found: ${FILE}`);
    process.exit(1);
  }
  // The people sheet: "Alumni" (template) or the first sheet with a "Full Name" column (form responses).
  const sheetNames = await readSheetNames(FILE);
  let people: Row[] | undefined;
  for (const name of ["Alumni", ...sheetNames.filter((n) => n !== "Alumni")]) {
    if (!sheetNames.includes(name)) continue;
    const sheet = await readSheet(FILE, name);
    if (sheet.headers.includes("full name")) {
      people = sheet.rows;
      break;
    }
  }
  if (!people) {
    console.error('✗ No sheet with a "Full Name" column found.');
    process.exit(1);
  }

  const problems: string[] = [];
  const notInFirms = new Set<string>();

  // ---- Firms tab → Alumni Firms ----
  const firmDocs: Record<string, unknown>[] = [];
  const firmsRows = sheetNames.includes("Firms") ? (await readSheet(FILE, "Firms")).rows : [];
  const knownFirms = new Set<string>(
    dryRun ? [] : await client.fetch<string[]>(`*[_type == "alumniFirm"].name`).catch(() => []),
  );
  {
    for (const r of firmsRows) {
      const name = r["company"];
      if (!name) continue;
      knownFirms.add(name);
      const industry = CATEGORY[(r["category"] ?? "").toLowerCase()];
      if (!industry) continue; // "Other" firms don't need an entry
      const tier = Math.min(4, Math.max(1, Number(r["row (1 = top)"]) || 1));
      firmDocs.push({
        _id: `alumniFirm-${industry}-${slug(name)}`,
        _type: "alumniFirm",
        name,
        industry,
        tier,
        showOnHome: (r["show on home page"] ?? "").toLowerCase() === "yes",
      });
    }
  }
  const knownNorm = new Set([...knownFirms].map((n) => normalizeFirm(n)));

  // ---- People ----
  const byId = new Map<string, Record<string, unknown>>();
  const photoFor = new Map<string, string>();
  for (const r of people) {
    const name = r["full name"];
    if (!name || /\(example\)/i.test(name)) continue;
    const where = `row ${r.__row} (${name})`;
    const classYear = Number(r["class"]);
    if (!Number.isInteger(classYear) || classYear < 2017 || classYear > 2040) {
      problems.push(`${where}: Class "${r["class"]}" is not a year. Skipped.`);
      continue;
    }
    const role = r["highest ruif role"];
    if (role && !RUIF_ROLES.includes(role as never)) problems.push(`${where}: unknown RUIF role "${role}" (kept as typed).`);
    const sector = SECTORS.includes(r["ruif sector"]) ? r["ruif sector"] : undefined;
    const company = r["current company"] || undefined;
    if (company && !knownNorm.has(normalizeFirm(company))) notInFirms.add(company);
    const linkedin = r["linkedin url"] && /^https?:\/\//i.test(r["linkedin url"]) ? r["linkedin url"] : undefined;

    const id = `alumni.${slug(name)}-${classYear}`;
    byId.set(id, {
      _id: id,
      _type: "alumnus",
      name,
      classYear,
      company,
      position: r["position"] || undefined,
      location: r["location"] || undefined,
      ruifRole: role || undefined,
      ruifSector: sector,
      linkedin,
      email: r["email"] || undefined,
      shareEmail: (r["share email"] ?? "").toLowerCase() === "yes",
      notes: r["notes"] || undefined,
    });
    const photo = findPhoto(name);
    if (photo) photoFor.set(id, photo);
  }

  console.log(`\nFile: ${FILE}`);
  console.log(`People: ${byId.size}   Photos found: ${photoFor.size}   Firms tab entries: ${firmDocs.length}`);
  if (notInFirms.size) console.log(`Shown under "Other" (not in Alumni Firms): ${[...notInFirms].join(", ")}`);
  problems.forEach((p) => console.log(`  ! ${p}`));
  if (dryRun) {
    console.log("\nDry run: nothing was changed.");
    return;
  }

  // Keep photos already in Sanity for people without a new file.
  const existing = new Map(
    (await client.fetch<{ _id: string; photo?: unknown }[]>(`*[_id in $ids]{ _id, photo }`, { ids: [...byId.keys()] })).map(
      (d) => [d._id, d.photo],
    ),
  );
  let uploaded = 0;
  for (const [id, doc] of byId) {
    const file = photoFor.get(id);
    if (file) {
      const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
      doc.photo = { _type: "photo", asset: { _type: "reference", _ref: asset._id }, alt: String(doc.name) };
      uploaded++;
    } else if (existing.get(id)) {
      doc.photo = existing.get(id);
    }
    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k];
  }

  const docs = [...firmDocs, ...byId.values()];
  for (let i = 0; i < docs.length; i += 50) {
    const tx = client.transaction();
    docs.slice(i, i + 50).forEach((d) => tx.createOrReplace(d as { _id: string; _type: string }));
    await tx.commit();
  }
  console.log(`\n✓ Imported ${byId.size} alumni (${uploaded} photos uploaded) and ${firmDocs.length} firms.`);
}

main().catch((err) => {
  console.error("✗ Import failed:", err.message ?? err);
  process.exit(1);
});
