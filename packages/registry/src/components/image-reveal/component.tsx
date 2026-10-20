"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HIDDEN = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
} as const;

export type ImageRevealProps = {
  /** The image (or any media) to uncover. */
  children: React.ReactNode;
  /** Seconds the mask takes to open. */
  duration?: number;
  /** Which way the mask opens: "up" uncovers from the bottom edge upwards. */
  direction?: keyof typeof HIDDEN;
  /** How far the image is zoomed in before it settles, 1 for no zoom. */
  zoom?: number;
  /** A GSAP ease name, e.g. "expo.inOut". */
  ease?: string;
  /** Where the top of the image must reach in the viewport before it reveals. */
  start?: string;
  /**
   * The element that scrolls, if it isn't the page. Pass the element itself (from a
   * callback ref or useState). While it is `null` nothing is set up; leave it out to
   * use the page.
   */
  scroller?: HTMLElement | null;
  className?: string;
};

/**
 * Uncovers an image with a sliding mask as it scrolls into view, while the image
 * settles from a slight zoom.
 *
 * Plays once. Under `prefers-reduced-motion: reduce` the image fades in instead.
 */
export function ImageReveal({
  children,
  duration = 1.2,
  direction = "up",
  zoom = 1.25,
  ease = "expo.inOut",
  start = "top 85%",
  scroller,
  className,
}: ImageRevealProps) {
  const scope = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // A scroller was asked for but isn't mounted yet: wait for it.
      if (scroller === null) return;
      const frame = scope.current;
      const inner = media.current;
      if (!frame || !inner) return;

      gsap.matchMedia().add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = context.conditions?.reduced ?? false;
          const scrollTrigger = {
            trigger: frame,
            scroller: scroller ?? undefined,
            start,
            once: true,
          };
          if (reduced) {
            gsap.from(frame, { opacity: 0, duration: 0.3, clearProps: "opacity", scrollTrigger });
            return;
          }
          // clip-path, not transform: the frame keeps its size while its visible area grows.
          gsap
            .timeline({ scrollTrigger })
            .fromTo(
              frame,
              { clipPath: HIDDEN[direction] },
              { clipPath: "inset(0% 0% 0% 0%)", duration, ease },
            )
            .from(inner, { scale: zoom, duration: duration * 1.2, ease: "power2.out" }, 0);
        },
        scope,
      );
    },
    {
      scope,
      dependencies: [duration, direction, zoom, ease, start, scroller],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={scope} data-slot="image-reveal" className={className} style={{ overflow: "hidden" }}>
      <div ref={media} data-slot="image-reveal-media" style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
