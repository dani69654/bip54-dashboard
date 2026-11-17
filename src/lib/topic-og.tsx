import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame } from "@/lib/og";
import { TOPICS, getTopic } from "@/lib/topics";

export const TOPIC_OG_SIZE = OG_SIZE;

/** OG image for an explainer page; each route's opengraph-image.tsx calls this. */
export function topicOgImage(slug: string) {
  const topic = getTopic(slug) ?? TOPICS[0];
  return new ImageResponse(
    (
      <OgFrame
        eyebrow={topic.eyebrow}
        title={topic.label}
        subtitle="What it is, why it matters for Bitcoin, and exactly how the BIP54 soft fork fixes it."
        tiles={topic.facts.map((fact, i) => ({
          label: fact.label,
          value: fact.value,
          color: i === topic.facts.length - 1 ? "#6fbf9a" : undefined,
        }))}
      />
    ),
    TOPIC_OG_SIZE,
  );
}
