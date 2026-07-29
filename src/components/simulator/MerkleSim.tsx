"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BigNumber,
  GuidedLesson,
} from "@/components/simulator/GuidedLesson";

type Props = { bip54On: boolean };

export function MerkleSim({ bip54On }: Props) {
  const [txSize, setTxSize] = useState(64);
  const [attacking, setAttacking] = useState(true);

  const ambiguous = txSize === 64 && !bip54On;
  const rejected = txSize === 64 && bip54On;
  const safeSize = txSize !== 64;

  const proofStory = useMemo(() => {
    if (rejected) {
      return {
        title: "Fake payment blocked",
        detail:
          "Size 64 is invalid under BIP54, so it cannot pretend to be both a transaction and a Merkle node.",
        tone: "good" as const,
      };
    }
    if (ambiguous && attacking) {
      return {
        title: "SPV wallet can be fooled",
        detail:
          "64 bytes looks like a real transaction leaf and like an inner Merkle node. A light wallet may accept a payment that never existed.",
        tone: "bad" as const,
      };
    }
    return {
      title: "Proof is clear",
      detail: safeSize
        ? "This size cannot be confused with an inner node (always 64 bytes of two hashes)."
        : "Attack toggle is off — we are not simulating a forged proof right now.",
      tone: "good" as const,
    };
  }, [ambiguous, attacking, rejected, safeSize]);

  return (
    <div className="space-y-6">
      <GuidedLesson
        title="Merkle weakness in plain words"
        steps={[
          {
            title: "Blocks commit to transactions with a tree of hashes",
            body: (
              <div className="space-y-4">
                <p>
                  Bitcoin builds a Merkle tree: pair hashes, hash them, repeat,
                  until one root sits in the block header. Light (SPV) wallets
                  only check a short path up to that root — they do not download
                  the whole block.
                </p>
                <SimpleTree mode="honest" />
                <p>
                  An <strong className="text-fg">inner node</strong> is always
                  exactly <Num>64 bytes</Num>: left hash (32) + right hash (32).
                </p>
              </div>
            ),
            tip: "Keep BIP54 OFF and size at 64 to see the danger case.",
          },
          {
            title: "The bug: a 64-byte transaction looks like an inner node",
            body: (
              <div className="space-y-4">
                <p>
                  If a transaction (without witness data) is exactly 64 bytes
                  long, the same bytes can be read two ways:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <DualCard
                    title="As a transaction"
                    text="Looks like a payment leaf in the tree."
                    tone="bad"
                  />
                  <DualCard
                    title="As an inner node"
                    text="Looks like two hashes glued together."
                    tone="bad"
                  />
                </div>
                <p>
                  Full nodes know the difference. A light SPV wallet following
                  only hashes can be tricked.
                </p>
              </div>
            ),
            tip: "Slide size away from 64 — the confusion disappears.",
          },
          {
            title: "BIP54’s fix is simple: ban that size",
            body: (
              <div className="space-y-4">
                <SimpleTree
                  mode={
                    rejected
                      ? "blocked"
                      : ambiguous && attacking
                        ? "attack"
                        : "honest"
                  }
                />
                <p>
                  {rejected ? (
                    <>
                      With BIP54 on, a 64-byte transaction is invalid. No
                      ambiguity, no forged light-wallet proof.
                    </>
                  ) : ambiguous && attacking ? (
                    <>
                      Right now the tree can be lied about to an SPV wallet.
                      Turn BIP54 ON to slam that door shut.
                    </>
                  ) : (
                    <>
                      Current settings are safe. Set size to 64, attack on,
                      BIP54 off to reopen the demo of the bug.
                    </>
                  )}
                </p>
              </div>
            ),
            tip: "Toggle BIP54 with size=64 and attack on.",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold">Playground</h3>
          <p className="mt-2 text-sm text-fg-muted">
            Change the transaction size and see if the tree stays honest.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm text-fg">Transaction size</span>
              <span className="font-mono text-xs text-accent-text">
                {txSize} bytes
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={120}
              value={txSize}
              onChange={(e) => setTxSize(Number(e.target.value))}
            />
            <p className="mt-2 text-xs text-fg-subtle">
              Danger zone is exactly <Num>64</Num> bytes (same size as an inner
              node).
            </p>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={attacking}
              onChange={(e) => setAttacking(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Attacker tries a fake SPV payment proof
          </label>

          <div className="mt-8">
            <SimpleTree
              mode={
                rejected
                  ? "blocked"
                  : ambiguous && attacking
                    ? "attack"
                    : "honest"
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <BigNumber
            label="Light wallet result"
            value={proofStory.title}
            tone={proofStory.tone}
            hint={proofStory.detail}
          />

          <SizeGauge txSize={txSize} bip54On={bip54On} />

          <div className="surface p-4">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              In one sentence
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {rejected ? (
                <>
                  Size is <Num>64</Num> and BIP54 is ON → the tx is invalid, so
                  it cannot fake an inner node.
                </>
              ) : ambiguous && attacking ? (
                <>
                  Size is <Num>64</Num>, BIP54 is OFF, attack is ON → an SPV
                  wallet can be shown a payment that was never a real leaf.
                </>
              ) : (
                <>
                  Size is <Num>{txSize}</Num> bytes
                  {!attacking ? " and the attack toggle is off" : ""} → no
                  confusion with a 64-byte inner node.
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
              ? "BIP54 rule in plain words: a transaction that is exactly 64 bytes (without witness) is not allowed."
              : "Turn BIP54 ON while size is 64 to see the attack surface disappear."}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleTree({ mode }: { mode: "honest" | "attack" | "blocked" }) {
  const danger = mode === "attack";
  const blocked = mode === "blocked";

  return (
    <div className="flex flex-col items-center gap-2">
      <TreeNode
        label="Merkle root"
        sub="in the block header"
        tone={danger ? "warn" : "neutral"}
      />
      <Stem />
      <div className="flex w-full max-w-md justify-between gap-3">
        <TreeNode
          label={danger ? "Confused 64-byte blob" : blocked ? "Banned 64-byte tx" : "Inner node"}
          sub={
            danger
              ? "Looks like tx AND like two hashes"
              : blocked
                ? "Rejected by BIP54"
                : "32 + 32 = 64 bytes"
          }
          tone={danger ? "bad" : blocked ? "good" : "neutral"}
        />
        <TreeNode label="Sibling hash" sub="normal proof piece" tone="neutral" />
      </div>
      <Stem />
      <div className="flex w-full max-w-md justify-between gap-3">
        <TreeNode
          label={
            blocked
              ? "No fake leaf"
              : danger
                ? "Fake “payment”"
                : "Real transaction"
          }
          sub={
            blocked
              ? "Cannot enter the tree"
              : danger
                ? "SPV may believe this"
                : "Honest leaf"
          }
          tone={danger ? "bad" : blocked ? "good" : "good"}
        />
        <TreeNode label="Other tx" sub="honest leaf" tone="neutral" />
      </div>
    </div>
  );
}

function TreeNode({
  label,
  sub,
  tone,
}: {
  label: string;
  sub: string;
  tone: "neutral" | "bad" | "good" | "warn";
}) {
  const cls =
    tone === "bad"
      ? "border-danger/40 bg-danger-soft"
      : tone === "good"
        ? "border-success/30 bg-success-soft"
        : tone === "warn"
          ? "border-accent/40 bg-accent-soft"
          : "border-border bg-bg-muted";
  return (
    <div className={`min-w-[7.5rem] flex-1 rounded-lg border px-3 py-2 text-center ${cls}`}>
      <div className="text-xs font-medium text-fg">{label}</div>
      <div className="mt-0.5 text-[10px] text-fg-subtle">{sub}</div>
    </div>
  );
}

function Stem() {
  return <div className="h-5 w-px bg-border-strong" aria-hidden />;
}

function DualCard({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: "bad" | "good";
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        tone === "bad"
          ? "border-danger/30 bg-danger-soft"
          : "border-success/25 bg-success-soft"
      }`}
    >
      <div className="text-sm font-medium text-fg">{title}</div>
      <p className="mt-1 text-xs text-fg-muted">{text}</p>
    </div>
  );
}

function SizeGauge({
  txSize,
  bip54On,
}: {
  txSize: number;
  bip54On: boolean;
}) {
  const atDanger = txSize === 64;
  return (
    <div className="surface p-4">
      <p className="text-xs uppercase tracking-wider text-fg-subtle">
        Size check
      </p>
      <div className="mt-3 flex items-center gap-2">
        {[60, 64, 80, 100, 120].map((mark) => (
          <div
            key={mark}
            className={`flex-1 rounded-md border px-1 py-2 text-center font-mono text-[10px] ${
              txSize === mark
                ? mark === 64
                  ? bip54On
                    ? "border-success/40 bg-success-soft text-success"
                    : "border-danger/40 bg-danger-soft text-danger"
                  : "border-accent/40 bg-accent-soft text-accent-text"
                : mark === 64
                  ? "border-danger/20 text-fg-subtle"
                  : "border-border text-fg-subtle"
            }`}
          >
            {mark}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-fg-muted">
        {atDanger
          ? bip54On
            ? "64 highlighted green = banned safely."
            : "64 highlighted red = ambiguous / attackable."
          : "Only exactly 64 is the special dangerous size."}
      </p>
    </div>
  );
}

function Num({ children }: { children: ReactNode }) {
  return <span className="font-mono text-accent-text">{children}</span>;
}
