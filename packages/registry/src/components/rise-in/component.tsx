"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type RiseInProps = {
  /** The elements to reveal. Each direct child animates as one step. */
  children: React.ReactNode;
  /** Seconds each child takes to arrive. */
  duration?: number;
  /** How far below its resting place each child starts, in pixels. */
  distance?: number;
  /** Seconds between one child starting and the next. */
  stagger?: number;
  /** A GSAP ease name, e.g. "expo.out". */
  ease?: string;
  /** Seconds to wait before the first child moves. */
  delay?: number;
  /** Reveal children one after another, or all together. */
  staggered?: boolean;
  className?: string;
};

/**
 * Reveals a stack of elements by lifting them into place, one after another.
 *
 * Under `prefers-reduced-motion: reduce` the children cross-fade in place with
 * no travel and no stagger — the content still announces itself, nothing moves.
 */
export function RiseIn({
  children,
  duration = 0.9,
  distance = 24,
  stagger = 0.06,
  ease = "expo.out",
  delay = 0,
  staggered = true,
  className,
}: RiseInProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-slot='rise-in-item']");
      if (items.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = context.conditions?.reduced ?? false;
          gsap.from(items, {
            // Travel and stagger are the two things reduced motion drops.
            y: reduced ? 0 : distance,
            opacity: 0,
            duration: reduced ? 0.2 : duration,
            delay,
            ease: reduced ? "none" : ease,
            stagger: reduced || !staggered ? 0 : stagger,
            // Leave the DOM exactly as authored once the reveal is done.
            clearProps: "transform,opacity",
          });
        },
        scope
      );
    },
    { scope, dependencies: [duration, distance, stagger, ease, delay, staggered], revertOnUpdate: true }
  );

  return (
    <div ref={scope} data-slot="rise-in" className={className}>
      {children}
    </div>
  );
}

/** Wrap each child you want to animate. Anything not wrapped stays still. */
export function RiseInItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="rise-in-item" className={className}>
      {children}
    </div>
  );
}
