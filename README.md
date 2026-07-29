# BIP54 Dashboard

Educational Next.js web app for [BIP54: Consensus Cleanup](https://github.com/bitcoin/bips/blob/master/bip-0054.md) — a Bitcoin soft fork proposal that addresses four long-standing consensus weaknesses.

## Features

- **Dashboard** — proposal overview, signaling/readiness status, timeline, fix summaries, and links to official resources
- **Simulator** — interactive labs for timewarp, poison blocks, Merkle ambiguity, and duplicate coinbases, with a BIP54 on/off toggle

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

BIP54 is marked **Complete** in `bitcoin/bips` (number assigned 2025-04-11, merged 2025-04-29), but that is a document status only: formal version-bit signaling has **not** started and the activation method is still TBD.

Some mining pools already produce **BIP54-compatible coinbases** (`nLockTime = height − 1`) — that is forward-compatibility, not a vote for activation. Pool/share figures on the dashboard are snapshot values as of 2026-07-28 and should be refreshed from these sources:

- share of compatible coinbases — [chart](https://mainnet.observer/charts/transactions-coinbase-locktime-bip54/) · [raw data](https://mainnet.observer/csv/coinbase_locktime_set_bip54_avg.csv) (paired with [`date.csv`](https://mainnet.observer/csv/date.csv))
- first compatible coinbase per pool — [chart](https://mainnet.observer/charts/mining-pools-mining-bip54-coinbase/) · [raw CSV](https://mainnet.observer/csv/miningpools-mining-bip54-coinbase.csv)
