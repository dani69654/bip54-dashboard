"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BigNumber,
  GuidedLesson,
} from "@/components/simulator/GuidedLesson";

type Props = { bip54On: boolean };

type Utxo = {
  id: string;
  label: string;
  height: number;
  value: number;
  status: "live" | "overwritten" | "unique";
};

export function DuplicateCoinbaseSim({ bip54On }: Props) {
  const [height, setHeight] = useState(2000000);
  const [reuseEarlyCoinbase, setReuseEarlyCoinbase] = useState(true);

  const { utxos, story, locktime } = useMemo(() => {
    const earlyHeight = 91722;
    const locktime = height - 1;

    if (bip54On) {
      return {
        locktime,
        utxos: [
          {
            id: "early",
            label: "Old coinbase (still safe)",
            height: earlyHeight,
            value: 50,
            status: "live" as const,
          },
          {
            id: "new",
            label: `New coinbase (locktime ${locktime.toLocaleString()})`,
            height,
            value: 50,
            status: "unique" as const,
          },
        ],
        story: {
          tone: "good" as const,
          title: "Both coins stay safe",
          body: "BIP54 forces the new coinbase to include a unique locktime, so it cannot overwrite the old one.",
        },
      };
    }

    if (reuseEarlyCoinbase) {
      return {
        locktime,
        utxos: [
          {
            id: "early",
            label: "Old coinbase (same ID)",
            height: earlyHeight,
            value: 50,
            status: "overwritten" as const,
          },
          {
            id: "new",
            label: "New coinbase (same ID)",
            height,
            value: 50,
            status: "live" as const,
          },
        ],
        story: {
          tone: "bad" as const,
          title: "Old coins erased",
          body: "Two coinbases share one ID. The new write replaces the old entry — historically this burned 50 BTC each time it happened.",
        },
      };
    }

    return {
      locktime,
      utxos: [
        {
          id: "early",
          label: "Old coinbase",
          height: earlyHeight,
          value: 50,
          status: "live" as const,
        },
        {
          id: "new",
          label: "New coinbase (different ID)",
          height,
          value: 50,
          status: "unique" as const,
        },
      ],
      story: {
        tone: "good" as const,
        title: "No collision",
        body: "Different data ⇒ different ID. Turn on “reuse early pattern” with BIP54 off to see the failure.",
      },
    };
  }, [bip54On, height, reuseEarlyCoinbase]);

  return (
    <div className="space-y-6">
      <GuidedLesson
        title="Duplicate coinbases in plain words"
        steps={[
          {
            title: "Bitcoin tracks coins by a transaction ID",
            body: (
              <div className="space-y-4">
                <p>
                  Think of the UTXO set as a locker room: each locker key is a
                  transaction id. If two different payments get the{" "}
                  <strong className="text-fg">same key</strong>, the second one
                  can overwrite the first — and the first coins vanish.
                </p>
                <LockerScene mode="safe" />
              </div>
            ),
            tip: "Leave BIP54 OFF and keep “reuse early pattern” checked.",
          },
          {
            title: "Early Bitcoin allowed duplicate coinbase IDs",
            body: (
              <div className="space-y-4">
                <p>
                  Coinbase transactions (the ones that create new bitcoin) were
                  not always forced to be unique. Twice in history, later blocks
                  reused an earlier coinbase pattern — and{" "}
                  <Num>50 BTC</Num> disappeared from the UTXO set each time.
                </p>
                <LockerScene mode="collision" />
              </div>
            ),
            tip: "Look at the playground table: one row says Destroyed.",
          },
          {
            title: "BIP54 stamps every new coinbase with the block height",
            body: (
              <div className="space-y-4">
                <p>
                  Rule in plain words: set{" "}
                  <Num>nLockTime = height − 1</Num> (here{" "}
                  <Num>{locktime.toLocaleString()}</Num>) and do not use a
                  “final” sequence. That alone makes every future coinbase ID
                  unique — no expensive forever-scanning needed.
                </p>
                <LockerScene mode={bip54On ? "protected" : "collision"} />
                <p>
                  {bip54On
                    ? "BIP54 is ON — both lockers stay distinct."
                    : "Turn BIP54 ON to watch the collision attempt fail safely."}
                </p>
              </div>
            ),
            tip: "Toggle BIP54 and watch the locker labels change.",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold">Playground</h3>
          <p className="mt-2 text-sm text-fg-muted">
            Pick a new block height and try to reuse an early coinbase pattern.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm text-fg">New block height</span>
              <span className="font-mono text-xs text-accent-text">
                {height.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={2100000}
              step={1000}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <p className="mt-2 text-xs text-fg-subtle">
              From block 1,983,702 the old temporary fix (explicit BIP30 checks)
              would have to come back without BIP54.
            </p>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={reuseEarlyCoinbase}
              onChange={(e) => setReuseEarlyCoinbase(e.target.checked)}
              disabled={bip54On}
              className="h-4 w-4 accent-[var(--accent)] disabled:opacity-40"
            />
            Try to reuse an early coinbase pattern
            {bip54On ? " (blocked)" : ""}
          </label>

          <div className="mt-7">
            <LockerScene
              mode={
                bip54On
                  ? "protected"
                  : reuseEarlyCoinbase
                    ? "collision"
                    : "safe"
              }
              height={height}
              locktime={locktime}
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1.6fr_0.7fr_0.5fr_0.8fr] gap-2 border-b border-border bg-bg-muted px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              <span>Coin</span>
              <span>Height</span>
              <span>BTC</span>
              <span>Status</span>
            </div>
            {utxos.map((u: Utxo) => (
              <div
                key={`${u.id}-${u.height}`}
                className="grid grid-cols-[1.6fr_0.7fr_0.5fr_0.8fr] gap-2 border-b border-border px-3 py-3 text-sm last:border-b-0"
              >
                <span className="truncate text-xs text-fg-muted">{u.label}</span>
                <span className="font-mono text-xs">
                  {u.height.toLocaleString()}
                </span>
                <span>{u.value}</span>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <BigNumber
            label="Outcome"
            value={story.title}
            tone={story.tone}
            hint={story.body}
          />

          <div className="surface p-4">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              In one sentence
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {bip54On ? (
                <>
                  At height <Num>{height.toLocaleString()}</Num>, BIP54 requires
                  locktime <Num>{locktime.toLocaleString()}</Num> — the new
                  coinbase cannot share an ID with the old one.
                </>
              ) : reuseEarlyCoinbase ? (
                <>
                  BIP54 is OFF and reuse is ON → both coinbases claim the same
                  ID, so the old <Num>50 BTC</Num> entry is destroyed in this
                  model.
                </>
              ) : (
                <>
                  Reuse is OFF, so the new coinbase gets a different ID and both
                  coins remain.
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
              ? "BIP54 rule in plain words: every coinbase must commit the block height via nLockTime, so IDs stay unique forever."
              : "Turn BIP54 ON to see the reuse attempt fail — the new coinbase is forced to a unique locktime."}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockerScene({
  mode,
  height,
  locktime,
}: {
  mode: "safe" | "collision" | "protected";
  height?: number;
  locktime?: number;
}) {
  if (mode === "collision") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Locker
          title="Locker A"
          keyLabel="same ID"
          body="Old 50 BTC — overwritten"
          tone="bad"
        />
        <Locker
          title="Locker A (again)"
          keyLabel="same ID"
          body={`New coinbase at ${height?.toLocaleString() ?? "new height"}`}
          tone="warn"
        />
      </div>
    );
  }

  if (mode === "protected") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Locker
          title="Locker A"
          keyLabel="old unique ID"
          body="Old 50 BTC — still there"
          tone="good"
        />
        <Locker
          title="Locker B"
          keyLabel={`locktime ${locktime?.toLocaleString() ?? "h−1"}`}
          body="New coinbase — different key"
          tone="good"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Locker
        title="Locker A"
        keyLabel="unique ID"
        body="Old coins safe"
        tone="good"
      />
      <Locker
        title="Locker B"
        keyLabel="different ID"
        body="New coins safe"
        tone="good"
      />
    </div>
  );
}

function Locker({
  title,
  keyLabel,
  body,
  tone,
}: {
  title: string;
  keyLabel: string;
  body: string;
  tone: "good" | "bad" | "warn";
}) {
  const cls =
    tone === "good"
      ? "border-success/30 bg-success-soft"
      : tone === "bad"
        ? "border-danger/30 bg-danger-soft"
        : "border-accent/30 bg-accent-soft";
  const text =
    tone === "good"
      ? "text-success"
      : tone === "bad"
        ? "text-danger"
        : "text-accent-text";
  return (
    <div className={`rounded-xl border px-4 py-3 ${cls}`}>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {title}
      </div>
      <div className={`mt-1 font-mono text-xs ${text}`}>{keyLabel}</div>
      <p className="mt-2 text-sm text-fg">{body}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Utxo["status"] }) {
  const map = {
    live: "bg-success-soft text-success",
    unique: "bg-accent-soft text-accent-text",
    overwritten: "bg-danger-soft text-danger",
  };
  const label = {
    live: "Live",
    unique: "Unique",
    overwritten: "Destroyed",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function Num({ children }: { children: ReactNode }) {
  return <span className="font-mono text-accent-text">{children}</span>;
}
