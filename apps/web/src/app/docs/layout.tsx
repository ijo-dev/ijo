import Link from "next/link";

const pages = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/getting-started", label: "Getting started" },
  { href: "/docs/reduced-motion", label: "Reduced motion" },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1200px] gap-8 px-4 md:px-8">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 lg:block">
        <nav aria-label="Docs" className="flex flex-col gap-1">
          <p className="px-2 font-mono text-caption uppercase text-text-faint">Docs</p>
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-sm px-2 py-1.5 text-small text-text-muted transition-colors duration-[100ms] hover:bg-surface-2 hover:text-text"
            >
              {page.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 py-8 prose-docs">{children}</div>
    </div>
  );
}
