import { TopicArticle, topicMetadata } from "@/components/TopicArticle";

const SLUG = "timewarp-attack";

export const metadata = topicMetadata(SLUG);

export default function Page() {
  return <TopicArticle slug={SLUG} />;
}
