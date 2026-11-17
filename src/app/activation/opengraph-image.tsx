import { ImageResponse } from "next/og";
import { BIP54 } from "@/lib/bip54";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "BIP54 activation status — signaling, timeline and pool readiness";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Activation tracker"
        title="BIP54 activation status"
        subtitle="Signaling, timeline, and which mining pools already produce BIP54-compatible blocks."
        tiles={[
          { label: "Proposal status", value: BIP54.status },
          { label: "Formal signaling", value: BIP54.activation.signaling, color: "#e0b45a" },
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
