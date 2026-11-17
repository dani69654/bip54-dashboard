import { TopicArticle, topicMetadata } from "@/components/TopicArticle";

const SLUG = "64-byte-transactions";

export const metadata = topicMetadata(SLUG);

export default function Page() {
  return <TopicArticle slug={SLUG} />;
}
