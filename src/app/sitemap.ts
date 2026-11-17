import type { MetadataRoute } from "next";
import { BIP54 } from "@/lib/bip54";
import { absoluteUrl } from "@/lib/site";
import { TOPICS, TOPICS_UPDATED_AT } from "@/lib/topics";

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
    {
      url: absoluteUrl("/activation"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: new Date(`${TOPICS_UPDATED_AT}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...TOPICS.map((topic) => ({
      url: absoluteUrl(`/${topic.slug}`),
      lastModified: new Date(`${TOPICS_UPDATED_AT}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
