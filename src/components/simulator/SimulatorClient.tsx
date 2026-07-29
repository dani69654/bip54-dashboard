"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BIP54, type FixId } from "@/lib/bip54";
import { TimewarpSim } from "@/components/simulator/TimewarpSim";
import { PoisonBlockSim } from "@/components/simulator/PoisonBlockSim";
import { MerkleSim } from "@/components/simulator/MerkleSim";
import { DuplicateCoinbaseSim } from "@/components/simulator/DuplicateCoinbaseSim";

const VALID_IDS = new Set(BIP54.fixes.map((f) => f.id));

export function SimulatorClient() {
  const params = useSearchParams();
  const initial = params.get("scenario");
  const start: FixId =
    initial && VALID_IDS.has(initial as FixId)
      ? (initial as FixId)
      : "timewarp";

  const [active, setActive] = useState<FixId>(start);
  const [bip54On, setBip54On] = useState(false);

  const fix = useMemo(
    () => BIP54.fixes.find((f) => f.id === active)!,
    [active],
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pb-10 sm:pb-14">
      <div className="animate-fade-up-delay-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {BIP54.fixes.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`rounded-lg border px-3.5 py-2 text-left text-sm transition ${
                active === f.id
                  ? "border-accent/40 bg-accent-soft text-accent-text"
                  : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg"
              }`}
            >
              <span className="mr-2 font-mono text-xs opacity-60">
                0{i + 1}
              </span>
              {f.name}
            </button>
          ))}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm">
          <span className="text-fg-muted">BIP54 rules</span>
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              bip54On ? "bg-success" : "bg-border-strong"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-fg transition ${
                bip54On ? "translate-x-5" : ""
              }`}
            />
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={bip54On}
            onChange={(e) => setBip54On(e.target.checked)}
          />
          <span
            className={`font-mono text-xs ${
              bip54On ? "text-success" : "text-fg-subtle"
            }`}
          >
            {bip54On ? "ON" : "OFF"}
          </span>
        </label>
      </div>

      <div className="animate-fade-up-delay-2 mb-6 surface p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">{fix.name}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted">
          {fix.summary}
        </p>
      </div>

      <div className="animate-fade-up-delay-3">
        {active === "timewarp" && <TimewarpSim bip54On={bip54On} />}
        {active === "poison" && <PoisonBlockSim bip54On={bip54On} />}
        {active === "merkle" && <MerkleSim bip54On={bip54On} />}
        {active === "duplicate" && <DuplicateCoinbaseSim bip54On={bip54On} />}
      </div>
    </div>
  );
}
