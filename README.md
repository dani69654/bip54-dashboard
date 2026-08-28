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

## SEO

Set the canonical origin before deploying — everything else derives from it:

```bash
cp .env.example .env.local   # then edit NEXT_PUBLIC_SITE_URL if needed
```

Production builds default to `https://bip-54.com` when the env var is unset.
Local `next dev` uses `http://localhost:3000`, and in that case `robots.txt`
returns `Disallow: /` so preview deployments are not indexed.

What is wired up:

- `metadataBase`, title template, description, keywords and per-page canonicals (`src/app/layout.tsx`, `src/app/simulator/page.tsx`)
- Open Graph + Twitter card metadata, with generated 1200×630 OG images per route (`src/app/opengraph-image.tsx`, `src/app/simulator/opengraph-image.tsx`, shared frame in `src/lib/og.tsx`)
- `robots.txt` and `sitemap.xml` as route handlers (`src/app/robots.ts`, `src/app/sitemap.ts`); `lastModified` tracks the data snapshot, not the build time
- JSON-LD: `WebSite` (layout), `TechArticle` + `Dataset` (dashboard), `WebApplication` (simulator)
- `viewport` export with `themeColor` / `colorScheme` (the `metadata.themeColor` field is deprecated in Next.js ≥ 14)
- Both routes are statically prerendered, and the simulator's static content is server-rendered so it is present in the initial HTML rather than behind the client-side Suspense boundary

Post-deploy checklist: verify `/sitemap.xml` and `/robots.txt`, submit the sitemap in
Google Search Console and [Bing Webmaster Tools](https://www.bing.com/webmasters)
(DuckDuckGo snippets come from Bing), and test the JSON-LD with the
[Rich Results Test](https://search.google.com/test/rich-results).

## Notes

BIP54 is marked **Complete** in `bitcoin/bips` (number assigned 2025-04-11, merged 2025-04-29), but that is a document status only: formal version-bit signaling has **not** started and the activation method is still TBD.

Some mining pools already produce **BIP54-compatible coinbases** (`nLockTime = height − 1`) — that is forward-compatibility, not a vote for activation.

Pool/share figures load **live in the browser** from mainnet.observer CSVs (via same-origin `/data/*` rewrites in `next.config.ts`, because the upstream host does not send CORS headers). The HTML first paints a baked-in snapshot from `src/lib/bip54.ts` and falls back to it if the fetch fails:

- share of compatible coinbases — [chart](https://mainnet.observer/charts/transactions-coinbase-locktime-bip54/) · [raw data](https://mainnet.observer/csv/coinbase_locktime_set_bip54_avg.csv) (paired with [`date.csv`](https://mainnet.observer/csv/date.csv))
- first compatible coinbase per pool — [chart](https://mainnet.observer/charts/mining-pools-mining-bip54-coinbase/) · [raw CSV](https://mainnet.observer/csv/miningpools-mining-bip54-coinbase.csv)

On Cloudflare Pages this needs the Next.js runtime (so `next.config.ts` rewrites can proxy `/data/*`). A pure static-asset export will not proxy those paths — in that case the UI keeps the snapshot and shows “Snapshot”.
