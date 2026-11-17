import { ImageResponse } from "next/og";
import { FAQ } from "@/lib/faq";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "BIP54 FAQ — Bitcoin Consensus Cleanup questions answered";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Frequently asked questions"
        title="BIP54 FAQ"
        subtitle="Soft fork or hard fork? When does it activate? Do users need to do anything? Clear answers."
        tiles={[
          { label: "Questions answered", value: String(FAQ.length) },
          { label: "Fork type", value: "Soft fork", color: "#6fbf9a" },
        ]}
      />
    ),
    size,
  );
}
