"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/simulator", label: "Simulator" },
  { href: "/activation", label: "Activation" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft font-display text-sm font-semibold text-accent-text transition-transform group-hover:scale-105">
            54
          </span>
          <div className="hidden leading-tight sm:block">
            <div className="font-display text-sm font-semibold tracking-wide text-fg">
              BIP54
            </div>
            <div className="text-xs text-fg-subtle">Consensus Cleanup</div>
          </div>
        </Link>

        <nav className="no-scrollbar flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-bg-elevated/70 p-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] sm:px-4 sm:text-sm transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-text"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
