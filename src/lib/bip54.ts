export const BIP54 = {
  title: "BIP54: Consensus Cleanup",
  shortTitle: "BIP54",
  tagline:
    "A soft fork proposal that closes four long-standing Bitcoin consensus weaknesses.",
  author: "Antoine Poinsot",
  status: "Proposed",
  type: "Standards Track — Consensus (soft fork)",
  created: "2025",
  activation: {
    method: "Not yet finalized",
    signaling: "Not started",
    threshold: "TBD (historically ~95% of blocks in a difficulty period)",
    note: "Previous soft forks used BIP9 or BIP8 version-bit signaling. BIP54’s activation mechanism is still under community discussion.",
  },
  fixes: [
    {
      id: "timewarp",
      name: "Timewarp attack",
      summary:
        "Stops miners from manipulating timestamps across difficulty periods to drive difficulty toward the minimum.",
      impact:
        "Without a fix, a hashrate majority could eventually produce ~6 blocks/second and mine remaining subsidy in ~40 days.",
      fix: "Require a minimum timestamp for the first block of each difficulty period, plus a non-negative period duration.",
    },
    {
      id: "poison",
      name: "Slow-to-validate blocks",
      summary:
        "Legacy scripts can be crafted so a valid block takes an hour or more to verify on modest hardware.",
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
        "BIP30 prevents duplicate txids, but a BIP34 gap means expensive checks return near block ~2,000,000.",
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
      description: "BIP54 validation rules (regtest) without mainnet activation.",
      href: "https://github.com/bitcoin/bitcoin/pull/35793",
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
      detail: "Antoine Poinsot restarts research and community discussion on Delving Bitcoin.",
    },
    {
      year: "2025",
      label: "BIP54 published",
      detail: "Specification merged into bitcoin/bips as BIP54.",
    },
    {
      year: "2026",
      label: "Implementations",
      detail: "Tested on Bitcoin Inquisition / Signet; Core PR for consensus rules under review.",
    },
  ],
} as const;

export type FixId = (typeof BIP54.fixes)[number]["id"];
