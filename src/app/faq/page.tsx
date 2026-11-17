import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/PageHeader";
import { FAQ } from "@/lib/faq";
import { absoluteUrl } from "@/lib/site";

const title = "BIP54 FAQ: Bitcoin Consensus Cleanup questions answered";
const description =
  "Is BIP54 a soft fork? When does it activate? Do users need to do anything? Clear answers about the Bitcoin Consensus Cleanup and its four fixes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: { type: "article", url: absoluteUrl("/faq"), title, description },
  twitter: { title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": absoluteUrl("/faq#faq"),
  url: absoluteUrl("/faq"),
  inLanguage: "en",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
      <PageHeader
        eyebrow="Frequently asked questions"
        title="BIP54 FAQ"
        lead="Short, sourced answers about the Bitcoin Consensus Cleanup soft fork: what it changes, who is affected, and where activation stands."
      />

      <div className="grid max-w-3xl gap-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="surface group p-5 open:border-accent/30 sm:p-6"
            open
          >
            <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:hidden">
              <h2 className="inline">{item.q}</h2>
            </summary>
            {item.a.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-fg-muted">
                {p}
              </p>
            ))}
            {item.links ? (
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {item.links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="text-accent-text hover:underline"
                  >
                    {link.label} →
                  </Link>
                ))}
              </p>
            ) : null}
          </details>
        ))}
      </div>
    </div>
  );
}
