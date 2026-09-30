import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos uploaded through Sanity Studio are served from Sanity's CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
