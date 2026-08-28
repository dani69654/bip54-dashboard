import type { MetadataRoute } from "next";
import { BIP54 } from "@/lib/bip54";
import { absoluteUrl } from "@/lib/site";

/**
 * lastModified tracks the data snapshot, but must also advance when crawl
 * directives change. Bing/DuckDuckGo otherwise keep a "site won't allow us"
 * snippet from an older robots.txt that disallowed crawling.
 */
const dataUpdatedAt = new Date(`${BIP54.poolReadiness.asOf}T00:00:00Z`);
const crawlDirectivesUpdatedAt = new Date("2026-08-28T00:00:00Z");
const lastModified =
  dataUpdatedAt > crawlDirectivesUpdatedAt
    ? dataUpdatedAt
    : crawlDirectivesUpdatedAt;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/simulator"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
