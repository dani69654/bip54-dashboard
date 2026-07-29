import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "BIP54 problem simulator — timewarp, poison blocks, Merkle, coinbase";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Interactive learning"
        title="BIP54 problem simulator"
        subtitle="Guided labs for the timewarp attack, slow-to-validate blocks, Merkle ambiguity and duplicate coinbases — with BIP54 on or off."
        tiles={[
          { label: "Scenarios", value: "4 guided labs" },
          { label: "Toggle", value: "BIP54 on / off", color: "#6fbf9a" },
        ]}
      />
    ),
    size,
  );
}
