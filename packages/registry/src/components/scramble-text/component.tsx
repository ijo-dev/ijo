"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

export type ScrambleTextProps = {
  /** The text that settles out of the scramble. Plain text only. */
  children: string;
  /** Seconds from the first scrambled frame to the settled text. */
  duration?: number;
  /** The characters the scramble draws from. */
  chars?: string;
  /** Seconds of pure scramble before letters start settling. */
  revealDelay?: number;
  /** How often the scrambled letters change, from 0.1 (slow) to 2 (frantic). */
  speed?: number;
  /** Scramble again whenever the pointer enters or the element gets focus. */
  replayOnHover?: boolean;
  className?: string;
};

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

/**
 * Shuffles a line of text through random characters until it settles on the real words.
 *
 * Assistive tech only ever hears the real text. Under `prefers-reduced-motion: reduce`
 * the text fades in instead of scrambling.
 */
export function ScrambleText({
  children,
  duration = 1.2,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  revealDelay = 0.3,
  speed = 0.6,
  replayOnHover = false,
  className,
}: ScrambleTextProps) {
  const scope = useRef<HTMLSpanElement>(null);
  const visual = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const el = visual.current;
      if (!el) return;
      gsap.matchMedia().add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduced) {
            gsap.from(el, { opacity: 0, duration: 0.2, clearProps: "opacity" });
            return;
          }
          gsap.to(el, {
            duration,
            scrambleText: { text: children, chars, revealDelay, speed, tweenLength: false },
          });
        },
        scope,
      );
    },
    { scope, dependencies: [children, duration, chars, revealDelay, speed], revertOnUpdate: true },
  );

  const replay = contextSafe(() => {
    const el = visual.current;
    if (!el || !replayOnHover || gsap.isTweening(el)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(el, {
      duration,
      scrambleText: { text: children, chars, revealDelay, speed, tweenLength: false },
    });
  });

  return (
    <span
      ref={scope}
      data-slot="scramble-text"
      className={className}
      style={{ position: "relative", display: "inline-block" }}
      onPointerEnter={replay}
      onFocus={replay}
    >
      <span style={srOnly}>{children}</span>
      <span ref={visual} data-slot="scramble-text-visual" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
