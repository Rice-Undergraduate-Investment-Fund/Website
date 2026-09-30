/**
 * Sanity Studio, the content editor for officers, at /studio.
 * Log in with the Sanity account that has access to the RUIF project.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
