import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";
import { isIndexable } from "@/lib/presentation";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const site = loadContent().site;
  if (!isIndexable(site.deployment.productionEnabled, process.env.VERCEL_ENV)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
