"use client";

import { useEffect, useRef, useState } from "react";
import {
  enrichBlocks,
  fetchBlocksPage,
  fetchTipHeight,
  medianFeeColor,
  type ChainBlock,
  type MempoolBlock,
} from "@/lib/mempool-blocks";

function toPlaceholder(block: MempoolBlock): ChainBlock {
  return {
    id: block.id,
    height: block.height,
    timestamp: block.timestamp,
    txCount: block.tx_count,
    size: block.size,
    weight: block.weight,
    medianFee: block.extras?.medianFee ?? 0,
    poolName: block.extras?.pool?.name ?? "Unknown",
    bip54Compatible: false,
  };
}

export function BlockChainStrip() {
  const [blocks, setBlocks] = useState<ChainBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const loadingOlderRef = useRef(false);
  const oldestHeightRef = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const tip = await fetchTipHeight(controller.signal);
        const page = await fetchBlocksPage(tip, controller.signal);
        if (controller.signal.aborted) return;

        setBlocks(page.map(toPlaceholder));
        oldestHeightRef.current =
          page.length > 0 ? page[page.length - 1]!.height : tip;
        setInitialLoading(false);
        setError(null);

        const enriched = await enrichBlocks(page, controller.signal);
        if (controller.signal.aborted) return;
        setBlocks(enriched);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.warn("Block strip fetch failed:", err);
        setError("Could not load recent blocks from mempool.space");
        setInitialLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  async function loadOlder() {
    if (loadingOlderRef.current || oldestHeightRef.current === null) return;
    if (oldestHeightRef.current <= 1) return;

    loadingOlderRef.current = true;
    setLoadingOlder(true);

    try {
      const start = oldestHeightRef.current - 1;
      const page = await fetchBlocksPage(start);
      if (page.length === 0) return;

      const placeholders = page.map(toPlaceholder);
      setBlocks((prev) => mergeByHeight(prev, placeholders));
      oldestHeightRef.current = page[page.length - 1]!.height;

      const enriched = await enrichBlocks(page);
      setBlocks((prev) => mergeByHeight(prev, enriched, true));
    } catch (err) {
      console.warn("Older blocks fetch failed:", err);
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  }

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 240;
    if (nearEnd) void loadOlder();
  }

  const bip54Count = blocks.filter((b) => b.bip54Compatible).length;

  return (
    <section className="animate-fade-up-delay-1 mb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Recent blocks</h2>
          <p className="mt-1 max-w-2xl text-sm text-fg-muted">
            Newest on the left — scroll right for older blocks. A{" "}
            <span className="font-mono text-accent-text">BIP54</span> tag means
            the coinbase sets{" "}
            <span className="font-mono text-accent-text">
              nLockTime = height − 1
            </span>{" "}
            (forward-compat, not version-bit signaling).
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!initialLoading && !error && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              {bip54Count}/{blocks.length} BIP54
            </span>
          )}
        </div>
      </div>

      <div className="surface overflow-hidden p-3 sm:p-4">
        {error ? (
          <p className="px-2 py-8 text-center text-sm text-warning">{error}</p>
        ) : (
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="block-strip-scroll flex gap-3 overflow-x-auto overscroll-x-contain pb-3"
          >
            {initialLoading
              ? Array.from({ length: 10 }, (_, i) => (
                  <SkeletonBlock key={i} />
                ))
              : blocks.map((block, index) => (
                  <BlockCube
                    key={block.id}
                    block={block}
                    isTip={index === 0}
                  />
                ))}
            {loadingOlder && <SkeletonBlock />}
            {!initialLoading && !error && (
              <button
                type="button"
                onClick={() => void loadOlder()}
                disabled={loadingOlder}
                className="flex h-38 w-16 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong text-fg-subtle transition hover:border-accent/40 hover:text-accent-text disabled:opacity-50"
                aria-label="Load older blocks"
              >
                <span className="text-lg leading-none">→</span>
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  Older
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function mergeByHeight(
  prev: ChainBlock[],
  incoming: ChainBlock[],
  replaceExisting = false,
): ChainBlock[] {
  const map = new Map(prev.map((b) => [b.height, b]));
  for (const block of incoming) {
    const existing = map.get(block.height);
    if (!existing) {
      map.set(block.height, block);
    } else if (replaceExisting) {
      map.set(block.height, block);
    }
  }
  return [...map.values()].sort((a, b) => b.height - a.height);
}

function BlockCube({
  block,
  isTip,
}: {
  block: ChainBlock;
  isTip: boolean;
}) {
  const fill = medianFeeColor(block.medianFee);
  const time = formatAge(block.timestamp);

  return (
    <article
      className={`relative flex h-38 w-22 shrink-0 flex-col overflow-hidden rounded-lg border ${
        block.bip54Compatible
          ? "border-accent/70 shadow-[0_0_0_1px_rgba(212,163,92,0.35)]"
          : "border-border"
      }`}
      title={`#${block.height} · ${block.poolName} · ${block.medianFee.toFixed(1)} sat/vB${
        block.bip54Compatible ? " · BIP54-compatible coinbase" : ""
      }`}
    >
      {block.bip54Compatible && (
        <span className="absolute top-1.5 left-1.5 z-10 rounded-sm bg-[#1a140c] px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide text-accent shadow-[0_1px_0_rgba(0,0,0,0.45)] ring-1 ring-accent">
          BIP54
        </span>
      )}
      {isTip && (
        <span className="absolute top-1.5 right-1.5 z-10 rounded bg-bg/80 px-1 py-0.5 font-mono text-[8px] uppercase tracking-wider text-accent-text">
          tip
        </span>
      )}

      <div
        className="relative flex flex-1 flex-col justify-end p-2"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${fill} 55%, #12151b) 0%, ${fill} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,16,0.15),transparent_40%,rgba(11,13,16,0.45))]" />
        <div className="relative">
          <div className="font-mono text-[11px] font-semibold text-white drop-shadow">
            {block.height.toLocaleString()}
          </div>
          <div className="mt-0.5 truncate text-[10px] text-white/85">
            {block.poolName}
          </div>
          <div className="mt-1 flex items-center justify-between gap-1 font-mono text-[9px] text-white/75">
            <span>{formatFee(block.medianFee)}</span>
            <span>{time}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-black/20 bg-bg-muted px-2 py-1 font-mono text-[9px] text-fg-subtle">
        {block.txCount.toLocaleString()} tx
      </div>
    </article>
  );
}

function SkeletonBlock() {
  return (
    <div className="h-38 w-22 shrink-0 animate-pulse rounded-lg border border-border bg-bg-muted" />
  );
}

function formatFee(fee: number): string {
  if (fee < 10) return `${fee.toFixed(1)}`;
  return `${Math.round(fee)}`;
}

function formatAge(timestampSec: number): string {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000 - timestampSec));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
