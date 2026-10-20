"use client";

import { demos, registry } from "@ijo/registry";
import clsx from "clsx";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const matches = (needle: string) =>
  registry
    .map((entry) => entry.meta)
    .filter((meta) =>
      [meta.title, meta.description, meta.category, ...meta.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle.trim().toLowerCase()),
    );

/**
 * The search window behind ⌘K: a filter box over a grid of still previews.
 *
 * It is a combobox: focus stays in the input, the arrow keys move through the
 * results, Enter opens one and Escape closes. The module is loaded only when the
 * window first opens, so no page pays for the previews until someone searches.
 */
export function SearchPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => matches(query), [query]);
  const current = Math.min(active, Math.max(results.length - 1, 0));

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

  const open = (name: string) => {
    onClose();
    router.push(`/library/${name}`);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setActive(Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setActive(Math.max(current - 1, 0));
    } else if (event.key === "Enter" && results[current]) {
      event.preventDefault();
      open(results[current].name);
    } else if (event.key === "Tab") {
      // Nothing else in the window takes focus; keep it in the box.
      event.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 z-[60]" onKeyDown={onKeyDown}>
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-[rgb(0_0_0/0.6)] backdrop-blur-[2px] [animation:backdrop-in_160ms_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search components"
        className="relative mx-auto mt-[8vh] flex max-h-[84vh] w-[min(880px,calc(100%-32px))] flex-col overflow-hidden rounded-xl bg-surface-2 shadow-overlay [animation:palette-in_200ms_var(--ease-out)]"
      >
        <div className="flex items-center gap-3 border-b border-border-subtle px-4">
          <Search size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-text-faint" />
          <input
            ref={input}
            role="combobox"
            aria-label="Search components"
            aria-expanded="true"
            aria-controls={`${id}-results`}
            aria-activedescendant={results.length ? `${id}-option-${current}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search components…"
            className="h-14 min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-text-faint"
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

        <p className="px-4 pb-2 pt-3 text-caption text-text-faint" aria-live="polite">
          {results.length} matching component{results.length === 1 ? "" : "s"}
        </p>

        {results.length === 0 ? (
          <p className="px-4 pb-10 pt-6 text-center text-small text-text-muted">
            Nothing matches “{query}”. Try a shorter word, like “scroll” or “button”.
          </p>
        ) : (
          <ul
            id={`${id}-results`}
            role="listbox"
            aria-label="Components"
            className="grid flex-1 grid-cols-1 gap-2 overflow-y-auto px-3 pb-3 sm:grid-cols-2 md:grid-cols-3"
          >
            {results.map((meta, index) => {
              const Demo = demos[meta.name as keyof typeof demos];
              const selected = index === current;
              return (
                <li
                  key={meta.name}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={selected}
                  onMouseMove={() => setActive(index)}
                  onClick={() => open(meta.name)}
                  className={clsx(
                    "cursor-pointer overflow-hidden rounded-lg bg-surface-3 transition-shadow duration-[100ms]",
                    selected ? "shadow-[0_0_0_1px_var(--grape-8)]" : "shadow-ring-hairline",
                  )}
                >
                  <div
                    inert
                    className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-grape-1"
                  >
                    <div className="demo-frame pointer-events-none w-[200%] shrink-0 scale-50">
                      {Demo ? <Demo duration={0} /> : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <span className="truncate text-small font-medium text-text">{meta.title}</span>
                    <span className="shrink-0 text-caption text-text-faint">{meta.category}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-border-subtle px-4 py-2.5 text-caption text-text-faint">
          <span>
            <span className="kbd mr-1.5">↑</span>
            <span className="kbd mr-1.5">↓</span>to move
          </span>
          <span className="inline-flex items-center">
            <span className="kbd mr-1.5">
              <CornerDownLeft size={11} aria-hidden />
            </span>
            to open
          </span>
          <span className="ml-auto hidden sm:inline">
            <span className="kbd mr-1.5">Esc</span>to close
          </span>
        </div>
      </div>
    </div>
  );
}
