"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type WordRollerProps = {
  /** The words to cycle through, each wrapped in WordRollerItem. */
  children: React.ReactNode;
  /** Seconds one word takes to roll out as the next rolls in. */
  duration?: number;
  /** Seconds each word stays still before the next one rolls in. */
  hold?: number;
  /** A GSAP ease name, e.g. "power3.inOut". */
  ease?: string;
  /** Roll upwards (the next word comes from below) or downwards. */
  direction?: "up" | "down";
  /** Set false to show the first word and stay still, e.g. off screen. */
  autoplay?: boolean;
  className?: string;
};

/**
 * Rolls one word in a sentence through a list of alternatives, like a split-flap sign.
 *
 * Every word sits in the same grid cell, so the slot is always as wide as the longest
 * word and the sentence around it never jumps. Under `prefers-reduced-motion: reduce`
 * the words cross-fade in place instead of rolling.
 */
export function WordRoller({
  children,
  duration = 0.6,
  hold = 1.6,
  ease = "power3.inOut",
  direction = "up",
  autoplay = true,
  className,
}: WordRollerProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-slot='word-roller-item']");
      if (items.length < 2) return;

      // Only the visible word is read out; the rest are decoration.
      items.slice(1).forEach((item) => item.setAttribute("aria-hidden", "true"));
      const from = direction === "up" ? 100 : -100;

      gsap.matchMedia().add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = context.conditions?.reduced ?? false;
          gsap.set(items, reduced ? { autoAlpha: 0 } : { yPercent: from });
          gsap.set(items[0]!, reduced ? { autoAlpha: 1 } : { yPercent: 0 });
          if (!autoplay) return;

          const tl = gsap.timeline({ repeat: -1 });
          items.forEach((item, i) => {
            const next = items[(i + 1) % items.length]!;
            if (reduced) {
              tl.to(item, { autoAlpha: 0, duration: 0.2 }, `+=${hold}`).to(
                next,
                { autoAlpha: 1, duration: 0.2 },
                "<",
              );
            } else {
              tl.to(item, { yPercent: -from, duration, ease }, `+=${hold}`).fromTo(
                next,
                { yPercent: from },
                { yPercent: 0, duration, ease },
                "<",
              );
            }
          });
        },
        scope,
      );

      return () => items.forEach((item) => item.removeAttribute("aria-hidden"));
    },
    { scope, dependencies: [duration, hold, ease, direction, autoplay], revertOnUpdate: true },
  );

  return (
    <span
      ref={scope}
      data-slot="word-roller"
      className={className}
      style={{ display: "inline-grid", overflow: "clip", verticalAlign: "bottom" }}
    >
      {children}
    </span>
  );
}

/** One word in the roller. The first one is shown before any motion starts. */
export function WordRollerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-slot="word-roller-item"
      className={className}
      style={{ gridArea: "1 / 1", whiteSpace: "nowrap" }}
    >
      {children}
    </span>
  );
}
