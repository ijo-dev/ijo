"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type AccordionProps = {
  /** The sections, each an AccordionItem with a <summary> first. */
  children: React.ReactNode;
  /** Seconds a section takes to open or close. */
  duration?: number;
  /** A GSAP ease name, e.g. "power3.inOut". */
  ease?: string;
  /** Close the open section when another one opens. */
  single?: boolean;
  className?: string;
};

/**
 * Sections that open and close smoothly, built on the native <details> element.
 *
 * Works before JavaScript loads and with the keyboard, because the browser does the
 * real work; GSAP only animates the height. Under `prefers-reduced-motion: reduce`
 * sections open and close instantly.
 */
export function Accordion({
  children,
  duration = 0.45,
  ease = "power3.inOut",
  single = false,
  className,
}: AccordionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const items = gsap.utils.toArray<HTMLDetailsElement>("[data-slot='accordion-item']");
      items.forEach((item) => (item.dataset.state = item.open ? "open" : "closed"));

      // The height the item would have, open or closed, with no animation applied.
      const heightWhen = (item: HTMLDetailsElement, open: boolean) => {
        const [wasOpen, inline] = [item.open, item.style.height];
        item.style.height = "";
        item.open = open;
        const height = item.offsetHeight;
        item.open = wasOpen;
        item.style.height = inline;
        return height;
      };

      const toggle = (item: HTMLDetailsElement, open: boolean) => {
        item.dataset.state = open ? "open" : "closed";
        gsap.killTweensOf(item);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          item.open = open;
          return;
        }
        // Height is the effect here, so this one animates layout rather than a transform.
        const from = item.offsetHeight;
        const to = heightWhen(item, open);
        item.open = true;
        gsap.fromTo(
          item,
          { height: from, overflow: "hidden" },
          {
            height: to,
            duration,
            ease,
            onComplete: () => {
              item.open = open;
              gsap.set(item, { clearProps: "height,overflow" });
            },
          },
        );
      };

      const onClick = contextSafe!((event: Event) => {
        const summary = (event.target as Element).closest("summary");
        const item = summary?.parentElement;
        if (!(item instanceof HTMLDetailsElement) || !items.includes(item)) return;
        event.preventDefault();
        const open = item.dataset.state !== "open";
        if (open && single)
          items.forEach(
            (other) => other !== item && other.dataset.state === "open" && toggle(other, false),
          );
        toggle(item, open);
      });

      const root = scope.current;
      root?.addEventListener("click", onClick);
      return () => root?.removeEventListener("click", onClick);
    },
    { scope, dependencies: [duration, ease, single], revertOnUpdate: true },
  );

  return (
    <div ref={scope} data-slot="accordion" className={className}>
      {children}
    </div>
  );
}

/** One section: put a <summary> first, then the content it reveals. */
export function AccordionItem({
  children,
  defaultOpen,
  className,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details data-slot="accordion-item" open={defaultOpen} className={className}>
      {children}
    </details>
  );
}
