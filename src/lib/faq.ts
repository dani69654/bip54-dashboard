import { BIP54 } from "@/lib/bip54";

/**
 * FAQ entries rendered on /faq and emitted as FAQPage JSON-LD.
 * `links` are internal follow-ups shown under each answer.
 */
export type FaqItem = {
  q: string;
  a: string[];
  links?: { label: string; href: string }[];
};

export const FAQ: FaqItem[] = [
  {
    q: "What is BIP54?",
    a: [
      `BIP54, called "Consensus Cleanup", is a Bitcoin soft fork proposal by ${BIP54.author} that builds on an earlier ${BIP54.coAuthor} proposal. It fixes four long-standing weaknesses in Bitcoin's consensus rules: the timewarp attack, slow-to-validate blocks, the 64-byte transaction Merkle tree weakness and duplicate coinbase transactions.`,
    ],
    links: [{ label: "Dashboard overview", href: "/" }],
  },
  {
    q: "Is BIP54 a soft fork or a hard fork?",
    a: [
      "A soft fork. Each BIP54 rule only makes some currently valid blocks or transactions invalid, and none of them is produced by honest miners or normal wallets. Nodes that don't upgrade still accept every block that follows the new rules, so the chain doesn't split as long as most of the hashrate enforces them.",
    ],
  },
  {
    q: "What does the Consensus Cleanup actually fix?",
    a: [
      "Four things. The timewarp attack lets a hashrate majority push difficulty to its minimum. Crafted legacy-script blocks can take minutes to hours to validate. 64-byte transactions can be confused with Merkle tree nodes, which allows forged SPV proofs. Duplicate coinbase transactions would force costly BIP30 checks to come back at block 1,983,702.",
    ],
    links: [
      { label: "Timewarp attack", href: "/timewarp-attack" },
      { label: "Slow-to-validate blocks", href: "/slow-blocks-legacy-sigops" },
      { label: "64-byte transactions", href: "/64-byte-transactions" },
      { label: "Duplicate coinbase", href: "/duplicate-coinbase" },
    ],
  },
  {
    q: "When will BIP54 activate?",
    a: [
      "There is no activation date yet. The specification is complete and a Bitcoin Core implementation exists, but no activation mechanism, version bit or signaling period has been agreed. Earlier soft forks used BIP9 or BIP8 version-bit signaling with a threshold of about 90–95% of blocks in a difficulty period.",
    ],
    links: [{ label: "Activation status", href: "/activation" }],
  },
  {
    q: "Are mining pools already supporting BIP54?",
    a: [
      `Many pools already produce coinbases that follow BIP54's new rule, with nLockTime set to the block height minus one. On ${BIP54.poolReadiness.asOf} about ${BIP54.poolReadiness.recentSharePct}% of mainnet blocks did, including blocks from Foundry USA, MARA Pool and ViaBTC. That is forward compatibility, not activation signaling: pools are getting ready, not voting.`,
    ],
    links: [{ label: "Live pool readiness", href: "/" }],
  },
  {
    q: "Do I need to do anything as a Bitcoin user?",
    a: [
      "No. Ordinary wallets never create 64-byte transactions or transactions with more than 2,500 legacy signature operations, and the timestamp and coinbase rules only affect miners. Once BIP54 activates, upgrading your node lets it enforce the new rules itself instead of relying on miners to do so.",
    ],
  },
  {
    q: "Who needs to change something for BIP54?",
    a: [
      "Mostly miners and pools. They need coinbase transactions with nLockTime = height − 1 and a non-final nSequence, and mining software that respects the new timestamp limits at difficulty period boundaries. Node software must implement the rules. Wallets, exchanges and Lightning nodes are not affected.",
    ],
    links: [{ label: "Coinbase rule explained", href: "/duplicate-coinbase" }],
  },
  {
    q: "How is BIP54 related to the Great Consensus Cleanup?",
    a: [
      "BIP54 is the revival of the \"Great Consensus Cleanup\" Matt Corallo proposed in 2019. Antoine Poinsot restarted the research in 2023–24 on Delving Bitcoin, measured each problem again, dropped or changed some of the original ideas and added the duplicate-coinbase fix. The result was published as BIP54 in 2025.",
    ],
  },
  {
    q: "How is BIP54 related to BIP53?",
    a: [
      "BIP53 proposes only one rule: making 64-byte transactions invalid. BIP54 includes the same rule along with the timewarp, legacy sigops and coinbase fixes, so activating BIP54 also covers BIP53.",
    ],
    links: [{ label: "64-byte transactions", href: "/64-byte-transactions" }],
  },
  {
    q: "Does BIP54 change Bitcoin's 21 million supply or block size?",
    a: [
      "No. BIP54 doesn't change the subsidy schedule, block weight limit or any transaction format people use. By fixing the timewarp attack it actually protects the issuance schedule, because a timewarp attacker could mine the remaining subsidy far faster than intended.",
    ],
  },
  {
    q: "Can I try the attacks BIP54 prevents?",
    a: [
      "Yes. The simulator has a guided, interactive lab for each of the four problems, and you can toggle BIP54's rules on and off to see the difference.",
    ],
    links: [{ label: "Open the simulator", href: "/simulator" }],
  },
];
