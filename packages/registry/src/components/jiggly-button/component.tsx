"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type JigglyButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  /** How hard the button squashes, from 0 (barely) to 1 (cartoonish). */
  intensity?: number;
  /** Seconds the wobble takes to settle. */
  duration?: number;
  /** The ease of the settle, e.g. "elastic.out(1.2, 0.3)". */
  ease?: string;
  /** What sets it off: hovering, pressing, or both. */
  trigger?: "hover" | "press" | "both";
};

/**
 * A button that squashes and wobbles back into shape, like jelly, when you hover or press it.
 *
 * A wobble already in flight is overwritten, never stacked, so mashing the button
 * can't make it grow. Under `prefers-reduced-motion: reduce` it never moves.
 */
export function JigglyButton({
  children,
  intensity = 0.5,
  duration = 0.8,
  ease = "elastic.out(1.2, 0.3)",
  trigger = "both",
  className,
  onPointerEnter,
  onPointerDown,
  onClick,
  ...rest
}: JigglyButtonProps) {
  const scope = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({ scope, dependencies: [intensity, duration, ease] });

  const jiggle = contextSafe(() => {
    const el = scope.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const squash = 0.18 * intensity;
    // Replace any wobble in flight, so repeated presses never stack up.
    gsap.killTweensOf(el);
    gsap
      .timeline()
      .to(el, { scaleX: 1 + squash, scaleY: 1 - squash, duration: 0.1, ease: "power2.out" })
      .to(el, { scaleX: 1, scaleY: 1, duration, ease });
  });

  return (
    <button
      ref={scope}
      type="button"
      data-slot="jiggly-button"
      className={className}
      onPointerEnter={(event) => {
        if (trigger !== "press") jiggle();
        onPointerEnter?.(event);
      }}
      onPointerDown={(event) => {
        if (trigger !== "hover") jiggle();
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        // detail is 0 for a keyboard press (Enter or Space), which has no pointerdown.
        if (event.detail === 0 && trigger !== "hover") jiggle();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
