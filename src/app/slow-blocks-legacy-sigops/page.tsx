import { TopicArticle, topicMetadata } from "@/components/TopicArticle";

const SLUG = "slow-blocks-legacy-sigops";

export const metadata = topicMetadata(SLUG);

export default function Page() {
  return <TopicArticle slug={SLUG} />;
}
