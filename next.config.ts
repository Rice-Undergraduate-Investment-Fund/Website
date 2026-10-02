import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity photos are resized by Sanity's image CDN (see lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    qualities: [75, 82],
  },
};

export default nextConfig;
