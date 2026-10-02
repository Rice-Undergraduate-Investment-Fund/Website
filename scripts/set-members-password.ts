/**
 * Set the members-only password (also editable in the Studio:
 * Alumni Directory → Members password).
 *
 *   npm run members:password -- "NewPassword"
 *
 * Stored in the private document "private.membersAccess", which Sanity never
 * serves to anonymous visitors. Changing it signs everyone out.
 */
import "./env";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

const password = process.argv.slice(2).find((a) => !a.startsWith("--"));
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!password || password.length < 6) {
  console.error('✗ Usage: npm run members:password -- "AtLeast6Characters"');
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}

createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  .createOrReplace({ _id: "private.membersAccess", _type: "membersAccess", password })
  .then(() => console.log("✓ Members password updated."))
  .catch((err) => {
    console.error("✗ Failed:", err.message);
    process.exit(1);
  });
