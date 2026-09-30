/**
 * Remove all placeholder people (IDs starting with "placeholder-") created by
 * `npm run seed`, after first unlinking them from sectors.
 *
 *   npm run seed:clean
 *
 * Real people you added in the Studio are never touched.
 */
import "./env";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const isPlaceholder = (id?: string) => !!id && id.replace(/^drafts\./, "").startsWith("placeholder-");

async function main() {
  const sectors = await client.fetch<{ _id: string; director?: { _ref: string }; members?: { _key: string; _ref: string }[] }[]>(
    `*[_type == "sector"]{ _id, director, members }`,
  );
  const tx = client.transaction();
  for (const s of sectors) {
    const patch: { unset?: string[]; set?: Record<string, unknown> } = {};
    if (isPlaceholder(s.director?._ref)) patch.unset = ["director"];
    const members = (s.members ?? []).filter((m) => !isPlaceholder(m._ref));
    if (members.length !== (s.members ?? []).length) patch.set = { members };
    if (patch.unset || patch.set) tx.patch(s._id, patch);
  }
  await tx.commit();

  const ids = await client.fetch<string[]>(`*[_type == "person" && string::startsWith(_id, "placeholder-")]._id`);
  const del = client.transaction();
  ids.forEach((id) => del.delete(id));
  await del.commit();
  console.log(`✓ Removed ${ids.length} placeholder people.`);
}

main().catch((err) => {
  console.error("✗ Failed:", err.message);
  process.exit(1);
});
