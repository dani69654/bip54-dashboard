import { TOPIC_OG_SIZE, topicOgImage } from "@/lib/topic-og";
import { getTopic } from "@/lib/topics";

export const alt = `${getTopic("slow-blocks-legacy-sigops")?.label} — BIP54 explainer`;
export const size = TOPIC_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return topicOgImage("slow-blocks-legacy-sigops");
}
