import type { MetadataRoute } from "next";
import { isLiveSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return isLiveSite
    ? { rules: { userAgent: "*", allow: "/", disallow: "/studio" } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
