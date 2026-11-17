import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

type Crumb = { name: string; href: string };

/** Breadcrumb trail + matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "BIP54", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fg-subtle">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((crumb, index) => {
          const last = index === all.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-fg-muted">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="hover:text-fg">
                    {crumb.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="animate-fade-up mb-10 max-w-3xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-text">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-fg-muted">{lead}</p>
    </section>
  );
}
