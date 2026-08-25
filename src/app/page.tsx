import Link from "next/link";
import { BlockChainStrip } from "@/components/BlockChainStrip";
import { LivePoolReadiness } from "@/components/LivePoolReadiness";
import { BIP54 } from "@/lib/bip54";
import { POOL_READINESS_FALLBACK } from "@/lib/pool-readiness";
import { absoluteUrl } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": absoluteUrl("/#article"),
      url: absoluteUrl("/"),
      headline: "BIP54 Consensus Cleanup: status, readiness and what it fixes",
      description:
        "Overview of BIP54, the four consensus weaknesses it fixes, its activation status, and how many mainnet blocks already carry BIP54-compatible coinbases.",
      inLanguage: "en",
      dateModified: BIP54.poolReadiness.asOf,
      about: {
        "@type": "Thing",
        name: BIP54.title,
        sameAs: "https://github.com/bitcoin/bips/blob/master/bip-0054.md",
      },
      citation: BIP54.resources.map((resource) => ({
        "@type": "CreativeWork",
        name: resource.title,
        url: resource.href,
      })),
    },
    {
      "@type": "Dataset",
      "@id": absoluteUrl("/#pool-readiness"),
      name: "Mining pools with BIP54-compatible coinbases",
      description:
        "Per-pool first block height, date and all-time count of mainnet coinbase transactions with nLockTime = height − 1, plus the share of recent blocks.",
      inLanguage: "en",
      temporalCoverage: `2026-02-19/${BIP54.poolReadiness.asOf}`,
      dateModified: BIP54.poolReadiness.asOf,
      isAccessibleForFree: true,
      license: "https://opensource.org/licenses/MIT",
      sameAs: BIP54.poolReadiness.chartHref,
      creator: {
        "@type": "Organization",
        name: BIP54.poolReadiness.sourceLabel,
        url: BIP54.poolReadiness.sourceHref,
      },
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "text/csv",
          contentUrl: BIP54.poolReadiness.poolsHref,
        },
      ],
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="animate-fade-up mb-12 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-text">
          Bitcoin soft fork proposal
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          {BIP54.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-fg-muted">
          {BIP54.tagline} Track readiness, understand each fix, and try
          interactive simulations of the problems BIP54 closes.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/simulator"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-[#1a140c] transition hover:brightness-110"
          >
            Open simulator
          </Link>
          <a
            href="https://github.com/bitcoin/bips/blob/master/bip-0054.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border-strong px-5 py-2.5 text-sm text-fg-muted transition hover:border-accent/40 hover:text-fg"
          >
            Read the BIP
          </a>
        </div>
      </section>

      <div className="mb-8 hairline" />

      <BlockChainStrip />

      <LivePoolReadiness initial={POOL_READINESS_FALLBACK} />

      <section className="mb-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              What BIP54 fixes
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              Four related consensus weaknesses, one soft fork
            </p>
          </div>
          <Link
            href="/simulator"
            className="hidden text-sm text-accent-text transition hover:underline sm:inline"
          >
            Try each in the simulator →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {BIP54.fixes.map((fix, index) => (
            <article key={fix.id} className="surface p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-xs text-fg-subtle">
                  0{index + 1}
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {fix.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">
                {fix.summary}
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-lg bg-danger-soft px-3 py-2 text-danger">
                  <span className="font-medium">Risk: </span>
                  {fix.impact}
                </div>
                <div className="rounded-lg bg-success-soft px-3 py-2 text-success">
                  <span className="font-medium">BIP54: </span>
                  {fix.fix}
                </div>
              </div>
              <Link
                href={`/simulator?scenario=${fix.id}`}
                className="mt-4 inline-flex text-sm text-accent-text transition hover:underline"
              >
                Simulate this problem →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="font-display text-xl font-semibold">Official resources</h2>
        <p className="mt-1 mb-5 text-sm text-fg-muted">
          Specs, explainers, live stats, and implementation tracking
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BIP54.resources.map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="surface group p-5 transition hover:border-accent/30"
            >
              <div className="font-medium text-fg group-hover:text-accent-text">
                {r.title}
              </div>
              <p className="mt-1.5 text-sm text-fg-muted">{r.description}</p>
              <span className="mt-3 inline-block font-mono text-xs text-fg-subtle">
                External link ↗
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
