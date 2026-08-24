import { BIP54 } from "@/lib/bip54";

export type PoolStats = {
  name: string;
  firstHeight: number;
  firstDate: string;
  compatibleBlocks: number;
  note: string;
};

export type PoolReadiness = {
  asOf: string;
  recentSharePct: number;
  recentShareNote: string;
  sourceLabel: string;
  sourceHref: string;
  chartHref: string;
  poolsHref: string;
  pools: PoolStats[];
};

/** Same-origin paths rewritten to mainnet.observer (avoids browser CORS). */
export const POOL_READINESS_DATA = {
  pools: "/data/miningpools-mining-bip54-coinbase.csv",
  avg: "/data/coinbase_locktime_set_bip54_avg.csv",
  date: "/data/date.csv",
} as const;

const POOL_NOTES: Record<string, string> = Object.fromEntries(
  BIP54.poolReadiness.pools.map((pool) => [pool.name, pool.note]),
);

export const POOL_READINESS_FALLBACK: PoolReadiness = {
  asOf: BIP54.poolReadiness.asOf,
  recentSharePct: BIP54.poolReadiness.recentSharePct,
  recentShareNote: BIP54.poolReadiness.recentShareNote,
  sourceLabel: BIP54.poolReadiness.sourceLabel,
  sourceHref: BIP54.poolReadiness.sourceHref,
  chartHref: BIP54.poolReadiness.chartHref,
  poolsHref: BIP54.poolReadiness.poolsHref,
  pools: BIP54.poolReadiness.pools.map((pool) => ({ ...pool })),
};

function parseCsvLines(text: string): string[] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parsePoolsCsv(text: string): PoolStats[] {
  const lines = parseCsvLines(text);
  if (lines.length < 2) {
    throw new Error("Pool CSV is empty");
  }

  const header = lines[0]!.toLowerCase();
  if (!header.includes("pool") || !header.includes("height")) {
    throw new Error("Unexpected pool CSV header");
  }

  const pools: PoolStats[] = [];
  for (const line of lines.slice(1)) {
    const [name, heightRaw, date, totalRaw] = line.split(",");
    if (!name || !heightRaw || !date || totalRaw === undefined) continue;

    const firstHeight = Number(heightRaw);
    const compatibleBlocks = Number(totalRaw);
    if (!Number.isFinite(firstHeight) || !Number.isFinite(compatibleBlocks)) {
      continue;
    }

    pools.push({
      name,
      firstHeight,
      firstDate: date,
      compatibleBlocks,
      note: POOL_NOTES[name] ?? "",
    });
  }

  if (pools.length === 0) {
    throw new Error("No pools parsed from CSV");
  }

  return pools.sort((a, b) => b.compatibleBlocks - a.compatibleBlocks);
}

export function parseShareSeries(
  avgText: string,
  dateText: string,
): { date: string; share: number }[] {
  const avgLines = parseCsvLines(avgText);
  const dateLines = parseCsvLines(dateText);
  if (avgLines.length < 2 || dateLines.length < 2) {
    throw new Error("Share CSV is empty");
  }

  const avgs = avgLines.slice(1).map((value) => Number(value));
  const dates = dateLines.slice(1);
  const len = Math.min(avgs.length, dates.length);
  const series: { date: string; share: number }[] = [];

  for (let i = 0; i < len; i++) {
    const share = avgs[i]!;
    const date = dates[i]!;
    if (!Number.isFinite(share) || !date) continue;
    series.push({ date, share });
  }

  if (series.length === 0) {
    throw new Error("No share samples parsed");
  }

  return series;
}

function formatPct(fraction: number, digits = 1): string {
  return (fraction * 100).toFixed(digits);
}

/**
 * Today's row is often 0.0000 while the day is still open / unfinalized.
 * Prefer the most recent day with a positive share.
 */
export function pickLatestShareSample(
  series: { date: string; share: number }[],
): { latest: { date: string; share: number }; endIndex: number } {
  for (let i = series.length - 1; i >= 0; i--) {
    const point = series[i]!;
    if (point.share > 0) {
      return { latest: point, endIndex: i };
    }
  }
  const endIndex = series.length - 1;
  return { latest: series[endIndex]!, endIndex };
}

export function buildPoolReadiness(
  poolsText: string,
  avgText: string,
  dateText: string,
): PoolReadiness {
  const pools = parsePoolsCsv(poolsText);
  const series = parseShareSeries(avgText, dateText);
  const { latest, endIndex } = pickLatestShareSample(series);
  const window = series.slice(Math.max(0, endIndex - 6), endIndex + 1);
  const trailingAvg =
    window.reduce((sum, point) => sum + point.share, 0) / window.length;

  const recentSharePct = Math.round(latest.share * 100);
  const asOf = latest.date;

  return {
    asOf,
    recentSharePct,
    recentShareNote: `On ${asOf}, ${formatPct(latest.share)}% of mainnet coinbases set nLockTime = height − 1 (BIP54-compatible); the trailing 7-day average was ${formatPct(trailingAvg)}%. This is not version-bit signaling.`,
    sourceLabel: BIP54.poolReadiness.sourceLabel,
    sourceHref: BIP54.poolReadiness.sourceHref,
    chartHref: BIP54.poolReadiness.chartHref,
    poolsHref: BIP54.poolReadiness.poolsHref,
    pools,
  };
}

async function fetchText(url: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

/** Browser-side fetch via same-origin `/data/*` rewrites (see next.config.ts). */
export async function fetchPoolReadinessLive(
  signal?: AbortSignal,
): Promise<PoolReadiness> {
  const [poolsText, avgText, dateText] = await Promise.all([
    fetchText(POOL_READINESS_DATA.pools, signal),
    fetchText(POOL_READINESS_DATA.avg, signal),
    fetchText(POOL_READINESS_DATA.date, signal),
  ]);
  return buildPoolReadiness(poolsText, avgText, dateText);
}
