"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BigNumber,
  CompareRow,
  GuidedLesson,
} from "@/components/simulator/GuidedLesson";

type Props = { bip54On: boolean };

export function PoisonBlockSim({ bip54On }: Props) {
  const [sigops, setSigops] = useState(8000);
  const limit = 2500;

  const result = useMemo(() => {
    const rejected = bip54On && sigops > limit;
    const seconds = rejected
      ? 0
      : Math.max(0.05, (sigops / 2500) * (bip54On ? 1.5 : 60));
    return { rejected, seconds };
  }, [bip54On, sigops]);

  const timeLabel = formatValidateTime(result.seconds);
  const overLimit = sigops > limit;

  return (
    <div className="space-y-6">
      <GuidedLesson
        title="Poison blocks in plain words"
        steps={[
          {
            title: "A block must be checked before it counts",
            body: (
              <div className="space-y-4">
                <p>
                  Every full node verifies signatures in a block. Usually that
                  is fast. But old-style (legacy) scripts can pack{" "}
                  <strong className="text-fg">thousands</strong> of signature
                  checks into one transaction.
                </p>
                <VisualMeter
                  label="Work for your node"
                  fill={12}
                  tone="ok"
                  caption="Normal transaction ≈ quick check"
                />
              </div>
            ),
            tip: "Leave BIP54 OFF so you can see the slow case.",
          },
          {
            title: "The slider = how many signature checks",
            body: (
              <div className="space-y-4">
                <p>
                  Move the slider to add more legacy signature operations
                  (“sigops”) in one transaction. More checks = more work for
                  every node that sees the block.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ExplainCard
                    title="Your setting"
                    value={sigops.toLocaleString()}
                    text="Signature checks packed into one transaction."
                  />
                  <ExplainCard
                    title="BIP54 safety limit"
                    value="2,500"
                    text="Above this, BIP54 says: reject the transaction."
                  />
                </div>
              </div>
            ),
            tip: "Slide above 2,500. Watch validation time grow.",
          },
          {
            title: "Without BIP54, nodes can stall for a long time",
            body: (
              <div className="space-y-4">
                <CompareRow
                  label="Your tx"
                  before="~a few seconds (normal)"
                  after={
                    result.rejected
                      ? "Rejected (never validates)"
                      : timeLabel
                  }
                  tone={
                    result.rejected || result.seconds < 5 ? "good" : "bad"
                  }
                />
                <p>
                  {result.rejected ? (
                    <>
                      BIP54 rejected it before anyone wasted an hour verifying
                      junk.
                    </>
                  ) : bip54On ? (
                    <>
                      Under BIP54 you are still under the limit, so validation
                      stays practical (~{timeLabel.toLowerCase()}).
                    </>
                  ) : (
                    <>
                      A slow “poison” block is still valid consensus today —
                      nodes that check carefully suffer; others feel pressure
                      to skip work.
                    </>
                  )}
                </p>
              </div>
            ),
            tip: "Turn BIP54 ON with the slider above 2,500 — it should reject.",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold">Playground</h3>
          <p className="mt-2 text-sm text-fg-muted">
            Pack signature checks into one transaction and see what happens.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm text-fg">Legacy sigops in one tx</span>
              <span className="font-mono text-xs text-accent-text">
                {sigops.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={20000}
              step={100}
              value={sigops}
              onChange={(e) => setSigops(Number(e.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs text-fg-subtle">
              <span>Normal ~100</span>
              <span>Limit 2,500</span>
              <span>Extreme 20k</span>
            </div>
          </div>

          <div className="mt-7">
            <div className="relative mb-2 h-4 overflow-hidden rounded-full bg-border">
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                  result.rejected
                    ? "bg-success"
                    : overLimit
                      ? "bg-danger"
                      : "bg-accent"
                }`}
                style={{
                  width: `${Math.min(100, (sigops / 20000) * 100)}%`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-fg"
                style={{ left: `${(limit / 20000) * 100}%` }}
                title="BIP54 limit"
              />
            </div>
            <p className="text-xs text-fg-subtle">
              White marker = BIP54 limit (2,500).{" "}
              {result.rejected
                ? "Green bar = accepted only up to the limit; over-limit tx is rejected."
                : overLimit
                  ? "Red = past the safe limit (still allowed if BIP54 is OFF)."
                  : "Gold = still under the limit."}
            </p>
          </div>

          <VisualMeter
            className="mt-7"
            label="Node validation effort"
            fill={
              result.rejected
                ? 0
                : Math.min(100, (result.seconds / 3600) * 100)
            }
            tone={
              result.rejected
                ? "ok"
                : result.seconds > 60
                  ? "bad"
                  : "warn"
            }
            caption={
              result.rejected
                ? "No work — transaction rejected"
                : `About ${timeLabel.toLowerCase()} of checking`
            }
          />
        </div>

        <div className="space-y-4">
          <BigNumber
            label="What happens"
            value={
              result.rejected
                ? "Rejected"
                : result.seconds >= 3600
                  ? timeLabel
                  : `Takes ${timeLabel.toLowerCase()}`
            }
            tone={
              result.rejected
                ? "good"
                : result.seconds > 30
                  ? "bad"
                  : "neutral"
            }
            hint={
              result.rejected
                ? "BIP54 stopped the poison pattern"
                : "Time for a modest full node to verify"
            }
          />

          <div className="surface p-4">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              In one sentence
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {result.rejected ? (
                <>
                  You set <Num>{sigops.toLocaleString()}</Num> sigops, which is
                  over the <Num>2,500</Num> limit — BIP54 rejects it, so nodes
                  never grind for hours.
                </>
              ) : (
                <>
                  With <Num>{sigops.toLocaleString()}</Num> legacy sigops
                  {bip54On ? " (under the limit)" : " and BIP54 off"}, this
                  model says validation takes about{" "}
                  <Num>{timeLabel.toLowerCase()}</Num>.
                </>
              )}
            </p>
          </div>

          <div
            className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              bip54On
                ? "border-success/25 bg-success-soft text-success"
                : "border-danger/25 bg-danger-soft text-danger"
            }`}
          >
            {bip54On
              ? "BIP54 rule in plain words: one non-coinbase transaction may not carry more than 2,500 legacy signature checks."
              : "Turn BIP54 ON and push the slider past 2,500 to see an instant reject instead of a long wait."}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualMeter({
  label,
  fill,
  tone,
  caption,
  className = "",
}: {
  label: string;
  fill: number;
  tone: "ok" | "warn" | "bad";
  caption: string;
  className?: string;
}) {
  const color =
    tone === "ok" ? "bg-success" : tone === "warn" ? "bg-warning" : "bg-danger";
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-wider text-fg-subtle">
          {label}
        </p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.max(fill > 0 ? 3 : 0, fill)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-fg-muted">{caption}</p>
    </div>
  );
}

function ExplainCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-muted/50 px-4 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-fg">{title}</span>
        <span className="font-mono text-xs text-accent-text">{value}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{text}</p>
    </div>
  );
}

function formatValidateTime(seconds: number) {
  if (seconds <= 0) return "0 seconds";
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds >= 60) return `${(seconds / 60).toFixed(1)} minutes`;
  return `${seconds.toFixed(1)} seconds`;
}

function Num({ children }: { children: ReactNode }) {
  return <span className="font-mono text-accent-text">{children}</span>;
}
