import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame } from "@/lib/og";
import { TOPICS, getTopic } from "@/lib/topics";

export const alt = "BIP54 explainer";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: topic.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic = getTopic((await params).topic) ?? TOPICS[0];
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
    size,
  );
}
