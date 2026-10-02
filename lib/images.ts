/**
 * Quality for photos rendered with next/image (banners, page photos, headshots).
 * Sanity's CDN encodes once from the original upload, so 82 is visually
 * lossless while keeping files small. Listed in `images.qualities` in next.config.ts.
 */
export const PHOTO_QUALITY = 82;
