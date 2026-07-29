import { ImageResponse } from "next/og";
import { BIP54 } from "@/lib/bip54";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "BIP54 Dashboard — Bitcoin Consensus Cleanup soft fork";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Bitcoin soft fork proposal"
        title="BIP54: Consensus Cleanup"
        subtitle="Pool readiness, activation status, and interactive simulations of the four consensus bugs it closes."
        tiles={[
          { label: "Proposal status", value: BIP54.status },
          {
            label: "Formal signaling",
            value: "Not started",
            color: "#e0b45a",
          },
          {
            label: "Recent blocks compatible",
            value: `~${BIP54.poolReadiness.recentSharePct}%`,
            color: "#6fbf9a",
          },
        ]}
      />
    ),
    size,
  );
}
