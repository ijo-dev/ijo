"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type PinnedScrollProps = {
  /** The panels, each wrapped in PinnedScrollItem, laid out in a row. */
  children: React.ReactNode;
  /** Seconds the row takes to catch up with the scrollbar. 0 locks it to the scrollbar exactly. */
  scrub?: number;
  /** Pixels of vertical scroll per pixel of sideways travel. Higher feels slower. */
  length?: number;
  /** Settle on the nearest panel when scrolling stops. */
  snap?: boolean;
  /** The element that scrolls, if it isn't the page. */
  scroller?: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Pins a section in place and turns vertical scrolling into a sideways walk through a row of panels.
 *
 * Under `prefers-reduced-motion: reduce` nothing is pinned: the row becomes an
 * ordinary sideways-scrolling strip you can swipe or scroll through yourself.
 */
export function PinnedScroll({
  children,
  scrub = 0.6,
  length = 1,
  snap = false,
  scroller,
  className,
}: PinnedScrollProps) {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      const row = track.current;
      if (!section || !row) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-slot='pinned-scroll-item']");

      gsap.matchMedia().add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const travel = () => Math.max(0, row.scrollWidth - section.clientWidth);
          gsap.set(section, { overflowX: "hidden" });
          gsap.to(row, {
            x: () => -travel(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scroller: scroller?.current ?? undefined,
              pin: true,
              start: "top top",
              end: () => `+=${travel() * length}`,
              scrub: scrub === 0 ? true : scrub,
              snap: snap && panels.length > 1 ? 1 / (panels.length - 1) : undefined,
              invalidateOnRefresh: true,
            },
          });
        },
        scope,
      );
    },
    { scope, dependencies: [scrub, length, snap, scroller], revertOnUpdate: true },
  );

  return (
    <div
      ref={scope}
      data-slot="pinned-scroll"
      className={className}
      style={{ overflowX: "auto", overscrollBehaviorX: "contain" }}
    >
      <div
        ref={track}
        data-slot="pinned-scroll-track"
        style={{ display: "flex", width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}

/** One panel in the row. Give it a width; the row is as long as its panels. */
export function PinnedScrollItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="pinned-scroll-item" className={className} style={{ flexShrink: 0 }}>
      {children}
    </div>
  );
}
