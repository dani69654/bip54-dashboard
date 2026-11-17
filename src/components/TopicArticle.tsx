import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, PageHeader } from "@/components/PageHeader";
import { BIP54 } from "@/lib/bip54";
import { absoluteUrl } from "@/lib/site";
import { TOPICS, TOPICS_UPDATED_AT, getTopic } from "@/lib/topics";

/**
 * Shared body for the explainer pages. Each topic has its own static route
 * folder (src/app/<slug>/) rather than a dynamic [topic] segment: OpenNext on
 * Cloudflare returned 404 for the prerendered pages of a dynamic segment with
 * dynamicParams = false.
 */

export function topicMetadata(slug: string): Metadata {
  const topic = getTopic(slug);
  if (!topic) return {};
  const path = `/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: absoluteUrl(path),
      title: topic.title,
      description: topic.description,
      modifiedTime: TOPICS_UPDATED_AT,
    },
    twitter: { title: topic.title, description: topic.description },
  };
}

export function TopicArticle({ slug }: { slug: string }) {
  const topic = getTopic(slug);
  if (!topic) notFound();

  const path = `/${topic.slug}`;
  const related = TOPICS.filter((t) => t.slug !== topic.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": absoluteUrl(`${path}#article`),
    url: absoluteUrl(path),
    headline: topic.title,
    description: topic.description,
    inLanguage: "en",
    dateModified: TOPICS_UPDATED_AT,
    keywords: topic.keywords.join(", "),
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: {
      "@type": "Thing",
      name: BIP54.title,
      sameAs: "https://github.com/bitcoin/bips/blob/master/bip-0054.md",
    },
    citation: topic.references.map((ref) => ({
      "@type": "CreativeWork",
      name: ref.title,
      url: ref.href,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ name: topic.label, href: path }]} />
      <PageHeader eyebrow={topic.eyebrow} title={topic.title} lead={topic.tldr} />

      <dl className="mb-12 grid gap-3 sm:grid-cols-3">
        {topic.facts.map((fact) => (
          <div key={fact.label} className="surface p-4">
            <dt className="text-xs text-fg-subtle">{fact.label}</dt>
            <dd className="mt-1 font-display text-xl font-semibold text-fg">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="max-w-3xl">
          {topic.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="mb-3 font-display text-2xl font-semibold">
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mb-4 leading-relaxed text-fg-muted">
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mb-4 grid gap-2 pl-5 text-fg-muted [list-style:disc]">
                  {section.bullets.map((b) => (
                    <li key={b} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <div className="surface mb-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold">See it happen</p>
              <p className="mt-1 text-sm text-fg-muted">
                Run this scenario step by step, with BIP54 on or off.
              </p>
            </div>
            <Link
              href={`/simulator?scenario=${topic.fixId}`}
              className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-center text-sm font-semibold text-[#1a140c] transition hover:brightness-110"
            >
              Open the simulation
            </Link>
          </div>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold">Sources</h2>
            <ul className="grid gap-2 text-sm">
              {topic.references.map((ref) => (
                <li key={ref.href}>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-text hover:underline"
                  >
                    {ref.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
            Other BIP54 fixes
          </p>
          <ul className="grid gap-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className="surface block p-4 text-sm transition hover:border-accent/30"
                >
                  <span className="font-medium text-fg">{t.label}</span>
                  <span className="mt-1 block text-fg-subtle">{t.eyebrow}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/faq"
                className="surface block p-4 text-sm transition hover:border-accent/30"
              >
                <span className="font-medium text-fg">BIP54 FAQ</span>
                <span className="mt-1 block text-fg-subtle">
                  Soft fork? Activation? Who must upgrade?
                </span>
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
