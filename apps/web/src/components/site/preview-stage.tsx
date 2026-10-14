"use client";

import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The surface a demo plays on.
 *
 * It mounts the demo only once the stage is actually on screen, so a library
 * page full of GSAP timelines costs nothing until you scroll to one — which is
 * the difference between a usable and an unusable page on a mid-range phone.
 */
export function PreviewStage({
  children,
  replayKey,
  onReplay,
  className,
  minHeight = 280,
}: {
  children: ReactNode;
  /** Changing this remounts the demo, which replays it. */
  replayKey?: number;
  onReplay?: () => void;
  className?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without IntersectionObserver (very old Android browsers), show the demo
    // rather than an empty box. Deferred a frame so it is not a synchronous
    // setState inside the effect.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-testid="preview-stage"
      data-ready={visible || undefined}
      className={clsx(
        "relative flex items-center justify-center rounded-lg bg-surface-2 p-6 shadow-ring-hairline",
        className
      )}
      style={{ minHeight }}
    >
      {visible ? <div key={replayKey}>{children}</div> : null}

      {onReplay ? (
        <button
          type="button"
          onClick={onReplay}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-caption text-text-muted transition-colors duration-[100ms] hover:bg-surface-4 hover:text-text"
        >
          <RotateCcw size={16} strokeWidth={1.5} aria-hidden />
          Replay
        </button>
      ) : null}
    </div>
  );
}
