import type { MetadataRoute } from "next";
import { IS_PRODUCTION_ORIGIN, absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview/local builds without a configured origin stay out of the index.
  if (!IS_PRODUCTION_ORIGIN) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // DuckDuckGo snippets are served from Bing's index.
      { userAgent: "bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
