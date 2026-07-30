/** Client-side helpers for mempool.space public REST API (CORS: *). */

const MEMPOOL_API = "https://mempool.space/api";

export type MempoolBlockExtras = {
  medianFee?: number;
  pool?: { id?: number; name?: string; slug?: string };
};

export type MempoolBlock = {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  extras?: MempoolBlockExtras;
};

export type ChainBlock = {
  id: string;
  height: number;
  timestamp: number;
  txCount: number;
  size: number;
  weight: number;
  medianFee: number;
  poolName: string;
  /** BIP54-compatible coinbase: nLockTime = height − 1 and nSequence ≠ 0xffffffff */
  bip54Compatible: boolean;
};

type CoinbaseTx = {
  locktime: number;
  vin: Array<{ sequence: number; is_coinbase?: boolean }>;
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`mempool.space ${response.status} for ${url}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchTipHeight(signal?: AbortSignal): Promise<number> {
  return fetchJson<number>(`${MEMPOOL_API}/blocks/tip/height`, signal);
}

/** Past 15 blocks at or before `startHeight` (newest first). */
export async function fetchBlocksPage(
  startHeight: number,
  signal?: AbortSignal,
): Promise<MempoolBlock[]> {
  return fetchJson<MempoolBlock[]>(
    `${MEMPOOL_API}/v1/blocks/${startHeight}`,
    signal,
  );
}

async function fetchCoinbase(
  blockHash: string,
  signal?: AbortSignal,
): Promise<CoinbaseTx | null> {
  const txs = await fetchJson<CoinbaseTx[]>(
    `${MEMPOOL_API}/block/${blockHash}/txs/0`,
    signal,
  );
  const coinbase = txs[0];
  if (!coinbase?.vin?.[0]) return null;
  return coinbase;
}

export function isBip54Compatible(
  height: number,
  coinbase: CoinbaseTx | null,
): boolean {
  if (!coinbase) return false;
  const sequence = coinbase.vin[0]?.sequence;
  if (sequence === undefined) return false;
  return coinbase.locktime === height - 1 && sequence !== 0xffffffff;
}

export async function enrichBlocks(
  blocks: MempoolBlock[],
  signal?: AbortSignal,
): Promise<ChainBlock[]> {
  const enriched = await Promise.all(
    blocks.map(async (block) => {
      let bip54Compatible = false;
      try {
        const coinbase = await fetchCoinbase(block.id, signal);
        bip54Compatible = isBip54Compatible(block.height, coinbase);
      } catch {
        bip54Compatible = false;
      }

      return {
        id: block.id,
        height: block.height,
        timestamp: block.timestamp,
        txCount: block.tx_count,
        size: block.size,
        weight: block.weight,
        medianFee: block.extras?.medianFee ?? 0,
        poolName: block.extras?.pool?.name ?? "Unknown",
        bip54Compatible,
      };
    }),
  );

  return enriched;
}

export async function fetchEnrichedBlocksPage(
  startHeight: number,
  signal?: AbortSignal,
): Promise<ChainBlock[]> {
  const page = await fetchBlocksPage(startHeight, signal);
  return enrichBlocks(page, signal);
}

/** Fee heat similar to mempool.space block cubes. */
export function medianFeeColor(fee: number): string {
  if (fee < 1) return "#1a9f7a";
  if (fee < 2) return "#2f9e5f";
  if (fee < 4) return "#6f9f3a";
  if (fee < 8) return "#b89a2e";
  if (fee < 20) return "#c77a2e";
  if (fee < 50) return "#c45a3a";
  return "#b83a4a";
}
