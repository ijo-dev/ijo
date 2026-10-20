"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* The window and its previews load only when someone first opens search. */
const SearchPalette = dynamic(() => import("./search-palette").then((m) => m.SearchPalette), {
  ssr: false,
});

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const noop = () => () => {};

/** The "Search… ⌘K" box in the header. ⌘K, Ctrl+K or "/" open it from anywhere. */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const mac = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !isTyping(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Search components"
        className="inset-field flex h-9 items-center gap-2 px-2.5 text-label text-text-faint transition-colors duration-[100ms] hover:text-text-muted md:w-[260px] md:pr-1.5"
      >
        <Search size={15} strokeWidth={1.5} aria-hidden className="shrink-0" />
        <span className="hidden md:inline">Search components…</span>
        <span className="kbd ml-auto hidden md:inline-flex">{mac ? "⌘ K" : "Ctrl K"}</span>
      </button>
      {open ? (
        <SearchPalette
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      ) : null}
    </>
  );
}
