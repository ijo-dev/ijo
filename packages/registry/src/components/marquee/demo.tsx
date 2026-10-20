"use client";

import { Marquee, MarqueeItem, type MarqueeProps } from "./component";

const PLACES = [
  "Yaba",
  "Ikeja",
  "Lekki",
  "Surulere",
  "Abẹ́òkúta",
  "Ìbàdàn",
  "Ajah",
  "Victoria Island",
];

/** The stockist strip on Bọ̀ Coffee's homepage. */
export function MarqueeDemo({ duration, ...props }: Omit<MarqueeProps, "children">) {
  return (
    <div className="flex w-full max-w-[560px] flex-col gap-3">
      <p className="text-[13px] text-[var(--text-faint)]">On the shelf in</p>
      <Marquee
        {...props}
        duration={duration}
        autoplay={duration !== 0}
        className="rounded-[14px] bg-[var(--surface-3)] py-4"
      >
        {PLACES.map((place) => (
          <MarqueeItem key={place}>
            <span className="flex items-center gap-3 text-[20px] font-semibold tracking-[-0.01em] text-[var(--text)]">
              {place}
              <span aria-hidden className="size-1.5 rounded-full bg-[var(--grape-9)]" />
            </span>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  );
}
