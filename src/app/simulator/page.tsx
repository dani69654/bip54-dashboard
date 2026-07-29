import type { Metadata } from "next";
import { Suspense } from "react";
import { SimulatorClient } from "@/components/simulator/SimulatorClient";
import { BIP54 } from "@/lib/bip54";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "BIP54 problem simulator",
  description:
    "Interactive labs for the four bugs BIP54 fixes: the timewarp attack, slow-to-validate blocks, 64-byte Merkle ambiguity and duplicate coinbases — with BIP54 rules on or off.",
  alternates: { canonical: "/simulator" },
  openGraph: {
    type: "article",
    url: absoluteUrl("/simulator"),
    title: "BIP54 problem simulator",
    description:
      "Guided labs for the timewarp attack, slow-to-validate blocks, Merkle ambiguity and duplicate coinbases.",
  },
  twitter: {
    title: "BIP54 problem simulator",
    description:
      "Guided labs for the four consensus bugs BIP54 closes, with the new rules on or off.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": absoluteUrl("/simulator#app"),
  url: absoluteUrl("/simulator"),
  name: "BIP54 problem simulator",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any (web browser)",
  inLanguage: "en",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Interactive simulations of the timewarp attack, slow-to-validate blocks, Merkle tree ambiguity and duplicate coinbase transactions, with BIP54 consensus rules toggleable.",
  about: BIP54.fixes.map((fix) => ({ "@type": "Thing", name: fix.name })),
};

export default function SimulatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14">
        <section className="animate-fade-up mb-8 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-text">
            Interactive learning
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            BIP54 problem simulator
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            Each scenario starts with a short guided lesson, then a playground.
            Follow the steps, move the knobs, and toggle BIP54 to see the
            difference.
          </p>
        </section>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-14 text-fg-muted">
            Loading simulator…
          </div>
        }
      >
        <SimulatorClient />
      </Suspense>

      {/* Server-rendered so the scenario content is in the initial HTML. */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="font-display text-xl font-semibold">
          What each scenario shows
        </h2>
        <p className="mt-1 mb-5 text-sm text-fg-muted">
          The four consensus weaknesses BIP54 closes, and what the labs above
          demonstrate.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {BIP54.fixes.map((fix) => (
            <article key={fix.id} className="surface p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold">{fix.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {fix.summary}
              </p>
              <dl className="mt-3 grid gap-1.5 text-sm">
                <div>
                  <dt className="inline font-medium text-danger">Risk: </dt>
                  <dd className="inline text-fg-muted">{fix.impact}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-success">BIP54: </dt>
                  <dd className="inline text-fg-muted">{fix.fix}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
