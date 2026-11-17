import type { FixId } from "@/lib/bip54";

/**
 * Long-form explainer pages, one per consensus fix. Each is served at
 * `/<slug>` by `src/app/[topic]/page.tsx` and listed in the sitemap.
 * Slugs target the phrases people actually search for.
 */

export type TopicSection = {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
};

export type Topic = {
  slug: string;
  fixId: FixId;
  /** <title> and H1. */
  title: string;
  /** Short label used in nav lists and related links. */
  label: string;
  eyebrow: string;
  description: string;
  /** One-paragraph answer shown first: what searchers want in 5 seconds. */
  tldr: string;
  keywords: string[];
  sections: TopicSection[];
  /** Key numbers shown as tiles (and in the OG image). */
  facts: { label: string; value: string }[];
  references: { title: string; href: string }[];
};

const BIP_TEXT = "https://github.com/bitcoin/bips/blob/master/bip-0054.md";

export const TOPICS: Topic[] = [
  {
    slug: "timewarp-attack",
    fixId: "timewarp",
    title: "The Bitcoin timewarp attack, and how BIP54 fixes it",
    label: "Timewarp attack",
    eyebrow: "BIP54 fix 01 · Difficulty adjustment",
    description:
      "How the Bitcoin timewarp attack lets a majority of hashrate push difficulty to its minimum by manipulating block timestamps, and the two timestamp rules BIP54 adds to stop it.",
    tldr: "Bitcoin's difficulty adjustment measures each 2,016-block period using only blocks inside that period, so consecutive periods are never linked. A miner controlling most of the hashrate can exploit that gap with fake timestamps, making every period look slower than it was. Difficulty then falls period after period while blocks keep coming faster. BIP54 closes the gap by limiting how far the first block of a period can go back in time compared with the block before it.",
    keywords: [
      "timewarp attack",
      "bitcoin timewarp",
      "difficulty adjustment bug",
      "BIP54 timewarp fix",
      "Murch-Zawy attack",
    ],
    facts: [
      { label: "Retarget interval", value: "2,016 blocks" },
      { label: "Grace period (BIP54)", value: "7,200 s" },
      { label: "Attack requires", value: "Majority hashrate" },
    ],
    sections: [
      {
        heading: "How Bitcoin adjusts difficulty",
        paragraphs: [
          "Every 2,016 blocks, nodes compare how long the period took against the two-week target and scale the difficulty up or down, by at most a factor of four. The elapsed time comes from block timestamps, which are chosen by miners within loose limits: a timestamp must be greater than the median of the previous 11 blocks (median time past) and no more than two hours ahead of a node's own clock.",
          "Because of an off-by-one in Satoshi's original code, a period's duration is measured from its first block to its last block. The time between the last block of one period and the first block of the next is never counted anywhere.",
        ],
      },
      {
        heading: "How the timewarp attack works",
        paragraphs: [
          "An attacker with a majority of the hashrate keeps almost every timestamp as low as the median-time-past rule allows, so the clock barely advances. On the last block of each period they set the timestamp as far into the future as possible. That period now looks long, so difficulty drops.",
          "The next period starts again with a low timestamp, back in the past, because nothing ties its first block to the previous period's last block. Repeat this every period and difficulty keeps falling while real block production speeds up. The BIP54 text estimates that difficulty could reach its minimum in about 38 days.",
        ],
        bullets: [
          "Block production can go far faster than one block every 10 minutes.",
          "The remaining subsidy gets issued early, taking revenue from future miners.",
          "Timelocks based on block height expire much sooner than expected.",
          "Fee markets and the network's security budget break down while it lasts.",
        ],
      },
      {
        heading: "Why it hasn't happened",
        paragraphs: [
          "The attack is slow and very visible: timestamps drift from real time over days, so the community would see it coming. It still needs a majority of hashrate, and miners holding that much would wreck the value of their own rewards. That is deterrence, not a fix. Testnet4 (BIP94) already ships the same timewarp rule, and BIP54 brings it to mainnet.",
        ],
      },
      {
        heading: "What BIP54 changes",
        paragraphs: [
          "BIP54 requires the timestamp of the first block of each difficulty period to be no more than 7,200 seconds (two hours) earlier than the timestamp of the block before it. This links consecutive periods, so the attacker can no longer jump back in time after inflating the last block's timestamp.",
          "A second rule requires the last block of a period to have a timestamp no lower than the first block of the same period. A period can then never have a negative duration, which closes a related variant sometimes called the Murch-Zawy attack, where difficulty is manipulated within a single period.",
          "Both rules only restrict timestamps that honest miners never produce, so the change is a soft fork. Existing mining software following the current rules already complies under normal conditions.",
        ],
      },
    ],
    references: [
      { title: "BIP54 specification: timewarp section", href: BIP_TEXT },
      {
        title: "Delving Bitcoin: Great Consensus Cleanup revival",
        href: "https://delvingbitcoin.org/t/great-consensus-cleanup-revival/710",
      },
      {
        title: "Bitcoin Optech: consensus cleanup topic",
        href: "https://bitcoinops.org/en/topics/consensus-cleanup-soft-fork/",
      },
    ],
  },
  {
    slug: "64-byte-transactions",
    fixId: "merkle",
    title: "64-byte transactions and the Bitcoin Merkle tree weakness",
    label: "64-byte transactions",
    eyebrow: "BIP54 fix 03 · Merkle tree",
    description:
      "Why a 64-byte Bitcoin transaction can be mistaken for an inner node of the Merkle tree, how that enables fake SPV proofs (CVE-2017-12842), and why BIP54 makes such transactions invalid.",
    tldr: "Each inner node of Bitcoin's Merkle tree is the hash of 64 bytes: two 32-byte child hashes joined together. A transaction whose serialization without witness data is exactly 64 bytes has the same shape, so a Merkle proof can't tell the two apart. An attacker can use this to convince a lightweight (SPV) client that a non-existent transaction was confirmed. BIP54 makes witness-stripped 64-byte transactions consensus-invalid, which removes the ambiguity.",
    keywords: [
      "64 byte transaction",
      "bitcoin merkle tree vulnerability",
      "CVE-2017-12842",
      "SPV proof forgery",
      "BIP53",
    ],
    facts: [
      { label: "Inner node preimage", value: "64 bytes" },
      { label: "CVE", value: "2017-12842" },
      { label: "Already non-standard", value: "Yes" },
    ],
    sections: [
      {
        heading: "How Bitcoin's Merkle tree works",
        paragraphs: [
          "A block header commits to all of the block's transactions through a single 32-byte Merkle root. Transaction IDs are the leaves. Each pair of child hashes is joined into 64 bytes and double-SHA256 hashed to make its parent, until one root remains.",
          "A Merkle proof lets a client check that a transaction is in a block using only the header and a short list of sibling hashes. This is how SPV wallets, sidechains and many bridges verify Bitcoin payments without downloading full blocks.",
        ],
      },
      {
        heading: "The ambiguity",
        paragraphs: [
          "Leaves and inner nodes are hashed the same way, and the tree doesn't record its own depth. A transaction serialized to exactly 64 bytes is therefore hashed exactly like an inner node: its first 32 bytes act as a left child and its last 32 bytes as a right child.",
          "An attacker who gets such a transaction mined can then present a proof that goes one level deeper than the real tree. The verifier believes the transaction's second half is the txid of a payment, a payment that never existed. This is CVE-2017-12842. Producing a usable 64-byte transaction takes brute-force work, but far less than the proof-of-work needed to fake a block.",
          "A second, older problem comes from the same ambiguity: an invalid block can be made to share its Merkle root with a valid one. Bitcoin Core has to treat such blocks carefully so it doesn't permanently mark a valid block as invalid.",
        ],
      },
      {
        heading: "What BIP54 changes",
        paragraphs: [
          "BIP54 makes any transaction whose witness-stripped serialization is exactly 64 bytes invalid by consensus. With no 64-byte transactions allowed, a leaf can never be mistaken for an inner node, so Merkle proofs become unambiguous given a block header.",
          "The same rule is also proposed on its own as BIP53. BIP54 bundles it with the other three fixes.",
        ],
        bullets: [
          "Such transactions have been non-standard in Bitcoin Core for years, so nodes already refuse to relay them.",
          "A 64-byte transaction can't hold a meaningful payment, so no real use case is lost.",
          "SPV clients and bridges can drop the ad-hoc mitigations they use today, such as also requesting the coinbase transaction to learn the tree depth.",
        ],
      },
    ],
    references: [
      { title: "BIP54 specification: 64-byte transactions", href: BIP_TEXT },
      {
        title: "BIP53: disallow 64-byte transactions",
        href: "https://github.com/bitcoin/bips/blob/master/bip-0053.mediawiki",
      },
      {
        title: "Bitcoin Optech: consensus cleanup topic",
        href: "https://bitcoinops.org/en/topics/consensus-cleanup-soft-fork/",
      },
    ],
  },
  {
    slug: "slow-blocks-legacy-sigops",
    fixId: "poison",
    title: "Slow-to-validate Bitcoin blocks and the BIP54 sigops limit",
    label: "Slow-to-validate blocks",
    eyebrow: "BIP54 fix 02 · Validation cost",
    description:
      "How legacy Bitcoin scripts can be abused to build valid blocks that take minutes or hours to validate, and how BIP54's limit of 2,500 legacy signature operations per transaction cuts the worst case about 40×.",
    tldr: "In legacy (pre-SegWit) scripts, each signature check re-hashes a large part of the transaction, so the work grows quadratically with transaction size. A miner can build a valid block packed with such checks that takes several minutes to validate on a high-end machine, and hours on a Raspberry Pi. BIP54 caps the legacy signature operations a single transaction can run at 2,500, which improves worst-case validation time by about 40×.",
    keywords: [
      "bitcoin poison block",
      "slow to validate block",
      "legacy sigops limit",
      "quadratic sighash",
      "BIP54 2500 sigops",
    ],
    facts: [
      { label: "Legacy sigops per tx", value: "≤ 2,500" },
      { label: "Worst case improved", value: "~40×" },
      { label: "Affects SegWit/Taproot", value: "No" },
    ],
    sections: [
      {
        heading: "Why legacy signature checks are expensive",
        paragraphs: [
          "To check a signature, a node first hashes a version of the spending transaction (the signature hash). In legacy scripts, each OP_CHECKSIG or OP_CHECKMULTISIG hashes data proportional to the whole transaction's size. A transaction with many inputs and many signature checks therefore costs roughly quadratic hashing work.",
          "SegWit (BIP143) and Taproot (BIP341) fixed this for their own outputs by caching intermediate hashes. Legacy spends still work the old way, and block weight rules alone don't stop a miner from filling a block with the worst possible legacy scripts.",
        ],
      },
      {
        heading: "The attack",
        paragraphs: [
          "A miner can craft a block of transactions that sit within every current limit yet are designed to maximize hashing and signature-checking work. Research behind BIP54 showed such a block can take several minutes to validate on modern hardware and much longer on consumer devices.",
        ],
        bullets: [
          "Other miners stall while validating, which hands the attacker a head start on the next block.",
          "Large, well-provisioned miners gain an edge over small ones, pushing toward centralization.",
          "Node operators on cheap hardware fall behind or drop off, weakening decentralized validation.",
          "Propagation delays raise stale-block rates across the network.",
        ],
      },
      {
        heading: "What BIP54 changes",
        paragraphs: [
          "BIP54 limits the number of potentially executed legacy signature operations in a single non-coinbase transaction to 2,500. The count covers each input's scriptSig, the output script it spends, and, for P2SH, the redeem script, using accurate counting for OP_CHECKMULTISIG.",
          "Signature checks in SegWit v0 and Taproot inputs don't count toward the limit. The cap is far above what normal transactions use, including large legacy multisig spends, but it removes the worst case. According to the BIP54 analysis, the slowest possible block becomes about 40× faster to validate.",
        ],
      },
    ],
    references: [
      { title: "BIP54 specification: legacy sigops limit", href: BIP_TEXT },
      {
        title: "Delving Bitcoin: Great Consensus Cleanup revival",
        href: "https://delvingbitcoin.org/t/great-consensus-cleanup-revival/710",
      },
      {
        title: "BIP143: SegWit signature hashing",
        href: "https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki",
      },
    ],
  },
  {
    slug: "duplicate-coinbase",
    fixId: "duplicate",
    title: "Duplicate coinbase transactions, BIP30, BIP34 and block 1,983,702",
    label: "Duplicate coinbase",
    eyebrow: "BIP54 fix 04 · Transaction uniqueness",
    description:
      "Why Bitcoin once allowed duplicate coinbase transactions, how BIP30 and BIP34 tried to prevent them, why the problem returns at block 1,983,702, and how BIP54's coinbase nLockTime rule makes txids unique for good.",
    tldr: "Two identical coinbase transactions have the same txid, and in 2010 this actually happened twice and destroyed 100 BTC. BIP30 bans duplicates of unspent transactions, and BIP34 makes coinbases unique by including the block height. But some early coinbases already contain bytes that read as a valid future height, so the expensive BIP30 checks have to come back at block 1,983,702. BIP54 requires every coinbase to set nLockTime to its block height minus one, which makes coinbases unique by construction.",
    keywords: [
      "duplicate coinbase",
      "BIP30",
      "BIP34",
      "block 1983702",
      "coinbase nLockTime",
    ],
    facts: [
      { label: "BIP30 checks return at", value: "1,983,702" },
      { label: "Coinbase nLockTime", value: "height − 1" },
      { label: "Pools already compliant", value: "~42% of blocks" },
    ],
    sections: [
      {
        heading: "How duplicate transactions happened",
        paragraphs: [
          "A coinbase transaction has no real inputs. If two miners produce byte-identical coinbases, for example by paying the same address the same amount, both have the same txid. In 2010, the coinbases of blocks 91,812 and 91,722 were duplicated at blocks 91,842 and 91,880. The second copy overwrote the first in the UTXO set, so one of each pair of outputs can never be spent.",
        ],
      },
      {
        heading: "BIP30 and BIP34",
        paragraphs: [
          "BIP30 (2012) made it invalid for a block to contain a transaction whose txid matches an earlier transaction that still has unspent outputs. It works, but it means a UTXO lookup for every output of every transaction.",
          "BIP34 (2013) required coinbases to start with the block height, which in theory makes every coinbase unique. Bitcoin Core then skips BIP30 checks for blocks after BIP34 activated.",
        ],
      },
      {
        heading: "The problem at block 1,983,702",
        paragraphs: [
          "Some coinbases mined before BIP34 happen to start with bytes that decode as a height push for a large future block. The first such height is 1,983,702, expected around 2046. At that height, a miner could legally repeat an old coinbase, so nodes must bring back full BIP30 validation from then on.",
          "Permanent BIP30 checks add validation cost. They are also hard to support in designs like Utreexo, where nodes don't keep the full UTXO set.",
        ],
      },
      {
        heading: "What BIP54 changes",
        paragraphs: [
          "BIP54 requires the coinbase transaction's nLockTime to equal the block height minus one. It also requires its nSequence to not be 0xffffffff, so the locktime is actually enforced. No pre-BIP54 coinbase can satisfy this at a future height, so coinbase txids become unique for good and BIP30 checks never need to return.",
          "This is the only BIP54 rule that requires miners to change what they produce. Many pools have already switched their coinbases ahead of activation. You can follow that adoption live on the dashboard.",
        ],
      },
    ],
    references: [
      { title: "BIP54 specification: coinbase uniqueness", href: BIP_TEXT },
      {
        title: "BIP30: duplicate transactions",
        href: "https://github.com/bitcoin/bips/blob/master/bip-0030.mediawiki",
      },
      {
        title: "BIP34: block height in coinbase",
        href: "https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki",
      },
    ],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((topic) => topic.slug === slug);
}

/** Last time the explainer copy was meaningfully edited. */
export const TOPICS_UPDATED_AT = "2026-11-17";
