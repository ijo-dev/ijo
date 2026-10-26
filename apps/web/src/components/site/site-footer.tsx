import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border-subtle bg-surface-1 pb-20 md:pb-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8 text-small text-text-muted md:flex-row md:items-center md:px-8">
        <p>{SITE.name} — free, MIT licensed. Built for builders across Africa.</p>
        <nav aria-label="Footer" className="flex gap-4 md:ml-auto">
          <Link href="/docs" className="hover:text-text">
            Docs
          </Link>
          <Link href="/library" className="hover:text-text">
            Library
          </Link>
          <a href={SITE.repo} className="hover:text-text" rel="noreferrer noopener">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
