import Link from "next/link";
import { BIP54 } from "@/lib/bip54";

export default function DashboardPage() {
  const readiness = BIP54.poolReadiness;
  const totalCompatibleBlocks = readiness.pools.reduce(
    (sum, pool) => sum + pool.compatibleBlocks,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
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

      <section className="animate-fade-up-delay-1 mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Proposal status"
          value={BIP54.status}
          hint="In bitcoin/bips as Complete"
        />
        <Stat
          label="Formal signaling"
          value={BIP54.activation.signaling}
          hint="No activation bit yet"
          tone="warning"
        />
        <Stat
          label="Recent blocks compatible"
          value={`~${readiness.recentSharePct}%`}
          hint={`Coinbase locktime · as of ${readiness.asOf}`}
          tone="good"
        />
        <Stat
          label="Author"
          value={BIP54.author}
          hint={`with ${BIP54.coAuthor}`}
        />
      </section>

      <section className="animate-fade-up-delay-2 mb-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="surface p-6 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold">
                Readiness vs signaling
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                Two different things — easy to confuse
              </p>
            </div>
            <span className="rounded-full bg-warning/15 px-3 py-1 font-mono text-xs text-warning">
              Pre-activation
            </span>
          </div>

          <div className="mb-6 space-y-4">
            <ProgressRow
              label="Version-bit signaling (formal)"
              value={0}
              caption="Not started — activation method and bit still TBD"
            />
            <ProgressRow
              label="BIP54-compatible coinbases"
              value={readiness.recentSharePct}
              caption={`~${readiness.recentSharePct}% of recent blocks set nLockTime = height − 1 (${readiness.sourceLabel}, ${readiness.asOf})`}
              tone="good"
            />
          </div>

          <dl className="mb-6 grid gap-3 text-sm sm:grid-cols-2">
            <div className="surface-muted p-4">
              <dt className="text-fg">Specification</dt>
              <dd className="mt-1 text-fg-muted">
                BIP54 is marked{" "}
                <span className="text-fg">{BIP54.status}</span> in
                bitcoin/bips — spec text and rationale are final.
              </dd>
            </div>
            <div className="surface-muted p-4">
              <dt className="text-fg">Implementation</dt>
              <dd className="mt-1 text-fg-muted">
                Bitcoin Core PR{" "}
                <span className="font-mono text-xs">#35793</span> is open
                (validation rules without mainnet activation); Signet demos of
                slow-to-validate blocks exist.
              </dd>
            </div>
          </dl>

          <div className="surface-muted p-4 text-sm leading-relaxed text-fg-muted">
            <p className="mb-2 font-medium text-fg">
              Important distinction
            </p>
            <p>
              Pools setting a BIP54-compatible coinbase are showing{" "}
              <span className="text-fg">forward-compatibility</span> (they can
              already produce valid blocks under the proposed rule). That is{" "}
              <span className="text-fg">not</span> the same as voting for
              activation with a version bit.{" "}
              {BIP54.activation.note}
            </p>
            <p className="mt-2 text-fg-subtle">
              Typical historical threshold once signaling starts:{" "}
              {BIP54.activation.threshold}
            </p>
          </div>
        </div>

        <div className="surface p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold">Timeline</h2>
          <p className="mt-1 mb-6 text-sm text-fg-muted">
            From early draft to pool adoption
          </p>
          <ol className="space-y-5">
            {BIP54.milestones.map((m, i) => (
              <li key={m.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      i === BIP54.milestones.length - 1
                        ? "bg-accent animate-pulse-soft"
                        : "bg-border-strong"
                    }`}
                  />
                  {i < BIP54.milestones.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-1">
                  <div className="font-mono text-xs text-accent-text">
                    {m.year}
                  </div>
                  <div className="mt-0.5 font-medium text-fg">{m.label}</div>
                  <p className="mt-1 text-sm text-fg-muted">{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="animate-fade-up-delay-3 mb-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Mining pools with BIP54-compatible coinbases
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-fg-muted">
              First time each pool mined a coinbase with{" "}
              <span className="font-mono text-accent-text">
                nLockTime = height − 1
              </span>
              , and all-time compatible-block counts (
              {totalCompatibleBlocks.toLocaleString()} in total). From{" "}
              {readiness.sourceLabel} as of {readiness.asOf}.
            </p>
          </div>
          <a
            href={readiness.poolsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-text transition hover:underline"
          >
            Raw pool CSV ↗
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr] gap-2 border-b border-border bg-bg-muted px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle sm:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_1.4fr]">
            <span>Pool</span>
            <span>First height</span>
            <span>First date</span>
            <span>Blocks</span>
            <span className="hidden sm:inline">Note</span>
          </div>
          {readiness.pools.map((pool) => (
            <div
              key={pool.name}
              className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr] gap-2 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_1.4fr]"
            >
              <span className="font-medium text-fg">{pool.name}</span>
              <span className="font-mono text-xs text-fg-muted">
                {pool.firstHeight.toLocaleString()}
              </span>
              <span className="font-mono text-xs text-fg-muted">
                {pool.firstDate}
              </span>
              <span className="font-mono text-xs text-accent-text">
                {pool.compatibleBlocks.toLocaleString()}
              </span>
              <span className="col-span-4 text-xs text-fg-subtle sm:col-span-1 sm:mt-0">
                {pool.note}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
          {readiness.recentShareNote} Live charts:{" "}
          <a
            href={readiness.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-text hover:underline"
          >
            {readiness.sourceLabel}
          </a>
          . Only coinbases whose nLockTime equals exactly{" "}
          <span className="font-mono">height − 1</span> are counted — pools that
          set the field to some other value for their own purposes do not appear
          here.
        </p>
      </section>

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

function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "warning" | "good";
}) {
  return (
    <div className="surface p-4 sm:p-5">
      <div className="text-xs uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div
        className={`mt-2 font-display text-xl font-semibold ${
          tone === "warning"
            ? "text-warning"
            : tone === "good"
              ? "text-success"
              : "text-fg"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-fg-muted">{hint}</div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  caption,
  tone = "default",
}: {
  label: string;
  value: number;
  caption: string;
  tone?: "default" | "good";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm text-fg">{label}</span>
        <span className="font-mono text-xs text-fg-subtle">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={`animate-bar-grow h-full rounded-full ${
            tone === "good" ? "bg-success" : "bg-accent"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-fg-subtle">{caption}</p>
    </div>
  );
}
