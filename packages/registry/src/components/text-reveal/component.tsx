"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, SplitText);

export type TextRevealProps = {
  /** The text to reveal. Inline markup such as <em> is kept. */
  children: React.ReactNode;
  /** The element to render, so headings stay headings. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Reveal line by line, word by word, or letter by letter. */
  split?: "lines" | "words" | "chars";
  /** Seconds each unit takes to rise into view. */
  duration?: number;
  /** Seconds between one unit starting and the next. */
  stagger?: number;
  /** A GSAP ease name, e.g. "expo.out". */
  ease?: string;
  /** Seconds to wait before the first unit moves. */
  delay?: number;
  className?: string;
};

/**
 * Slides text up into view from behind a mask, one line, word or letter at a time.
 *
 * Lines are re-measured when fonts load or the width changes, so the split never
 * leaves a line broken in the wrong place. Under `prefers-reduced-motion: reduce`
 * the text fades in where it stands.
 */
export function TextReveal({
  children,
  as = "p",
  split = "lines",
  duration = 0.8,
  stagger = 0.08,
  ease = "expo.out",
  delay = 0,
  className,
}: TextRevealProps) {
  const scope = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;

      gsap.matchMedia().add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduced) {
            gsap.from(el, { opacity: 0, duration: 0.2, delay, clearProps: "opacity" });
            return;
          }
          SplitText.create(el, {
            type: split === "lines" ? "lines" : split === "words" ? "words" : "words,chars",
            mask: split,
            // Re-split when fonts arrive or the box resizes, so lines stay true.
            autoSplit: split === "lines",
            onSplit: (self) =>
              gsap.from(self[split], { yPercent: 110, duration, ease, delay, stagger }),
          });
        },
        scope,
      );
    },
    { scope, dependencies: [split, duration, stagger, ease, delay], revertOnUpdate: true },
  );

  return (
    <Tag ref={scope} data-slot="text-reveal" className={className}>
      {children}
    </Tag>
  );
}
