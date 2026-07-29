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

Signaling has not started and the activation method is not finalized. Dashboard signaling figures reflect that pre-activation state and are for education, not live miner telemetry.
