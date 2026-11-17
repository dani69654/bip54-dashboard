import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Source_Sans_3, Space_Grotesk } from "next/font/google";
import { Nav } from "@/components/Nav";
import { BIP54 } from "@/lib/bip54";
import { SITE, absoluteUrl } from "@/lib/site";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "BIP54 — Bitcoin Consensus Cleanup soft fork dashboard",
    template: `%s — ${SITE.shortName}`,
  },
  description:
    "BIP54 (Consensus Cleanup) dashboard: live mining-pool coinbase compatibility, activation status, the four consensus fixes BIP54 closes, and interactive simulations.",
  applicationName: SITE.name,
  authors: [{ name: "BIP54 Dashboard" }],
  creator: "BIP54 Dashboard",
  category: "technology",
  keywords: [
    "BIP54",
    "BIP 54",
    "Consensus Cleanup",
    "Bitcoin soft fork",
    "timewarp attack",
    "64-byte transactions",
    "legacy sigops limit",
    "duplicate coinbase",
    "coinbase nLockTime",
    "BIP30",
    "BIP34",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: absoluteUrl("/"),
    title: "BIP54 — Bitcoin Consensus Cleanup soft fork dashboard",
    description:
      "Live pool readiness, activation status, the four consensus fixes, and interactive simulations of the bugs BIP54 closes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIP54 — Bitcoin Consensus Cleanup soft fork dashboard",
    description:
      "Live pool readiness, activation status, and interactive simulations of the bugs BIP54 closes.",
    ...(SITE.twitter ? { creator: SITE.twitter } : {}),
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    // Bing (and therefore DuckDuckGo) reads this, not googlebot.
    bingbot:
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  colorScheme: "dark",
};

/**
 * Cloudflare Web Analytics site token (public — it ends up in the HTML anyway).
 * Find it in Cloudflare → Analytics & Logs → Web Analytics → bip-54.com →
 * "Manage site" → JS snippet. Inlined at build time, so it must be set in the
 * build environment; the hardcoded fallback keeps CI builds tracked.
 */
const CF_BEACON_TOKEN =
  process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ?? "e583f3c38bcf4c0ab436f8fc5231b2de";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: absoluteUrl("/"),
  name: SITE.name,
  inLanguage: "en",
  description:
    "Educational dashboard and simulator for BIP54, the Bitcoin Consensus Cleanup soft fork proposal.",
  about: {
    "@type": "Thing",
    name: BIP54.title,
    sameAs: "https://github.com/bitcoin/bips/blob/master/bip-0054.md",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-8 text-sm text-fg-subtle">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Educational dashboard for{" "}
              <span className="text-fg-muted">BIP54 Consensus Cleanup</span>.
              Not financial advice.
            </p>
            <p className="font-mono text-xs">
              Soft fork · Security fixes · Learn by simulating
            </p>
          </div>
        </footer>
        {CF_BEACON_TOKEN ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({
              token: CF_BEACON_TOKEN,
              spa: true,
            })}
          />
        ) : null}
      </body>
    </html>
  );
}
