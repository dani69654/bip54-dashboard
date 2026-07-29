"use client";

import { useState, type ReactNode } from "react";

export type LessonStep = {
  title: string;
  body: ReactNode;
  tip?: string;
};

export function GuidedLesson({
  title,
  steps,
}: {
  title: string;
  steps: LessonStep[];
}) {
  const [index, setIndex] = useState(0);
  const step = steps[index]!;
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-border bg-bg-muted/60 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-text">
              Guided lesson
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-accent"
                    : "w-2 bg-border-strong hover:bg-fg-subtle"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-mono text-xs text-accent-text">
            Step {index + 1} of {steps.length}
          </span>
          <h4 className="font-display text-base font-semibold text-fg">
            {step.title}
          </h4>
        </div>

        <div className="text-sm leading-relaxed text-fg-muted">{step.body}</div>

        {step.tip ? (
          <p className="mt-4 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2 text-sm text-accent-text">
            <span className="font-medium text-fg">Try now: </span>
            {step.tip}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-border px-3.5 py-2 text-sm text-fg-muted transition enabled:hover:border-border-strong enabled:hover:text-fg disabled:opacity-35"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              setIndex((i) => (isLast ? 0 : Math.min(steps.length - 1, i + 1)))
            }
            className="rounded-lg border border-accent/40 bg-accent-soft px-3.5 py-2 text-sm text-accent-text transition hover:border-accent/60"
          >
            {isLast ? "Start over" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompareRow({
  label,
  before,
  after,
  tone = "bad",
}: {
  label: string;
  before: string;
  after: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border border-border bg-bg-muted/40 px-3 py-2.5 text-sm sm:gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Before
        </div>
        <div className="mt-0.5 font-medium text-fg">{before}</div>
      </div>
      <div className="text-center text-fg-subtle" aria-hidden>
        →
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          {label}
        </div>
        <div
          className={`mt-0.5 font-medium ${
            tone === "good" ? "text-success" : "text-danger"
          }`}
        >
          {after}
        </div>
      </div>
    </div>
  );
}

export function BigNumber({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone: "good" | "bad" | "neutral";
  hint?: string;
}) {
  const color =
    tone === "good"
      ? "text-success"
      : tone === "bad"
        ? "text-danger"
        : "text-fg";
  return (
    <div className="rounded-xl border border-border bg-bg-muted/40 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className={`mt-1 font-display text-xl font-semibold ${color}`}>
        {value}
      </div>
      {hint ? <p className="mt-1 text-xs text-fg-subtle">{hint}</p> : null}
    </div>
  );
}
