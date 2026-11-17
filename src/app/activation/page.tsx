import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/PageHeader";
import { BIP54 } from "@/lib/bip54";
import { absoluteUrl } from "@/lib/site";

const title = "BIP54 activation status: signaling, timeline and pool readiness";
const description =
  "Where Bitcoin's Consensus Cleanup soft fork stands: activation method, signaling status, which mining pools already produce BIP54-compatible blocks, and the road to activation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/activation" },
  openGraph: {
    type: "article",
    url: absoluteUrl("/activation"),
    title,
    description,
    modifiedTime: BIP54.poolReadiness.asOf,
  },
  twitter: { title, description },
};

const { activation, poolReadiness, milestones } = BIP54;
const pools = [...poolReadiness.pools].sort(
  (a, b) => b.compatibleBlocks - a.compatibleBlocks,
);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": absoluteUrl("/activation#article"),
  url: absoluteUrl("/activation"),
  headline: title,
  description,
  inLanguage: "en",
  dateModified: poolReadiness.asOf,
  isPartOf: { "@id": absoluteUrl("/#website") },
  about: {
    "@type": "Thing",
    name: BIP54.title,
    sameAs: "https://github.com/bitcoin/bips/blob/master/bip-0054.md",
  },
};

const steps = [
  {
    label: "Specification",
    state: "done",
    detail: `BIP54 merged into bitcoin/bips (2025) and marked ${BIP54.status}.`,
  },
  {
    label: "Implementation",
    state: "done",
    detail:
      "Bitcoin Core pull request implements the rules on regtest, without mainnet activation parameters.",
  },
  {
    label: "Miner readiness",
    state: "progress",
    detail: `~${poolReadiness.recentSharePct}% of recent blocks already use BIP54-compatible coinbases.`,
  },
  {
    label: "Activation method",
    state: "todo",
    detail: activation.method + ". Community discussion ongoing.",
  },
  {
    label: "Signaling",
    state: "todo",
    detail: `${activation.signaling}. Threshold: ${activation.threshold}.`,
  },
  {
    label: "Enforcement",
    state: "todo",
    detail: "Rules enforced on mainnet after a successful activation.",
  },
] as const;

const stateStyle = {
  done: { dot: "bg-success", text: "text-success", label: "Done" },
  progress: { dot: "bg-warning", text: "text-warning", label: "In progress" },
  todo: { dot: "bg-fg-subtle", text: "text-fg-subtle", label: "Not started" },
} as const;

export default function ActivationPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ name: "Activation", href: "/activation" }]} />
      <PageHeader
        eyebrow={`Status as of ${poolReadiness.asOf}`}
        title="BIP54 activation status"
        lead="BIP54 is fully specified and implemented, but not yet scheduled for activation on mainnet. No version bit has been assigned and signaling hasn't started. Meanwhile, a large share of miners already produce blocks compatible with its new coinbase rule."
      />

      <dl className="mb-12 grid gap-3 sm:grid-cols-3">
        <div className="surface p-4">
          <dt className="text-xs text-fg-subtle">Proposal status</dt>
          <dd className="mt-1 font-display text-xl font-semibold">{BIP54.status}</dd>
        </div>
        <div className="surface p-4">
          <dt className="text-xs text-fg-subtle">Formal signaling</dt>
          <dd className="mt-1 font-display text-xl font-semibold text-warning">
            {activation.signaling}
          </dd>
        </div>
        <div className="surface p-4">
          <dt className="text-xs text-fg-subtle">Recent blocks compatible</dt>
          <dd className="mt-1 font-display text-xl font-semibold text-success">
            ~{poolReadiness.recentSharePct}%
          </dd>
        </div>
      </dl>

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 font-display text-2xl font-semibold">Road to activation</h2>
        <ol className="grid gap-3">
          {steps.map((step, i) => {
            const s = stateStyle[step.state];
            return (
              <li key={step.label} className="surface flex gap-4 p-4">
                <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium text-fg">{step.label}</span>
                    <span className={`flex items-center gap-1.5 text-xs ${s.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted">{activation.note}</p>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-2xl font-semibold">
          Which mining pools are BIP54-ready?
        </h2>
        <p className="mt-2 mb-5 max-w-3xl text-fg-muted">
          These pools have mined coinbases with nLockTime = height − 1, the one
          BIP54 rule that needs miners to change their software. This shows
          readiness, not a vote. Snapshot from {poolReadiness.sourceLabel}; the{" "}
          <Link href="/" className="text-accent-text hover:underline">
            dashboard
          </Link>{" "}
          has the live figures.
        </p>
        <div className="surface overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-fg-subtle">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Pool</th>
                <th className="px-4 py-3 font-medium">First compatible block</th>
                <th className="px-4 py-3 text-right font-medium">Compatible blocks</th>
              </tr>
            </thead>
            <tbody>
              {pools.map((pool) => (
                <tr key={pool.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-fg">{pool.name}</td>
                  <td className="px-4 py-3 text-fg-muted">
                    <span className="font-mono">{pool.firstHeight.toLocaleString("en-US")}</span>{" "}
                    · {pool.firstDate}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-fg">
                    {pool.compatibleBlocks.toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 font-display text-2xl font-semibold">History</h2>
        <ol className="grid gap-4 border-l border-border pl-5">
          {milestones.map((m) => (
            <li key={m.year}>
              <p className="font-mono text-xs text-accent-text">{m.year}</p>
              <p className="font-medium text-fg">{m.label}</p>
              <p className="mt-0.5 text-sm text-fg-muted">{m.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-3xl">
        <h2 className="mb-3 font-display text-2xl font-semibold">How activation could work</h2>
        <p className="mb-4 leading-relaxed text-fg-muted">
          Earlier Bitcoin soft forks such as SegWit and Taproot were activated
          with version-bit signaling: miners set a bit in the block header, and
          once enough blocks in a 2,016-block period signal (90–95% in past
          deployments), the new rules lock in and are enforced after a grace
          period. BIP54 will probably follow a similar route, but the exact
          parameters, and whether to use BIP9, BIP8 or a variant like Speedy
          Trial, are still being discussed.
        </p>
        <p className="leading-relaxed text-fg-muted">
          Common questions about timing and who must upgrade are answered in
          the{" "}
          <Link href="/faq" className="text-accent-text hover:underline">
            BIP54 FAQ
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
