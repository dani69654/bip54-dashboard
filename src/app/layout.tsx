import type { Metadata, Viewport } from "next";
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
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  colorScheme: "dark",
};

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
      </body>
    </html>
  );
}
