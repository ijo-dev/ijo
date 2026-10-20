"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type MagneticButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  /** How far the button follows the pointer, as a share of the pointer's offset (0–1). */
  strength?: number;
  /** How much further the label travels than the button, for a sense of depth. */
  depth?: number;
  /** Seconds the button takes to spring home when the pointer leaves. */
  duration?: number;
  /** The ease of the return, e.g. "elastic.out(1, 0.4)". */
  ease?: string;
};

/**
 * A button that leans toward the pointer while it hovers, then springs back when it leaves.
 *
 * Only runs where there is a precise hovering pointer, so on a phone it is a normal
 * button. Under `prefers-reduced-motion: reduce` it never moves.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  depth = 0.5,
  duration = 0.9,
  ease = "elastic.out(1, 0.4)",
  className,
  ...rest
}: MagneticButtonProps) {
  const scope = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const button = scope.current;
      const label = button?.querySelector<HTMLElement>("[data-slot='magnetic-button-label']");
      if (!button || !label) return;

      gsap.matchMedia().add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const follow = { duration: 0.4, ease: "power3.out" };
          const bx = gsap.quickTo(button, "x", follow);
          const by = gsap.quickTo(button, "y", follow);
          const lx = gsap.quickTo(label, "x", follow);
          const ly = gsap.quickTo(label, "y", follow);

          const move = (event: PointerEvent) => {
            const box = button.getBoundingClientRect();
            const dx = event.clientX - (box.left + box.width / 2);
            const dy = event.clientY - (box.top + box.height / 2);
            bx(dx * strength);
            by(dy * strength);
            lx(dx * strength * depth);
            ly(dy * strength * depth);
          };
          const leave = () =>
            gsap.to([button, label], { x: 0, y: 0, duration, ease, overwrite: true });

          button.addEventListener("pointermove", move);
          button.addEventListener("pointerleave", leave);
          return () => {
            button.removeEventListener("pointermove", move);
            button.removeEventListener("pointerleave", leave);
          };
        },
        scope,
      );
    },
    { scope, dependencies: [strength, depth, duration, ease], revertOnUpdate: true },
  );

  return (
    <button ref={scope} type="button" data-slot="magnetic-button" className={className} {...rest}>
      <span data-slot="magnetic-button-label" style={{ display: "inline-block" }}>
        {children}
      </span>
    </button>
  );
}
