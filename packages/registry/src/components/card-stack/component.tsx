"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type CardStackProps = {
  /** The cards, each wrapped in CardStackItem. The first one starts on top. */
  children: React.ReactNode;
  /** Seconds a card takes to leave the top and the rest to move up. */
  duration?: number;
  /** Pixels each card below sits lower than the one above it. */
  offset?: number;
  /** Degrees the cards below are tilted, alternating left and right. */
  rotation?: number;
  /** A GSAP ease name for the cards moving up, e.g. "power3.out". */
  ease?: string;
  /** Text for the button that moves to the next card. */
  nextLabel?: string;
  className?: string;
  /** Classes for the next button. */
  buttonClassName?: string;
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
 * A pile of cards: the top one lifts away and slides to the back, and the rest move up.
 *
 * Click the top card or the button. Only the top card is readable and focusable, and
 * each change is announced. Under `prefers-reduced-motion: reduce` cards swap with a
 * quick fade.
 */
export function CardStack({
  children,
  duration = 0.7,
  offset = 14,
  rotation = 4,
  ease = "power3.out",
  nextLabel = "Next card",
  className,
  buttonClassName,
}: CardStackProps) {
  const scope = useRef<HTMLDivElement>(null);
  const order = useRef<HTMLElement[]>([]);
  const original = useRef<HTMLElement[]>([]);
  const busy = useRef(false);
  const [status, setStatus] = useState("");

  const place = (cards: HTMLElement[]) => ({
    y: (i: number) => i * offset,
    scale: (i: number) => 1 - Math.min(i, 3) * 0.05,
    rotation: (i: number) => (i === 0 ? 0 : i % 2 ? rotation : -rotation),
    opacity: (i: number) => (i > 2 ? 0 : 1),
    zIndex: (i: number) => cards.length - i,
  });

  const settle = (cards: HTMLElement[]) =>
    cards.forEach((card, i) => {
      card.inert = i !== 0;
      card.setAttribute("aria-hidden", String(i !== 0));
    });

  const { contextSafe } = useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-slot='card-stack-item']");
      order.current = cards;
      original.current = cards;
      gsap.set(cards, place(cards));
      settle(cards);
    },
    { scope, dependencies: [offset, rotation], revertOnUpdate: true },
  );

  const next = contextSafe(() => {
    const [top, ...rest] = order.current;
    if (!top || rest.length === 0 || busy.current) return;
    const cards = [...rest, top];
    order.current = cards;
    busy.current = true;
    const done = () => {
      busy.current = false;
      settle(cards);
      setStatus(`Card ${original.current.indexOf(cards[0]!) + 1} of ${cards.length}`);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap
        .timeline({ onComplete: done })
        .to(top, { opacity: 0, duration: 0.15 })
        .set(cards, place(cards))
        .from(cards[0]!, { opacity: 0, duration: 0.15 });
      return;
    }

    gsap
      .timeline({ onComplete: done })
      .to(top, {
        yPercent: -60,
        rotation: -rotation * 3,
        duration: duration * 0.45,
        ease: "power2.in",
      })
      .set(cards, { zIndex: (i: number) => cards.length - i })
      .to(cards, { ...place(cards), yPercent: 0, duration: duration * 0.55, ease, stagger: 0.03 });
  });

  return (
    <div ref={scope} data-slot="card-stack" className={className}>
      <div
        data-slot="card-stack-pile"
        // Room below the top card for the ones peeking out underneath it.
        style={{ display: "grid", paddingBottom: offset * 2 }}
        onClick={(event) => {
          if ((event.target as Element).closest("a, button, input, select, textarea")) return;
          next();
        }}
      >
        {children}
      </div>
      <button type="button" data-slot="card-stack-next" className={buttonClassName} onClick={next}>
        {nextLabel}
      </button>
      <span role="status" style={srOnly}>
        {status}
      </span>
    </div>
  );
}

/** One card in the pile. */
export function CardStackItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="card-stack-item" className={className} style={{ gridArea: "1 / 1" }}>
      {children}
    </div>
  );
}
