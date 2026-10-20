"use client";

import { useState } from "react";
import { ImageReveal, type ImageRevealProps } from "./component";

/**
 * A flat illustration of a Bọ̀ Coffee bag, drawn inline so the demo costs no image
 * download — the point of the library is staying light on mobile data.
 */
function CoffeeBag() {
  return (
    <svg
      viewBox="0 0 400 260"
      role="img"
      aria-label="A bag of Ìjẹ̀bú dark roast on the roastery counter"
      className="block h-full w-full"
    >
      <rect width="400" height="260" fill="var(--grape-2)" />
      <rect y="196" width="400" height="64" fill="var(--grape-4)" />
      <circle cx="320" cy="70" r="34" fill="var(--grape-5)" />
      <path d="M150 64 h100 l14 140 h-128 z" fill="var(--grape-9)" />
      <rect x="150" y="56" width="100" height="14" rx="3" fill="var(--grape-6)" />
      <rect x="168" y="110" width="64" height="58" rx="6" fill="var(--grape-12)" />
      <rect x="178" y="122" width="44" height="6" rx="3" fill="var(--grape-5)" />
      <rect x="178" y="134" width="30" height="6" rx="3" fill="var(--grape-7)" />
      <rect x="178" y="150" width="20" height="8" rx="4" fill="var(--ember)" />
      <rect x="282" y="168" width="40" height="30" rx="6" fill="var(--grape-11)" />
      <rect
        x="320"
        y="174"
        width="10"
        height="16"
        rx="5"
        fill="none"
        stroke="var(--grape-11)"
        strokeWidth="4"
      />
    </svg>
  );
}

export function ImageRevealDemo(props: Omit<ImageRevealProps, "children" | "scroller">) {
  // A callback ref into state: the trigger is built once the scrolling box exists.
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  return (
    <div className="flex w-full max-w-[440px] flex-col gap-2">
      <p className="text-[12px] text-[var(--text-faint)]">Scroll down inside the box</p>
      <div
        ref={setBox}
        className="h-[300px] overflow-y-auto rounded-[14px] bg-[var(--surface-1)] p-4"
      >
        <div className="flex h-[300px] flex-col justify-end gap-1 pb-4">
          <h3 className="text-[20px] font-semibold text-[var(--text)]">Visit the roastery</h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            Herbert Macaulay Way, Yaba. Tastings every Saturday at 11.
          </p>
        </div>
        <ImageReveal
          {...props}
          scroller={box}
          start="top 90%"
          className="aspect-[400/260] w-full rounded-[8px]"
        >
          <CoffeeBag />
        </ImageReveal>
        <div className="h-[120px]" />
      </div>
    </div>
  );
}
