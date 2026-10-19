/**
 * Upload investment memos (PDFs) to their holdings in Sanity.
 *
 *   npm run import:memos                 ← uses ../Memos
 *   npm run import:memos -- --dry-run    ← check matches without uploading
 *   npm run import:memos -- --only       ← also remove memos whose PDF is no longer in the folder
 *
 * A PDF is matched to a holding by the ticker at the start of its file name
 * ("GAP_Memo_vFinal.pdf" → GAP) or, failing that, by the company name. Holdings
 * with a memo appear under "Selected positions" on the Portfolio page.
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local.
 */
import "./env";
import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const only = args.includes("--only");
const folderArg = args.find((a) => !a.startsWith("--"));
const FOLDER = resolve(folderArg ?? "../Memos");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !dryRun) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const simple = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

type H = { _id: string; company: string; ticker: string; memoRef?: string };

async function main() {
  if (!existsSync(FOLDER)) {
    console.error(`✗ Folder not found: ${FOLDER}`);
    process.exit(1);
  }
  const holdings = await client.fetch<H[]>(
    `*[_type == "holding" && !(_id in path("drafts.**"))]{ _id, company, ticker, "memoRef": memo.asset._ref }`,
  );
  const files = readdirSync(FOLDER).filter((f) => /\.pdf$/i.test(f));
  const matched = new Map<string, { file: string; h: H }>();

  for (const file of files) {
    const first = basename(file).split(/[\s_\-.]+/)[0];
    let h = holdings.find((x) => simple(x.ticker) === simple(first));
    if (!h) h = holdings.find((x) => simple(file).startsWith(simple(x.company)));
    if (!h) {
      console.log(`  ! ${file}: no holding matches (name it "<TICKER>_…pdf"). Skipped.`);
      continue;
    }
    matched.set(h._id, { file, h });
  }

  console.log(`\nFolder: ${FOLDER}\nMemos matched: ${matched.size}`);
  matched.forEach(({ file, h }) => console.log(`  ${h.ticker} (${h.company}) ← ${file}`));
  const stale = only ? holdings.filter((h) => h.memoRef && !matched.has(h._id)) : [];
  if (stale.length) console.log(`Memos to remove: ${stale.map((h) => h.ticker).join(", ")}`);
  if (dryRun) return console.log("\nDry run: nothing was changed.");

  for (const { file, h } of matched.values()) {
    process.stdout.write(`Uploading ${file} … `);
    const asset = await client.assets.upload("file", await readFile(join(FOLDER, file)), {
      filename: `${h.company} (${h.ticker}) memo.pdf`,
      contentType: "application/pdf",
    });
    if (asset._id === h.memoRef) {
      console.log("unchanged");
      continue;
    }
    await client
      .patch(h._id)
      .set({ memo: { _type: "file", asset: { _type: "reference", _ref: asset._id } } })
      .commit();
    console.log("✓");
  }
  for (const h of stale) {
    await client.patch(h._id).unset(["memo"]).commit();
    console.log(`Removed memo from ${h.ticker}`);
  }
  console.log("\n✓ Done. The Portfolio page updates within a minute.");
}

main().catch((err) => {
  console.error("✗ Failed:", err.message ?? err);
  process.exit(1);
});
