"use client";

import { demos, type Meta } from "@ijo/registry";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

/**
 * A library tile: a dark preview window set inside a slightly lighter card, the
 * way Fey frames its charts. The demo sits still until you hover or focus the
 * card, or — on a touch screen, where there is no hover — until it scrolls into
 * view. The featured card is larger and plays as soon as it is on screen.
 */
export function ComponentCard({ meta, featured = false }: { meta: Meta; featured?: boolean }) {
  const Demo = demos[meta.name as keyof typeof demos];
  const ref = useRef<HTMLAnchorElement>(null);
  const [play, setPlay] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = ref.current;
    // Hover exists: wait for the pointer rather than playing on scroll, unless featured.
    if (!node || (!featured && window.matchMedia("(hover: hover)").matches)) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlaying(true);
            setPlay((n) => n + 1);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [featured]);

  const start = () => {
    setPlaying(true);
    setPlay((n) => n + 1);
  };

  return (
    <Link
      ref={ref}
      href={`/library/${meta.name}`}
      onMouseEnter={start}
      onFocus={start}
      className={clsx(
        "group flex h-full flex-col rounded-xl bg-surface-1 p-1.5 shadow-ring-hairline transition-[background-color,box-shadow] duration-200 hover:bg-surface-2 hover:shadow-raised",
        featured && "sm:col-span-2 xl:row-span-2",
      )}
    >
      <div
        className={clsx(
          "relative flex items-center justify-center overflow-hidden rounded-lg bg-bg shadow-ring-hairline",
          featured ? "aspect-[16/9] xl:aspect-auto xl:min-h-[320px] xl:flex-1" : "aspect-[16/10]",
        )}
      >
        <span className="absolute left-3 top-2.5 z-10 text-[11px] text-text-faint">
          {meta.category}
        </span>
        {featured ? (
          <span className="absolute right-3 top-2.5 z-10 rounded-full bg-ember px-2 py-0.5 text-[11px] font-medium text-on-signal">
            New
          </span>
        ) : null}
        <div
          inert
          className={clsx(
            "demo-frame pointer-events-none w-full origin-center",
            featured ? "scale-95" : "scale-[0.7]",
          )}
        >
          {Demo ? (
            <Demo key={playing ? play : "poster"} duration={playing ? undefined : 0} />
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-3 px-2.5 pb-2 pt-3">
        <div className="min-w-0 flex-1">
          <h3
            className={clsx(
              "flex items-center gap-1.5 font-semibold tracking-[-0.01em] text-text",
              featured ? "text-[16px] leading-6" : "text-[14px] leading-5",
            )}
          >
            {meta.title}
            <ArrowUpRight
              size={14}
              strokeWidth={1.75}
              aria-hidden
              className="text-text-faint opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </h3>
          <p
            className={clsx(
              "mt-0.5 text-[12px]/[18px] text-text-muted",
              featured ? "line-clamp-2 max-w-[56ch]" : "line-clamp-1",
            )}
          >
            {meta.description}
          </p>
        </div>
        <span className="mt-0.5 shrink-0 text-[11px] tabular-nums text-text-faint">
          {meta.sizeGzip ? kb(meta.sizeGzip) : "—"}
        </span>
      </div>
    </Link>
  );
}
