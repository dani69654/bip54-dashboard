import { TopicArticle, topicMetadata } from "@/components/TopicArticle";

const SLUG = "duplicate-coinbase";

export const metadata = topicMetadata(SLUG);

export default function Page() {
  return <TopicArticle slug={SLUG} />;
}
