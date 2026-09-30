/**
 * Sanity webhook target: makes published CMS edits appear immediately
 * (instead of within the 60-second fallback window).
 *
 * Setup: sanity.io/manage → project → API → Webhooks → Create webhook
 *   URL:     https://<your-site>/api/revalidate
 *   Dataset: production · Trigger on: Create, Update, Delete
 *   Secret:  same value as the SANITY_REVALIDATE_SECRET env var on Netlify
 */
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // Every content query is tagged "sanity" (lib/content/index.ts).
  // expire: 0 → the next visitor gets fresh content, never a stale page.
  revalidateTag("sanity", { expire: 0 });
  return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
}
