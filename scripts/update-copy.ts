/**
 * Copy updates for text that lives in Sanity rather than code.
 *
 *   npm run copy:update            ← apply
 *   npm run copy:update -- --dry-run
 *
 * Each change is only applied if the field still holds the old text, so running
 * it twice is harmless and edits made in the Studio since then are never overwritten.
 * Earlier rounds (Oct 2026) have already been applied; this list is the latest round.
 * Needs SANITY_API_WRITE_TOKEN in .env.local.
 */
import "./env";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

/** Change one field of a list item, found by its _key (stable even if items move). */
type Change = { doc: string; list: string; key: string; field: string; from: string; to: string };
/** Remove one list item, found by its _key, if its title still matches. */
type Removal = { doc: string; list: string; key: string; title: string };

const CHANGES: Change[] = [
  // Training Program → "Your path into the fund": merge the two training boxes
  {
    doc: "trainingProgram",
    list: "steps",
    key: "f07e54c8-3c2",
    field: "description",
    from: "Build core skills in accounting, valuation and markets.",
    to: "Attend seven weekly sessions where you will build core skills in accounting, valuation and markets.",
  },
  {
    doc: "trainingProgram",
    list: "steps",
    key: "f07e54c8-3c2",
    field: "title",
    from: "Complete the Training Program",
    to: "Successfully Complete the Training Program",
  },
  // Portfolio → investment process, "Research"
  {
    doc: "siteSettings",
    list: "investmentProcess",
    key: "0ec604dd-c05",
    field: "description",
    from: "Sector teams build a thesis on a company.",
    to: "Teams analyze trends within their sectors and begin narrowing down pitch ideas.",
  },
];

const REMOVALS: Removal[] = [
  // The separate "Training Program" box (now part of "Complete the Training Program")
  { doc: "trainingProgram", list: "steps", key: "3412b20e-e3a", title: "Training Program" },
];

const dryRun = process.argv.includes("--dry-run");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

type Item = { _key: string; title?: string } & Record<string, unknown>;
const item = (d: Record<string, unknown>, list: string, key: string) =>
  ((d[list] as Item[] | undefined) ?? []).find((i) => i._key === key);
const path = (list: string, key: string, field?: string) => `${list}[_key=="${key}"]${field ? `.${field}` : ""}`;

async function main() {
  const ids = [...new Set([...CHANGES, ...REMOVALS].map((c) => c.doc))];
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
    const unset: string[] = [];
    for (const c of CHANGES.filter((c) => c.doc === base)) {
      const current = item(d, c.list, c.key)?.[c.field];
      const label = `${id} → ${c.list} "${String(item(d, c.list, c.key)?.title ?? c.key)}" ${c.field}`;
      if (current === c.to) console.log(`  = ${label} (already updated)`);
      else if (current === c.from) {
        set[path(c.list, c.key, c.field)] = c.to;
        console.log(`  ✓ ${label}: "${c.to}"`);
      } else console.log(`  ! ${label}: text differs from expected, left as is ("${String(current)}")`);
    }
    for (const r of REMOVALS.filter((r) => r.doc === base)) {
      const it = item(d, r.list, r.key);
      if (!it) console.log(`  = ${id} → ${r.list} "${r.title}" (already removed)`);
      else if (it.title === r.title) {
        unset.push(path(r.list, r.key));
        console.log(`  ✓ ${id} → ${r.list}: removed "${r.title}"`);
      } else console.log(`  ! ${id} → ${r.list}: item is now "${String(it.title)}", left as is`);
    }
    if (Object.keys(set).length || unset.length) {
      tx.patch(id, (p) => {
        let q = p;
        if (Object.keys(set).length) q = q.set(set);
        if (unset.length) q = q.unset(unset);
        return q;
      });
      applied += Object.keys(set).length + unset.length;
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
