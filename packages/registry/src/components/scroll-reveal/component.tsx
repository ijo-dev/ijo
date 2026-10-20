"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ScrollRevealProps = {
  /** The elements to reveal, each wrapped in ScrollRevealItem. */
  children: React.ReactNode;
  /** Seconds each item takes to arrive. */
  duration?: number;
  /** How far below its resting place each item starts, in pixels. */
  distance?: number;
  /** Seconds between items that enter the viewport together. */
  stagger?: number;
  /** A GSAP ease name, e.g. "power3.out". */
  ease?: string;
  /** Where an item's top must reach in the viewport before it reveals, e.g. "top 85%". */
  start?: string;
  /** Reveal once and stay, or hide again when scrolled back above. */
  once?: boolean;
  /** The element that scrolls, if it isn't the page. */
  scroller?: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Reveals items as they scroll into view, in small staggered groups.
 *
 * Items that enter together are batched into one staggered reveal, so a fast
 * scroll down a long list doesn't queue up a slow parade. Under
 * `prefers-reduced-motion: reduce` every item is simply visible.
 */
export function ScrollReveal({
  children,
  duration = 0.7,
  distance = 32,
  stagger = 0.08,
  ease = "power3.out",
  start = "top 85%",
  once = true,
  scroller,
  className,
}: ScrollRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-slot='scroll-reveal-item']");
      if (items.length === 0) return;

      gsap.matchMedia().add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(items, { opacity: 0, y: distance });
          const show = (batch: Element[]) =>
            gsap.to(batch, { opacity: 1, y: 0, duration, ease, stagger, overwrite: true });
          const hide = (batch: Element[]) =>
            gsap.to(batch, { opacity: 0, y: distance, duration: duration / 2, overwrite: true });

          ScrollTrigger.batch(items, {
            scroller: scroller?.current ?? undefined,
            start,
            once,
            onEnter: show,
            onLeaveBack: once ? undefined : hide,
          });
        },
        scope,
      );
    },
    {
      scope,
      dependencies: [duration, distance, stagger, ease, start, once, scroller],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={scope} data-slot="scroll-reveal" className={className}>
      {children}
    </div>
  );
}

/** Wrap each element you want revealed. Anything not wrapped stays put. */
export function ScrollRevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="scroll-reveal-item" className={className}>
      {children}
    </div>
  );
}
