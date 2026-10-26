"use client";

import { registry, type Meta } from "@ijo/registry";
import clsx from "clsx";
import {
  ArrowRight,
  BookOpen,
  CornerDownLeft,
  Layers,
  Menu,
  MousePointerClick,
  PanelTop,
  ScrollText,
  Search,
  Type,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";

type Item =
  | { kind: "component"; group: string; href: string; title: string; detail: string; meta: Meta }
  | { kind: "page"; group: string; href: string; title: string; detail: string };

const PAGES = [
  { href: "/library", title: "Library", detail: "Every component, with filters" },
  {
    href: "/docs/getting-started",
    title: "Getting started",
    detail: "Docs · Install GSAP and add your first component",
  },
  {
    href: "/docs/reduced-motion",
    title: "Reduced motion",
    detail: "Docs · How each component respects the setting",
  },
  { href: "/changelog", title: "Changelog", detail: "What shipped, newest first" },
];

const ICONS: Record<string, typeof Type> = {
  Text: Type,
  Buttons: MousePointerClick,
  Scroll: ScrollText,
  UI: PanelTop,
  Menus: Menu,
  Sections: Layers,
};

/** Categories that have at least one component, in the order the library lists them. */
const FILTERS = ["All", ...new Set(registry.map((entry) => entry.meta.category))];

const kb = (bytes?: number) => (bytes ? `${(bytes / 1024).toFixed(1)} KB` : "");

const hit = (needle: string, ...fields: string[]) =>
  fields.join(" ").toLowerCase().includes(needle);

function search(query: string, filter: string): Item[] {
  const needle = query.trim().toLowerCase();
  const components = registry
    .map((entry) => entry.meta)
    .filter((meta) => filter === "All" || meta.category === filter)
    .filter((meta) => hit(needle, meta.title, meta.description, meta.category, ...meta.tags));
  // Group by category, keeping the library's order inside each group.
  const groups = [...new Set(components.map((meta) => meta.category))];
  const items: Item[] = groups.flatMap((group) =>
    components
      .filter((meta) => meta.category === group)
      .map((meta) => ({
        kind: "component" as const,
        group,
        href: `/library/${meta.name}`,
        title: meta.title,
        detail: meta.description,
        meta,
      })),
  );
  if (filter === "All") {
    for (const page of PAGES) {
      if (hit(needle, page.title, page.detail))
        items.push({ kind: "page", group: "Pages", ...page });
    }
  }
  return items;
}

/** Wraps the part of `text` that matches the query, so people see why a row is here. */
function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLowerCase();
  const at = needle ? text.toLowerCase().indexOf(needle) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent text-primary-text">{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  );
}

/**
 * The search window behind ⌘K: a compact, grouped list, like the command menus in
 * Vercel, Supabase and ElevenLabs. No live previews here, so it opens instantly on
 * a slow connection; the previews live on the pages it links to.
 *
 * It is a combobox: focus stays in the input, ↑ ↓ move, Enter opens, Tab cycles the
 * category filters and Escape closes.
 */
export function SearchPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0);
  const items = useMemo(() => search(query, filter), [query, filter]);
  const current = Math.min(active, Math.max(items.length - 1, 0));
  const count = items.filter((item) => item.kind === "component").length;

  useEffect(() => {
    input.current?.focus();
    // Keep the page behind still while the window is open.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    document.getElementById(`${id}-option-${current}`)?.scrollIntoView({ block: "nearest" });
  }, [id, current]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const pickFilter = (value: string) => {
    setFilter(value);
    setActive(0);
    input.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(items.length ? (current + 1) % items.length : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(items.length ? (current - 1 + items.length) % items.length : 0);
    } else if (event.key === "Enter" && items[current]) {
      event.preventDefault();
      go(items[current].href);
    } else if (event.key === "Tab") {
      // Focus stays in the box; Tab steps through the category filters instead.
      event.preventDefault();
      const step = event.shiftKey ? -1 : 1;
      pickFilter(
        FILTERS[(FILTERS.indexOf(filter) + step + FILTERS.length) % FILTERS.length] ?? "All",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[60]" onKeyDown={onKeyDown}>
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-[rgb(0_0_0/0.55)] [animation:backdrop-in_140ms_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search components"
        className="relative mx-auto mt-3 flex max-h-[min(560px,calc(100dvh-24px))] w-[calc(100%-24px)] max-w-[620px] flex-col overflow-hidden rounded-xl bg-surface-2 shadow-overlay [animation:palette-in_180ms_var(--ease-out)] sm:mt-[12vh]"
      >
        {/* Search box */}
        <div className="flex items-center gap-3 px-4">
          <Search size={16} strokeWidth={1.75} aria-hidden className="shrink-0 text-text-faint" />
          <input
            ref={input}
            role="combobox"
            aria-label="Search components"
            aria-expanded="true"
            aria-controls={`${id}-results`}
            aria-activedescendant={items.length ? `${id}-option-${current}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search components and docs…"
            spellCheck={false}
            className="h-12 min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-text-faint"
          />
          <button
            type="button"
            onClick={onClose}
            className="kbd hover:text-text"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Category filters */}
        <div
          role="group"
          aria-label="Filter by category"
          className="flex gap-1 overflow-x-auto border-y border-border-subtle px-3 py-2 [scrollbar-width:none]"
        >
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              tabIndex={-1}
              aria-pressed={filter === value}
              onClick={() => pickFilter(value)}
              className={clsx(
                "h-7 shrink-0 rounded-sm px-2.5 text-[12px] transition-colors duration-[100ms]",
                filter === value
                  ? "bg-surface-4 text-text shadow-ring-hairline"
                  : "text-text-muted hover:bg-surface-3 hover:text-text",
              )}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Results */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <Search size={20} strokeWidth={1.5} aria-hidden className="text-text-faint" />
            <p className="mt-3 text-[13px] text-text">No results for “{query.trim()}”</p>
            <p className="mt-1 text-[12px] text-text-faint">
              Try{" "}
              {["scroll", "button", "text"].map((word, index) => (
                <Fragment key={word}>
                  {index ? ", " : ""}
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      setQuery(word);
                      setFilter("All");
                      setActive(0);
                      input.current?.focus();
                    }}
                    className="text-primary-text underline-offset-2 hover:underline"
                  >
                    {word}
                  </button>
                </Fragment>
              ))}
              {filter !== "All" ? " in all categories" : ""}.
            </p>
          </div>
        ) : (
          <div
            id={`${id}-results`}
            role="listbox"
            aria-label="Results"
            className="flex-1 overflow-y-auto overscroll-contain p-2"
          >
            {items.map((item, index) => {
              const selected = index === current;
              const Icon =
                item.kind === "page"
                  ? item.href === "/library"
                    ? ArrowRight
                    : BookOpen
                  : (ICONS[item.group] ?? Layers);
              const newGroup = index === 0 || items[index - 1]?.group !== item.group;
              return (
                <Fragment key={item.href}>
                  {newGroup ? (
                    <div
                      role="presentation"
                      className={clsx(
                        "px-2 pb-1.5 text-caption uppercase tracking-[0.06em] text-text-faint",
                        index ? "pt-3" : "pt-1",
                      )}
                    >
                      {item.group}
                    </div>
                  ) : null}
                  <div
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => selected || setActive(index)}
                    onClick={() => go(item.href)}
                    className={clsx(
                      "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2",
                      selected && "bg-surface-4",
                    )}
                  >
                    <span
                      aria-hidden
                      className={clsx(
                        "grid size-8 shrink-0 place-items-center rounded-md shadow-ring-hairline transition-colors duration-[100ms]",
                        selected ? "bg-grape-4 text-grape-11" : "bg-surface-3 text-text-muted",
                      )}
                    >
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium leading-5 text-text">
                        <Highlight text={item.title} query={query} />
                      </span>
                      <span className="block truncate text-[12px] leading-4 text-text-faint">
                        {item.detail}
                      </span>
                    </span>
                    {selected ? (
                      <span className="kbd hidden shrink-0 sm:inline-flex" aria-hidden>
                        <CornerDownLeft size={11} />
                      </span>
                    ) : item.kind === "component" ? (
                      <span className="hidden shrink-0 text-[11px] tabular-nums text-text-faint sm:inline">
                        {kb(item.meta.sizeGzip)}
                      </span>
                    ) : null}
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}

        {/* Key hints */}
        <div className="flex items-center gap-4 border-t border-border-subtle px-4 py-2 text-[11px] text-text-faint">
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span>
            Move
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <span className="kbd">
              <CornerDownLeft size={11} aria-hidden />
            </span>
            Open
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <span className="kbd">Tab</span>
            Filter
          </span>
          <span className="ml-auto" aria-live="polite">
            {count} matching component{count === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
