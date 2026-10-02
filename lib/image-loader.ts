"use client";

/**
 * next/image loader (configured in next.config.ts).
 *
 * Sanity photos are resized, re-encoded (WebP/AVIF) and cached by Sanity's
 * global image CDN straight from the original upload: one compression step,
 * fast worldwide, and the traffic counts against Sanity's free bandwidth
 * rather than Netlify's.
 *
 * Local files in /public (logo, fallbacks) are served as they are.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("fit", "max");
    url.searchParams.set("auto", "format");
    return url.toString();
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
