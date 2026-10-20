"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type MarqueeProps = {
  /** The items to scroll past, each wrapped in MarqueeItem. */
  children: React.ReactNode;
  /** Seconds for one full loop. Higher is slower. */
  duration?: number;
  /** Which way the strip travels. */
  direction?: "left" | "right";
  /** Ease to a stop while the pointer is over the strip or focus is inside it. */
  pauseOnHover?: boolean;
  /** Pixels between items. */
  gap?: number;
  /** Set false to keep the strip still. */
  autoplay?: boolean;
  className?: string;
};

/**
 * An endless strip of logos, words or cards that slides past at a steady pace.
 *
 * The strip stops working while it's off screen, and eases to a halt on hover or
 * keyboard focus so anything in it can be read and clicked. Under
 * `prefers-reduced-motion: reduce` it stays still.
 */
export function Marquee({
  children,
  duration = 24,
  direction = "left",
  pauseOnHover = true,
  gap = 32,
  autoplay = true,
  className,
}: MarqueeProps) {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const strip = scope.current;
      const row = track.current;
      if (!strip || !row || !autoplay) return;

      gsap.matchMedia().add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // The row holds two identical copies, so sliding it by half loops seamlessly.
          const [from, to] = direction === "left" ? [0, -50] : [-50, 0];
          const tween = gsap.fromTo(
            row,
            { xPercent: from },
            { xPercent: to, duration, ease: "none", repeat: -1 },
          );
          loop.current = tween;

          const observer = new IntersectionObserver(([entry]) =>
            tween.paused(!entry?.isIntersecting),
          );
          observer.observe(strip);
          return () => {
            observer.disconnect();
            loop.current = null;
          };
        },
        scope,
      );
    },
    { scope, dependencies: [duration, direction, autoplay, gap], revertOnUpdate: true },
  );

  const ease = contextSafe((timeScale: number) => {
    if (pauseOnHover && loop.current)
      gsap.to(loop.current, { timeScale, duration: 0.5, overwrite: true });
  });

  const copy = (duplicate: boolean) => (
    <div
      data-slot="marquee-copy"
      aria-hidden={duplicate || undefined}
      inert={duplicate || undefined}
      style={{ display: "flex", flexShrink: 0, gap, paddingInlineEnd: gap }}
    >
      {children}
    </div>
  );

  return (
    <div
      ref={scope}
      data-slot="marquee"
      className={className}
      style={{ overflow: "hidden" }}
      onPointerEnter={() => ease(0)}
      onPointerLeave={() => ease(1)}
      onFocus={() => ease(0)}
      onBlur={() => ease(1)}
    >
      <div ref={track} data-slot="marquee-track" style={{ display: "flex", width: "max-content" }}>
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

/** One item in the strip: a logo, a word, a card. */
export function MarqueeItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="marquee-item" className={className} style={{ flexShrink: 0 }}>
      {children}
    </div>
  );
}
