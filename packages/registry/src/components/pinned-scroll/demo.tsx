"use client";

import { useState } from "react";
import { PinnedScroll, PinnedScrollItem, type PinnedScrollProps } from "./component";

const GUIDES = [
  {
    step: "01",
    name: "V60",
    recipe: "15g medium-fine, 250g water at 94°C. Pour in three stages, done by three minutes.",
  },
  {
    step: "02",
    name: "French press",
    recipe: "30g coarse, 500g water just off the boil. Four minutes, then plunge slowly.",
  },
  {
    step: "03",
    name: "Moka pot",
    recipe: "Fill the basket level, water to the valve. Medium heat; off the moment it gurgles.",
  },
  {
    step: "04",
    name: "Cold brew",
    recipe: "100g coarse in a litre of cold water. Fridge for 18 hours, strain, keep for a week.",
  },
];

/** Bọ̀ Coffee's brew guides. The demo scrolls in its own box so it fits the stage. */
export function PinnedScrollDemo(
  props: Omit<PinnedScrollProps, "children" | "scroller"> & { duration?: number },
) {
  // A callback ref into state: the trigger is built once the scrolling box exists.
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  // The library card's still poster passes a duration; this component has none to use.
  const { duration: _poster, ...rest } = props;
  void _poster;

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-2">
      <p className="text-[12px] text-[var(--text-faint)]">Scroll down inside the box</p>
      <div ref={setBox} className="h-[280px] overflow-y-auto rounded-[14px] bg-[var(--surface-1)]">
        <div className="flex h-[140px] flex-col justify-end p-5">
          <h3 className="text-[20px] font-semibold text-[var(--text)]">Brew it at home</h3>
          <p className="text-[14px] text-[var(--text-muted)]">Four ways with the same bag.</p>
        </div>
        <PinnedScroll {...rest} scroller={box} className="h-[280px]">
          {GUIDES.map((guide) => (
            <PinnedScrollItem
              key={guide.name}
              className="flex h-[280px] w-[260px] items-center px-3"
            >
              <div className="flex h-[220px] w-full flex-col gap-2 rounded-[14px] bg-[var(--surface-3)] p-5">
                <span className="font-mono text-[12px] text-[var(--text-faint)]">{guide.step}</span>
                <h4 className="text-[20px] font-semibold text-[var(--text)]">{guide.name}</h4>
                <p className="text-[14px] leading-[21px] text-[var(--text-muted)]">
                  {guide.recipe}
                </p>
              </div>
            </PinnedScrollItem>
          ))}
        </PinnedScroll>
        <div className="flex h-[200px] items-start p-5">
          <p className="text-[14px] text-[var(--text-muted)]">
            Questions? The roastery in Yaba is open from 8am.
          </p>
        </div>
      </div>
    </div>
  );
}
