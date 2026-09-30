import type { ImageAsset } from "./content";

/**
 * Site photography used in page layouts (heroes, feature images).
 * Will move to Sanity-managed images once the CMS is connected.
 */
export const photos = {
  boardWide: {
    src: "/images/board-2026-wide.jpg",
    alt: "The 2026–27 RUIF Board",
    width: 2400,
    height: 1500,
    position: "50% 18%",
  },
  board: {
    src: "/images/board-2026.jpg",
    alt: "The 2026–27 RUIF Board",
    width: 1600,
    height: 2400,
    position: "50% 62%",
  },
  presidentVpWide: {
    src: "/images/president-vp-wide.jpg",
    alt: "RUIF President and Vice President",
    width: 2400,
    height: 1500,
    position: "55% 20%",
  },
  presidentVp: {
    src: "/images/president-vp.jpg",
    alt: "RUIF President and Vice President",
    width: 1600,
    height: 2400,
    position: "50% 62%",
  },
  trainingWide: {
    src: "/images/training-directors-wide.jpg",
    alt: "RUIF Training Directors",
    width: 2400,
    height: 1500,
    position: "55% 20%",
  },
  training: {
    src: "/images/training-directors.jpg",
    alt: "RUIF Training Directors",
    width: 1600,
    height: 2400,
    position: "50% 60%",
  },
} satisfies Record<string, ImageAsset>;
