"use client";

import { useEffect, useState } from "react";
import { BIP54 } from "@/lib/bip54";
import {
  fetchPoolReadinessLive,
  type PoolReadiness,
} from "@/lib/pool-readiness";

type Status = "loading" | "live" | "fallback";

export function LivePoolReadiness({
  initial,
}: {
  initial: PoolReadiness;
}) {
  const [readiness, setReadiness] = useState(initial);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetchPoolReadinessLive(controller.signal)
      .then((live) => {
        setReadiness(live);
        setStatus("live");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.warn("BIP54 pool readiness live fetch failed:", error);
        setStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  const totalCompatibleBlocks = readiness.pools.reduce(
    (sum, pool) => sum + pool.compatibleBlocks,
    0,
  );

  return (
    <>
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
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={status} asOf={readiness.asOf} />
            <a
              href={readiness.poolsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-text transition hover:underline"
            >
              Raw pool CSV ↗
            </a>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Mining pools with BIP54-compatible coinbase locktimes, first block
              and all-time count, as of {readiness.asOf}
            </caption>
            <thead>
              <tr className="border-b border-border bg-bg-muted font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                <th scope="col" className="px-4 py-2.5 font-normal">
                  Pool
                </th>
                <th scope="col" className="px-4 py-2.5 font-normal">
                  First height
                </th>
                <th scope="col" className="px-4 py-2.5 font-normal">
                  First date
                </th>
                <th scope="col" className="px-4 py-2.5 font-normal">
                  Blocks
                </th>
                <th scope="col" className="px-4 py-2.5 font-normal">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {readiness.pools.map((pool) => (
                <tr
                  key={pool.name}
                  className="border-b border-border last:border-b-0"
                >
                  <th scope="row" className="px-4 py-3 font-medium text-fg">
                    {pool.name}
                  </th>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">
                    {pool.firstHeight.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">
                    <time dateTime={pool.firstDate}>{pool.firstDate}</time>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-accent-text">
                    {pool.compatibleBlocks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-fg-subtle">
                    {pool.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </>
  );
}

function StatusBadge({ status, asOf }: { status: Status; asOf: string }) {
  if (status === "loading") {
    return (
      <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
        Updating…
      </span>
    );
  }
  if (status === "live") {
    return (
      <span className="font-mono text-[10px] uppercase tracking-wider text-success">
        Live · {asOf}
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-warning">
      Snapshot · {asOf}
    </span>
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
