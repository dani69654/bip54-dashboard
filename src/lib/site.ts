/**
 * Canonical origin for metadata, sitemap, robots and OG images.
 * Override with NEXT_PUBLIC_SITE_URL (no trailing slash) when needed.
 *
 * Production defaults to https://bip-54.com so Cloudflare/OpenNext builds
 * stay indexable even if the env var was forgotten at deploy time.
 * Local `next dev` keeps localhost so preview crawls stay blocked.
 */
const PRODUCTION_URL = "https://bip-54.com";
const LOCAL_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : LOCAL_URL;
}

export const SITE = {
  url: resolveSiteUrl(),
  name: "BIP54 Dashboard",
  /** Used as the og:site_name and in the title template. */
  shortName: "BIP54 Dashboard",
  locale: "en_US",
  /** Set to a real handle to emit twitter:creator, or leave empty. */
  twitter: "",
} as const;

export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True for a public non-localhost origin — gates robots.txt allow. */
export const IS_PRODUCTION_ORIGIN = !/localhost|127\.0\.0\.1/i.test(SITE.url);
