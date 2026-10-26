"use client";

import { CATEGORIES, type Meta } from "@ijo/registry";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ComponentCard } from "./component-card";

/**
 * Tabs, a filter box and the component grid. With nothing filtered, the newest
 * component leads as a larger featured card so the page has a clear first thing
 * to look at.
 */
export function LibraryBrowser({ items }: { items: Meta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // Only offer a tab for a category that has something in it.
  const tabs = useMemo(
    () =>
      CATEGORIES.map((name) => ({
        name,
        count: items.filter((meta) => meta.category === name).length,
      })).filter((tab) => tab.count > 0),
    [items],
  );

  const featured = useMemo(
    () =>
      items.reduce<Meta | undefined>(
        (best, meta) => (!best || meta.added > best.added ? meta : best),
        undefined,
      ),
    [items],
  );

  const needle = query.trim().toLowerCase();
  const showFeatured = !needle && category === null && featured !== undefined;

  const results = useMemo(
    () =>
      items.filter((meta) => {
        if (category && meta.category !== category) return false;
        if (!needle) return true;
        return [meta.title, meta.description, meta.category, ...meta.tags]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      }),
    [items, needle, category],
  );

  const ordered =
    showFeatured && featured
      ? [featured, ...results.filter((meta) => meta.name !== featured.name)]
      : results;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Category"
          className="-mx-1 flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-surface-1 p-1 shadow-ring-hairline [scrollbar-width:none] sm:mx-0 sm:self-start"
        >
          <Tab active={category === null} count={items.length} onClick={() => setCategory(null)}>
            All
          </Tab>
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              active={category === tab.name}
              count={tab.count}
              onClick={() => setCategory(category === tab.name ? null : tab.name)}
            >
              {tab.name}
            </Tab>
          ))}
        </div>

        <div className="relative sm:w-[220px]">
          <Search
            size={15}
            strokeWidth={1.75}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter components"
            aria-label="Filter components"
            className="inset-field h-9 w-full rounded-full pl-9 pr-3 text-[16px] sm:text-[13px] text-text outline-offset-2 placeholder:text-text-faint"
          />
        </div>
      </div>

      {ordered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-surface-1 px-6 py-14 text-center shadow-ring-hairline">
          <Search size={20} strokeWidth={1.5} aria-hidden className="text-text-faint" />
          <p className="mt-3 text-[13px] text-text">Nothing matches “{query.trim()}”</p>
          <p className="mt-1 text-[12px] text-text-faint">
            Try a shorter word, or{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
              className="text-primary-text underline-offset-2 hover:underline"
            >
              clear the filters
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ordered.map((meta, index) => (
            <ComponentCard key={meta.name} meta={meta} featured={showFeatured && index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] transition-colors duration-100",
        active ? "bg-surface-4 text-text shadow-ring-hairline" : "text-text-muted hover:text-text",
      )}
    >
      {children}
      <span className={clsx("tabular-nums", active ? "text-text-muted" : "text-text-faint")}>
        {count}
      </span>
    </button>
  );
}
