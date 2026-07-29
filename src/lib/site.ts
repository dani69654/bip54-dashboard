/**
 * Canonical origin for metadata, sitemap, robots and OG images.
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment (no trailing slash).
 */
const FALLBACK_URL = "http://localhost:3000";

export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, ""),
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

/** True once a real origin is configured — guards indexability of previews. */
export const IS_PRODUCTION_ORIGIN = SITE.url !== FALLBACK_URL;
