export const BIP54 = {
  title: "BIP54: Consensus Cleanup",
  shortTitle: "BIP54",
  tagline:
    "A soft fork proposal that closes four long-standing Bitcoin consensus weaknesses.",
  author: "Antoine Poinsot",
  coAuthor: "Matt Corallo",
  status: "Complete",
  type: "Specification — Layer: Consensus (soft fork)",
  created: "2025-04-11",
  activation: {
    method: "Not yet finalized",
    signaling: "Not started",
    threshold: "TBD (historically ~90–95% of blocks in a difficulty period)",
    note: "No activation bit has been assigned. Previous soft forks used BIP9 or BIP8 version-bit signaling. BIP54’s activation mechanism is still under community discussion — separate from pool forward-compatibility. In November 2026 Antoine Riard (speaking for himself) suggested it could be realistic to start considering activation in the second half of 2027, if the community agrees by then. F2Pool has said it will not signal before a majority is reached.",
  },
  /**
   * Forward-compatible coinbase locktimes (nLockTime = height − 1).
   * This is readiness / compatibility, NOT formal soft-fork signaling.
   * Snapshot fallback for SSR / failed live fetch. The dashboard refreshes
   * these figures client-side from mainnet.observer CSVs (see pool-readiness.ts).
   */
  poolReadiness: {
    asOf: "2026-11-16",
    recentSharePct: 42,
    recentShareNote:
      "On 2026-11-16, 41.7% of mainnet coinbases set nLockTime = height − 1 (BIP54-compatible); the trailing 7-day average was 39.2%. This is not version-bit signaling.",
    sourceLabel: "mainnet.observer",
    sourceHref: "https://mainnet.observer/",
    chartHref:
      "https://mainnet.observer/charts/transactions-coinbase-locktime-bip54/",
    poolsHref:
      "https://mainnet.observer/csv/miningpools-mining-bip54-coinbase.csv",
    pools: [
      {
        name: "Foundry USA",
        firstHeight: 952880,
        firstDate: "2026-06-08",
        compatibleBlocks: 5936,
        note: "Largest adopter by compatible-block count so far",
      },
      {
        name: "MARA Pool",
        firstHeight: 940548,
        firstDate: "2026-03-13",
        compatibleBlocks: 1753,
        note: "Early major-pool adopter (first big pool, March 2026)",
      },
      {
        name: "ViaBTC",
        firstHeight: 949094,
        firstDate: "2026-05-12",
        compatibleBlocks: 2422,
        note: "Second-largest adopter; partial rollout at first (mixed pool software)",
      },
      {
        name: "WhitePool",
        firstHeight: 937404,
        firstDate: "2026-02-19",
        compatibleBlocks: 28,
        note: "Among the first BIP54-compatible mainnet blocks",
      },
      {
        name: "Solo CK",
        firstHeight: 951408,
        firstDate: "2026-05-28",
        compatibleBlocks: 8,
        note: "Solo mining via ckpool",
      },
      {
        name: "CKPool",
        firstHeight: 956021,
        firstDate: "2026-06-30",
        compatibleBlocks: 2,
        note: "Small open pool",
      },
      {
        name: "Unknown",
        firstHeight: 940484,
        firstDate: "2026-03-13",
        compatibleBlocks: 3,
        note: "Unattributed miners",
      },
    ],
  },
  fixes: [
    {
      id: "timewarp",
      name: "Timewarp attack",
      summary:
        "Stops miners from manipulating timestamps across difficulty periods to drive difficulty toward the minimum.",
      impact:
        "A majority-hashrate attacker can bring difficulty down to its minimum within 38 days, arbitrarily raising the block rate and stealing subsidy from future miners.",
      fix: "Require a minimum timestamp for the first block of each difficulty period, plus a non-negative period duration.",
    },
    {
      id: "poison",
      name: "Slow-to-validate blocks",
      summary:
        "Legacy scripts can be crafted so a valid block takes several minutes to verify on high-end hardware, and up to a few hours on lower-end devices.",
      impact:
        "Creates DoS pressure, favors large miners, and pushes out node operators on consumer hardware.",
      fix: "Cap legacy signature operations at 2,500 per non-coinbase transaction (~40× better worst-case validation).",
    },
    {
      id: "merkle",
      name: "Merkle tree weakness",
      summary:
        "A 64-byte transaction is the same size as an internal Merkle node, enabling forged SPV inclusion proofs.",
      impact:
        "Lightweight wallets and SPV verifiers can be tricked into accepting a payment that never existed on-chain.",
      fix: "Make witness-stripped 64-byte transactions consensus-invalid (also specified in BIP53).",
    },
    {
      id: "duplicate",
      name: "Duplicate coinbase risk",
      summary:
        "BIP30 prevents duplicate txids, but early BIP34 violations mean explicit BIP30 checks must return at block 1,983,702.",
      impact:
        "Extra validation cost forever, and designs like Utreexo struggle with BIP30-style checks.",
      fix: "Require coinbase nLockTime = height − 1 (and nSequence ≠ 0xffffffff) so uniqueness is built-in.",
    },
  ],
  resources: [
    {
      title: "Official BIP text",
      description: "Full specification in the bitcoin/bips repository.",
      href: "https://github.com/bitcoin/bips/blob/master/bip-0054.md",
    },
    {
      title: "Readable BIP rendering",
      description: "Human-friendly view of BIP54 on bips.dev.",
      href: "https://bips.dev/54/",
    },
    {
      title: "BIP54.org",
      description: "Community explainer covering all four fixes and FAQ.",
      href: "https://bip54.org/",
    },
    {
      title: "mainnet.observer — BIP54 coinbases",
      description:
        "Live chart of the share of blocks with BIP54-compatible coinbase locktimes.",
      href: "https://mainnet.observer/charts/transactions-coinbase-locktime-bip54/",
    },
    {
      title: "mainnet.observer — first BIP54 coinbase by pool",
      description: "When each mining pool first mined a BIP54-valid coinbase.",
      href: "https://mainnet.observer/charts/mining-pools-mining-bip54-coinbase/",
    },
    {
      title: "Bitcoin Optech topic",
      description: "News and technical notes on the consensus cleanup soft fork.",
      href: "https://bitcoinops.org/en/topics/consensus-cleanup-soft-fork/",
    },
    {
      title: "BIPs PR #1800",
      description: "Pull request that merged BIP54 into bitcoin/bips.",
      href: "https://github.com/bitcoin/bips/pull/1800",
    },
    {
      title: "Bitcoin Core implementation PR",
      description:
        "BIP54 validation rules (regtest) without mainnet activation — under review.",
      href: "https://github.com/bitcoin/bitcoin/pull/35793",
    },
    {
      title: "Bitcoin Core: miner Murch-Zawy rule",
      description:
        "Merged Sept 2026: block templates already respect BIP54's period-duration rule.",
      href: "https://github.com/bitcoin/bitcoin/pull/35949",
    },
    {
      title: "Bitcoin Inquisition (signet)",
      description: "BIP54 implementation merged Feb 2026 for testing on signet.",
      href: "https://github.com/bitcoin-inquisition/bitcoin/pull/99",
    },
  ],
  milestones: [
    {
      year: "2019",
      label: "Original draft",
      detail: "Matt Corallo proposes an early consensus cleanup soft fork.",
    },
    {
      year: "2023–24",
      label: "Revival",
      detail:
        "Antoine Poinsot restarts research and community discussion on Delving Bitcoin.",
    },
    {
      year: "2025",
      label: "BIP54 published",
      detail:
        "Number assigned 2025-04-11 and specification merged into bitcoin/bips on 2025-04-29; later marked Complete.",
    },
    {
      year: "Feb 2026",
      label: "Signet testing",
      detail:
        "Bitcoin Inquisition merges BIP54, so the rules can be tested on signet. WhitePool mines the first BIP54-compatible mainnet coinbases.",
    },
    {
      year: "Mar–Jun 2026",
      label: "Pool forward-compat",
      detail:
        "MARA, ViaBTC and Foundry switch to BIP54-compatible coinbases, reaching ~40% of blocks. On 2026-05-22 the BIP is moved to Complete.",
    },
    {
      year: "Aug 2026",
      label: "F2Pool holds back",
      detail:
        "F2Pool says it will not signal for BIP54 before a formal majority is reached, criticizing the bundling of four changes, but would update its nodes if it gains support.",
    },
    {
      year: "Sep 2026",
      label: "Core miner rule merged",
      detail:
        "Bitcoin Core merges #35949: block templates enforce BIP54's Murch-Zawy timestamp rule. The full validation PR #35793 stays under review.",
    },
    {
      year: "Nov 2026",
      label: "Activation talk",
      detail:
        "Antoine Riard suggests activation could realistically be considered in the second half of 2027. The 64-byte transaction rule remains the most debated part.",
    },
  ],
} as const;

export type FixId = (typeof BIP54.fixes)[number]["id"];
