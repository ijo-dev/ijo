"use client";

import { CATEGORIES, type Meta } from "@ijo/registry";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ComponentCard } from "./component-card";

/** Search and category filters over the component grid. */
export function LibraryBrowser({ items }: { items: Meta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // Only offer a filter for a category that has something in it.
  const available = useMemo(
    () => CATEGORIES.filter((name) => items.some((meta) => meta.category === name)),
    [items]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((meta) => {
      if (category && meta.category !== category) return false;
      if (!needle) return true;
      return [meta.title, meta.description, meta.category, ...meta.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [items, query, category]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.5}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components"
            aria-label="Search components"
            className="h-9 w-[240px] rounded-md border border-border bg-surface-3 pl-9 pr-3 text-small text-text placeholder:text-text-faint hover:border-border-strong"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={category === null} onClick={() => setCategory(null)}>
            All
          </FilterChip>
          {available.map((name) => (
            <FilterChip
              key={name}
              active={category === name}
              onClick={() => setCategory(category === name ? null : name)}
            >
              {name}
            </FilterChip>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="rounded-lg bg-surface-2 p-8 text-center text-small text-text-muted shadow-ring-hairline">
          Nothing matches “{query}”. Try a shorter word, or clear the filters.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((meta) => (
            <ComponentCard key={meta.name} meta={meta} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "rounded-sm border px-2.5 py-1 text-caption transition-colors duration-[100ms]",
        active
          ? "border-grape-7 bg-grape-3 text-grape-11"
          : "border-border-subtle bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text"
      )}
    >
      {children}
    </button>
  );
}
