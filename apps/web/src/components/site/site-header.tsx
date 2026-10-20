import Link from "next/link";
import { SITE } from "@/lib/site";
import { SearchTrigger } from "./search-trigger";
import { ButtonLink } from "./ui";

const links = [
  { href: "/library", label: "Library" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 md:gap-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm text-[15px] font-semibold tracking-[-0.02em]"
        >
          {/* The mark: a plum tile with a primary quarter-disc, from the design system's cover. */}
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden className="shrink-0">
            <rect width="20" height="20" rx="5" fill="var(--grape-5)" />
            <path d="M5 15V8a7 7 0 0 1 7 7Z" fill="var(--grape-11)" />
          </svg>
          {SITE.name}
        </Link>

        <nav aria-label="Main" className="flex items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-2 py-1.5 text-small text-text-muted transition-colors duration-[100ms] hover:bg-surface-3 hover:text-text md:px-2.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger />
          {/* On a phone the nav links are the navigation; these wait for md. */}
          <span className="hidden md:contents">
            <ButtonLink
              href={SITE.repo}
              size="sm"
              variant="ghost"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </ButtonLink>
          </span>
          <span className="hidden lg:contents">
            <ButtonLink href="/library" size="sm" variant="primary">
              Browse components
            </ButtonLink>
          </span>
        </div>
      </div>
    </header>
  );
}
