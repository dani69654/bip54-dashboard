"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BigNumber,
  CompareRow,
  GuidedLesson,
} from "@/components/simulator/GuidedLesson";

type Props = { bip54On: boolean };

export function TimewarpSim({ bip54On }: Props) {
  const [periods, setPeriods] = useState(3);
  const [manipulation, setManipulation] = useState(70);

  const result = useMemo(() => {
    const factorPerPeriod = Math.max(0.05, 1 - manipulation / 140);
    const steps: number[] = [];
    let difficulty = 1;

    for (let i = 0; i < periods; i++) {
      if (bip54On) break;
      difficulty *= factorPerPeriod;
      steps.push(difficulty);
    }

    const honestRate = 1 / 600;
    const uncappedRate = bip54On ? honestRate : honestRate / difficulty;
    const blocksPerSecond = bip54On ? honestRate : Math.min(6, uncappedRate);
    const percentLeft = Math.round(difficulty * 100);
    const dropPercent = Math.round((1 - factorPerPeriod) * 100);
    const secondsPerBlock = 1 / blocksPerSecond;

    return {
      factorPerPeriod,
      difficulty,
      steps,
      blocksPerSecond,
      percentLeft,
      dropPercent,
      secondsPerBlock,
    };
  }, [bip54On, periods, manipulation]);

  const timeLabel = formatBlockTime(result.secondsPerBlock);

  return (
    <div className="space-y-6">
      <GuidedLesson
        title="Timewarp in plain words"
        steps={[
          {
            title: "Bitcoin checks a clock every ~2 weeks",
            body: (
              <div className="space-y-4">
                <p>
                  About every <Num>2,016</Num> blocks, Bitcoin measures how long
                  that stretch took. Target:{" "}
                  <Num>2,016 × 10 min = 20,160 min = 14 days</Num>.
                </p>
                <ClockScene mode="honest" />
                <CalcBox title="Honest example (real dates)">
                  <CalcLine>
                    Period starts: <Num>1 Jul 2026, 12:00 UTC</Num>
                  </CalcLine>
                  <CalcLine>
                    Period ends: <Num>15 Jul 2026, 12:00 UTC</Num>
                  </CalcLine>
                  <CalcLine>
                    Duration Bitcoin sees: 15 Jul − 1 Jul ={" "}
                    <Num>14 days 0 hours</Num>
                  </CalcLine>
                  <CalcLine>
                    Expected: <Num>14 days</Num> → ratio{" "}
                    <Num>14 ÷ 14 = 1.00</Num> → difficulty unchanged
                  </CalcLine>
                </CalcBox>
              </div>
            ),
            tip: "Leave BIP54 OFF for now so you can see the attack.",
          },
          {
            title: "The trick: lie about the clocks at the boundary",
            body: (
              <div className="space-y-4">
                <p>
                  Real wall-clock time at the boundary:{" "}
                  <Num>15 Jul 2026, 12:00 UTC</Num>. An attacker majority sets
                  two timestamps that are still “legal” today (±2 hours), but
                  invent a fake gap between periods.
                </p>
                <ClockScene mode="attack" />
                <CalcBox title="Attack example (same real moment)">
                  <CalcLine>
                    True time: <Num>15 Jul 2026, 12:00 UTC</Num>
                  </CalcLine>
                  <CalcLine>
                    Last block of old period:{" "}
                    <Num>15 Jul 2026, 14:00 UTC</Num> (+2 hours into the future)
                  </CalcLine>
                  <CalcLine>
                    First block of new period:{" "}
                    <Num>15 Jul 2026, 10:00 UTC</Num> (−2 hours into the past)
                  </CalcLine>
                  <CalcLine>
                    Fake gap: 14:00 − 10:00 = <Num>4 hours</Num> that never
                    happened
                  </CalcLine>
                </CalcBox>
                <CalcBox title="What Bitcoin then thinks">
                  <CalcLine>
                    Honest period length: <Num>14 days = 336 hours</Num>
                  </CalcLine>
                  <CalcLine>
                    After one boundary trick: 336 + 4 ={" "}
                    <Num>340 hours</Num> (~14 days + 4 hours)
                  </CalcLine>
                  <CalcLine>
                    Difficulty update:{" "}
                    <Num>new = old × (336 ÷ 340) ≈ old × 0.988</Num>
                  </CalcLine>
                  <CalcLine>
                    In plain words: mining becomes about{" "}
                    <Num>1.2% easier</Num> — then repeat every period so it
                    compounds.
                  </CalcLine>
                </CalcBox>
                <p>
                  BIP54’s fix: the first block of the new period cannot be more
                  than <Num>2 hours</Num> earlier than the previous block — so
                  this <Num>14:00 → 10:00</Num> jump is rejected.
                </p>
              </div>
            ),
            tip: "In the playground, red clocks use these same lying timestamps.",
          },
          {
            title: "Your two sliders = how many times, how hard",
            body: (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ExplainCard
                    title="Attack periods"
                    value={String(periods)}
                    text="How many times the attacker pulls the clock trick. More times = difficulty falls again and again."
                  />
                  <ExplainCard
                    title="Timestamp skew"
                    value={`${manipulation}%`}
                    text={`How hard they lie each time. At ${manipulation}%, each period makes mining about ${result.dropPercent}% easier.`}
                  />
                </div>
                <p>
                  Think of it like a volume knob (skew) and a repeat button
                  (periods). Louder + more repeats = easier mining.
                </p>
              </div>
            ),
            tip: "Move Timestamp skew first. Watch the difficulty bar shrink.",
          },
          {
            title: "Watch difficulty shrink — then blocks speed up",
            body: (
              <div className="space-y-4">
                <DifficultyLadder
                  bip54On={bip54On}
                  steps={result.steps}
                  dropPercent={result.dropPercent}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <CompareRow
                    label="Now"
                    before="1 block / 10 min"
                    after={bip54On ? "Still 1 / 10 min" : timeLabel}
                    tone={bip54On ? "good" : "bad"}
                  />
                  <CompareRow
                    label="Difficulty"
                    before="100% (normal)"
                    after={
                      bip54On
                        ? "Still 100%"
                        : `${result.percentLeft}% left`
                    }
                    tone={bip54On ? "good" : "bad"}
                  />
                </div>
                <p>
                  {bip54On ? (
                    <>
                      BIP54 is ON, so the fake clock gap is rejected. Nothing
                      shrinks. Mining stays normal.
                    </>
                  ) : (
                    <>
                      Lower difficulty means the same computers find blocks
                      faster. That can break timelocks and burn through new
                      bitcoin too quickly.
                    </>
                  )}
                </p>
              </div>
            ),
            tip: "Turn BIP54 ON. The ladder should freeze at 100%.",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold">Playground</h3>
          <p className="mt-2 text-sm text-fg-muted">
            Change the knobs. The picture and numbers update immediately.
          </p>

          <div className="mt-6 space-y-6">
            <Control
              label="Attack periods"
              value={`${periods}`}
              hint="How many times the clock trick is repeated"
            >
              <input
                type="range"
                min={1}
                max={8}
                value={periods}
                onChange={(e) => setPeriods(Number(e.target.value))}
              />
            </Control>
            <Control
              label="Timestamp skew"
              value={`${manipulation}%`}
              hint="How far apart the fake clocks are pushed"
            >
              <input
                type="range"
                min={10}
                max={100}
                value={manipulation}
                onChange={(e) => setManipulation(Number(e.target.value))}
              />
            </Control>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-xs uppercase tracking-wider text-fg-subtle">
              Boundary clocks (visual)
            </p>
            <ClockScene mode={bip54On ? "blocked" : "attack"} />
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-wider text-fg-subtle">
                Difficulty left
              </p>
              <p
                className={`font-mono text-sm ${
                  bip54On ? "text-success" : "text-danger"
                }`}
              >
                {bip54On ? "100%" : `${result.percentLeft}%`}
              </p>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  bip54On ? "bg-success" : "bg-danger"
                }`}
                style={{
                  width: `${bip54On ? 100 : Math.max(4, result.percentLeft)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-fg-subtle">
              {bip54On
                ? "Shield up: the fake gap cannot shrink this bar."
                : `Each attacked period removes about ${result.dropPercent}% of whatever difficulty is left.`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <BigNumber
            label="Mining difficulty"
            value={bip54On ? "Normal (100%)" : `${result.percentLeft}% left`}
            tone={bip54On ? "good" : "bad"}
            hint={
              bip54On
                ? "BIP54 blocked the trick"
                : `After ${periods} period${periods === 1 ? "" : "s"} at ${manipulation}% skew`
            }
          />
          <BigNumber
            label="How often a block arrives"
            value={bip54On ? "About every 10 minutes" : timeLabel}
            tone={bip54On ? "good" : "bad"}
            hint={
              bip54On
                ? "Healthy Bitcoin pace"
                : "Faster than intended — bad for the schedule"
            }
          />

          <div className="surface p-4">
            <p className="text-xs uppercase tracking-wider text-fg-subtle">
              In one sentence
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {bip54On ? (
                <>
                  With BIP54 on, lying about the clocks at the period boundary
                  is rejected — so your sliders do nothing harmful.
                </>
              ) : (
                <>
                  If you set skew to <Num>{manipulation}%</Num> and repeat it{" "}
                  <Num>{periods}</Num> time{periods === 1 ? "" : "s"}, mining
                  difficulty falls to about <Num>{result.percentLeft}%</Num>{" "}
                  and blocks arrive <Num>{timeLabel.toLowerCase()}</Num>{" "}
                  instead of every 10 minutes.
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
              ? "BIP54 rule in plain words: the first block of a new period cannot jump too far backward from the previous period’s last block."
              : "Turn BIP54 ON above to watch the red clocks get blocked and the difficulty bar snap back to full."}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockScene({
  mode,
}: {
  mode: "honest" | "attack" | "blocked";
}) {
  if (mode === "honest") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <ClockCard
          title="Period starts"
          time="1 Jul 2026, 12:00"
          note="First block timestamp"
          tone="ok"
        />
        <ClockCard
          title="Period ends"
          time="15 Jul 2026, 12:00"
          note="Last block timestamp (= +14 days)"
          tone="ok"
        />
      </div>
    );
  }

  if (mode === "blocked") {
    return (
      <div className="relative">
        <div className="grid gap-3 sm:grid-cols-2 opacity-40">
          <ClockCard
            title="Last block (old period)"
            time="15 Jul 2026, 14:00"
            note="+2h future (blocked gap)"
            tone="bad"
          />
          <ClockCard
            title="First block (new period)"
            time="15 Jul 2026, 10:00"
            note="−2h past (blocked gap)"
            tone="bad"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-success/40 bg-success-soft px-4 py-2 text-center text-sm font-medium text-success shadow-sm">
            BIP54 blocks the 4-hour fake gap
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ClockCard
        title="Last block (old period)"
        time="15 Jul 2026, 14:00"
        note="True time was 12:00 → +2 hours"
        tone="bad"
      />
      <ClockCard
        title="First block (new period)"
        time="15 Jul 2026, 10:00"
        note="True time was 12:00 → −2 hours"
        tone="bad"
      />
    </div>
  );
}

function ClockCard({
  title,
  time,
  note,
  tone,
}: {
  title: string;
  time: string;
  note: string;
  tone: "ok" | "bad";
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        tone === "ok"
          ? "border-success/25 bg-success-soft/40"
          : "border-danger/30 bg-danger-soft"
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {title}
      </div>
      <div
        className={`mt-1 font-display text-base font-semibold sm:text-lg ${
          tone === "ok" ? "text-success" : "text-danger"
        }`}
      >
        {time}
      </div>
      <div className="mt-1 text-xs text-fg-muted">{note}</div>
    </div>
  );
}

function CalcBox({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-muted/50 px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {title}
      </p>
      <div className="mt-2 space-y-1.5 text-sm text-fg-muted">{children}</div>
    </div>
  );
}

function CalcLine({ children }: { children: ReactNode }) {
  return <div className="leading-relaxed">{children}</div>;
}

function DifficultyLadder({
  bip54On,
  steps,
  dropPercent,
}: {
  bip54On: boolean;
  steps: number[];
  dropPercent: number;
}) {
  if (bip54On) {
    return (
      <div className="rounded-xl border border-success/25 bg-success-soft px-4 py-3 text-sm text-success">
        BIP54 stops the attack on period 1. Difficulty stays at{" "}
        <strong>100%</strong> — no ladder of drops.
      </div>
    );
  }

  const rows = [1, ...steps];
  return (
    <div className="space-y-2">
      {rows.map((d, i) => {
        const pct = Math.round(d * 100);
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 shrink-0 font-mono text-[11px] text-fg-subtle">
              {i === 0 ? "Start" : `Period ${i}`}
            </div>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-danger transition-all duration-500"
                style={{ width: `${Math.max(4, pct)}%` }}
              />
            </div>
            <div className="w-12 shrink-0 text-right font-mono text-xs text-danger">
              {pct}%
            </div>
          </div>
        );
      })}
      <p className="text-xs text-fg-subtle">
        Each period: keep only about {100 - dropPercent}% of what you had
        (drop ~{dropPercent}%).
      </p>
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

function formatBlockTime(seconds: number) {
  if (seconds >= 60) {
    const minutes = seconds / 60;
    return `About every ${minutes.toFixed(minutes >= 10 ? 0 : 1)} min`;
  }
  if (seconds >= 1) {
    return `About every ${seconds.toFixed(1)} sec`;
  }
  const perSec = 1 / seconds;
  return `About ${perSec.toFixed(1)} blocks / sec`;
}

function Num({ children }: { children: ReactNode }) {
  return <span className="font-mono text-accent-text">{children}</span>;
}

function Control({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-fg">{label}</span>
        <span className="font-mono text-xs text-accent-text">{value}</span>
      </div>
      {children}
      <p className="mt-2 text-xs text-fg-subtle">{hint}</p>
    </div>
  );
}
