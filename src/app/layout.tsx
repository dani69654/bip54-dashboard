import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Space_Grotesk } from "next/font/google";
import { Nav } from "@/components/Nav";
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
  title: "BIP54 Dashboard — Consensus Cleanup",
  description:
    "Track BIP54 signaling progress, explore the Consensus Cleanup proposal, and simulate the problems it fixes.",
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
