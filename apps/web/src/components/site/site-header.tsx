import Link from "next/link";
import { SITE } from "@/lib/site";
import { ButtonLink } from "./ui";

const links = [
  { href: "/library", label: "Library" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 md:gap-6 md:px-8">
        <Link href="/" className="rounded-sm text-[18px] font-semibold tracking-[-0.02em]">
          {SITE.name}
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 md:gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-2 py-1.5 text-small md:px-3 text-text-muted transition-colors duration-[100ms] hover:bg-surface-3 hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* On a phone the nav links are the navigation; the GitHub link and the
            call to action would push them off the edge, so they wait for md. */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ButtonLink
            href={SITE.repo}
            size="sm"
            variant="ghost"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </ButtonLink>
          <ButtonLink href="/library" size="sm" variant="primary">
            Browse components
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
