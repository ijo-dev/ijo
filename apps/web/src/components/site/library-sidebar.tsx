"use client";

import type { Meta } from "@ijo/registry";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** The fixed list of components, as plain text links. */
export function LibrarySidebar({ items }: { items: Meta[] }) {
  const pathname = usePathname();
  const groups = new Map<string, Meta[]>();
  for (const meta of items) {
    groups.set(meta.category, [...(groups.get(meta.category) ?? []), meta]);
  }

  return (
    <nav aria-label="Components" className="flex flex-col gap-5">
      {[...groups.entries()].map(([category, metas]) => (
        <div key={category} className="flex flex-col gap-1">
          <p className="px-2 font-mono text-caption uppercase text-text-faint">{category}</p>
          {metas.map((meta) => {
            const href = `/library/${meta.name}`;
            const active = pathname === href;
            return (
              <Link
                key={meta.name}
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "rounded-sm px-2 py-1.5 text-small transition-colors duration-[100ms]",
                  active
                    ? "bg-surface-3 text-text"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                {meta.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
