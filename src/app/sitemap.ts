import type { MetadataRoute } from "next";
import { BIP54 } from "@/lib/bip54";
import { absoluteUrl } from "@/lib/site";

/**
 * lastModified is tied to the data snapshot rather than the build time, so the
 * sitemap only changes when the content actually changes.
 */
const dataUpdatedAt = new Date(`${BIP54.poolReadiness.asOf}T00:00:00Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: dataUpdatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/simulator"),
      lastModified: dataUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
