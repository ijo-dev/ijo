"use client";

import { demos, type Meta } from "@ijo/registry";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui";

const NEW_FOR_DAYS = 30;

const isNew = (added: string) =>
  Date.now() - new Date(added).getTime() < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

/**
 * A library tile. The demo sits still until you hover or focus the card, or —
 * on a touch screen, where there is no hover — until the card scrolls into view.
 * Nothing plays while the card is off screen.
 */
export function ComponentCard({ meta }: { meta: Meta }) {
  const Demo = demos[meta.name as keyof typeof demos];
  const ref = useRef<HTMLAnchorElement>(null);
  const [play, setPlay] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = ref.current;
    // Hover exists: wait for the pointer rather than playing on scroll.
    if (!node || window.matchMedia("(hover: hover)").matches) return;
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
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
      className="group block overflow-hidden rounded-lg bg-surface-2 shadow-ring-hairline transition-[background-color,transform,box-shadow] duration-[280ms] ease-out hover:-translate-y-0.5 hover:bg-surface-3 hover:shadow-raised motion-reduce:hover:translate-y-0"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-grape-1 p-5">
        <div className="pointer-events-none w-full scale-[0.72] origin-center">
          {Demo ? <Demo key={playing ? play : "poster"} duration={playing ? undefined : 0} /> : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-semibold leading-6 tracking-[-0.01em] text-text">
            {meta.title}
          </h3>
          {isNew(meta.added) ? <Badge tone="new">New</Badge> : null}
        </div>
        <p className="line-clamp-2 text-small text-text-muted">{meta.description}</p>
        <div className="flex items-center gap-2 font-mono text-caption text-text-faint">
          <span>{meta.category}</span>
          <span aria-hidden>·</span>
          <span>{meta.sizeGzip ? kb(meta.sizeGzip) : "—"}</span>
        </div>
      </div>
    </Link>
  );
}
