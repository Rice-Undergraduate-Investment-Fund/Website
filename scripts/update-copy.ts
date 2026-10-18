/**
 * One-off copy update (Oct 2026) for text that lives in Sanity rather than code.
 *
 *   npm run copy:update            ← apply
 *   npm run copy:update -- --dry-run
 *
 * Each change is only applied if the field still holds the old text, so running
 * it twice is harmless and edits made in the Studio since then are never overwritten.
 * Needs SANITY_API_WRITE_TOKEN in .env.local.
 */
import "./env";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

type Change = { doc: string; path: (string | number)[]; from: string; to: string };

const CHANGES: Change[] = [
  // Home + every page title
  {
    doc: "siteSettings",
    path: ["tagline"],
    from: "Rice University's Student-Run Investment Fund",
    to: "Rice University's Student Run Investment Fund",
  },
  // About: "From Training to Investment Decisions"
  { doc: "siteSettings", path: ["operatingModel", 0, "title"], from: "Training", to: "Training Program" },
  {
    doc: "siteSettings",
    path: ["operatingModel", 0, "description"],
    from: "Seven sessions covering accounting, finance and valuation prepare new members for the fund.",
    to: "Seven sessions that will teach you everything you need to know, from accounting to valuation techniques.",
  },
  {
    doc: "siteSettings",
    path: ["operatingModel", 1, "description"],
    from: "Graduates of the Training Program join one of the fund's sector teams.",
    to: "If successfully admitted into the fund, analysts join one of the sectors.",
  },
  {
    doc: "siteSettings",
    path: ["operatingModel", 3, "description"],
    from: "Members present stock ideas to the RUIF Board and investment professionals.",
    to: "Each sector presents its stock pitch to the RUIF Board and other investment professionals.",
  },
  {
    doc: "siteSettings",
    path: ["operatingModel", 4, "description"],
    from: "Selected sectors present their stock analyses to a panel of Virani Business School professors and RUIF alumni working in the industry.",
    to: "Select sectors present their stock pitches to a panel of Virani Business School professors and RUIF alumni working in the industry.",
  },
  // Training Program: "Your path into the fund" and the curriculum
  { doc: "trainingProgram", path: ["steps", 1, "title"], from: "Training Sessions", to: "Training Program" },
  { doc: "trainingProgram", path: ["steps", 2, "title"], from: "Complete Training", to: "Complete the Training Program" },
  { doc: "trainingProgram", path: ["steps", 3, "title"], from: "Pitch Interview", to: "Pitch Your Stock to the RUIF Board" },
  { doc: "trainingProgram", path: ["steps", 4, "title"], from: "Join a Sector", to: "Join the Fund" },
  {
    doc: "trainingProgram",
    path: ["sessions", 6, "description"],
    from: "Refining and practicing your pitch for the interview.",
    to: "Refining and practicing your stock pitch.",
  },
];

const dryRun = process.argv.includes("--dry-run");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const get = (obj: unknown, path: (string | number)[]) =>
  path.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string | number, unknown>)[k]), obj);
const toPath = (path: (string | number)[]) =>
  path.map((k, i) => (typeof k === "number" ? `[${k}]` : i ? `.${k}` : k)).join("");

async function main() {
  const ids = [...new Set(CHANGES.map((c) => c.doc))];
  // Published documents and any unpublished Studio drafts of them.
  const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, {
    ids: [...ids, ...ids.map((id) => `drafts.${id}`)],
  });
  let applied = 0;
  const tx = client.transaction();
  for (const d of docs) {
    const id = String(d._id);
    const base = id.replace(/^drafts\./, "");
    const set: Record<string, string> = {};
    for (const c of CHANGES.filter((c) => c.doc === base)) {
      const current = get(d, c.path);
      const label = `${id} → ${toPath(c.path)}`;
      if (current === c.to) console.log(`  = ${label} (already updated)`);
      else if (current === c.from) {
        set[toPath(c.path)] = c.to;
        console.log(`  ✓ ${label}: "${c.to}"`);
      } else console.log(`  ! ${label}: text differs from expected, left as is ("${String(current)}")`);
    }
    if (Object.keys(set).length) {
      tx.patch(id, (p) => p.set(set));
      applied += Object.keys(set).length;
    }
  }
  if (dryRun) return console.log(`\nDry run: ${applied} change(s) would be made.`);
  if (applied) await tx.commit();
  console.log(`\n✓ ${applied} change(s) saved. The site picks them up within a minute.`);
}

main().catch((err) => {
  console.error("✗ Failed:", err.message ?? err);
  process.exit(1);
});
