import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "../env";

/** Read-only client for the public website (published content only). */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Next.js caches responses itself; skipping the CDN keeps edits fresh
  perspective: "published",
});

const builder = createImageUrlBuilder({ projectId, dataset });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source);
