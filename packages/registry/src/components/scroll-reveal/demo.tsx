"use client";

import { useRef } from "react";
import { ScrollReveal, ScrollRevealItem, type ScrollRevealProps } from "./component";

const ROASTS = [
  { name: "Ìjẹ̀bú dark roast", notes: "Cocoa, burnt sugar", price: "₦7,200" },
  { name: "Ọ̀yọ́ medium roast", notes: "Toffee, orange peel", price: "₦6,800" },
  { name: "Èkó espresso blend", notes: "Dark chocolate, hazelnut", price: "₦7,500" },
  { name: "Ìbàdàn light roast", notes: "Hibiscus, honey", price: "₦7,000" },
  { name: "Ọ̀ṣun decaf", notes: "Malt, brown bread", price: "₦6,500" },
  { name: "Abẹ́òkúta cold brew pack", notes: "Steeped 18 hours", price: "₦5,900" },
  { name: "Yaba house blend", notes: "Molasses, almond", price: "₦6,200" },
  { name: "Lekki single origin", notes: "Peach, black tea", price: "₦8,400" },
];

/** Bọ̀ Coffee's roast list, scrolling in its own box so the demo fits the stage. */
export function ScrollRevealDemo(props: Omit<ScrollRevealProps, "children" | "scroller">) {
  const box = useRef<HTMLDivElement>(null);
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2">
      <p className="text-[12px] text-[var(--text-faint)]">Scroll the list</p>
      <div ref={box} className="h-[260px] overflow-y-auto rounded-[14px] bg-[var(--surface-1)] p-3">
        <ScrollReveal {...props} scroller={box} className="flex flex-col gap-2">
          {ROASTS.map((roast) => (
            <ScrollRevealItem
              key={roast.name}
              className="flex items-baseline justify-between gap-3 rounded-[8px] bg-[var(--surface-3)] px-4 py-3"
            >
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text)]">{roast.name}</h3>
                <p className="text-[13px] text-[var(--text-faint)]">{roast.notes}</p>
              </div>
              <p className="font-mono text-[14px] tabular-nums text-[var(--grape-11)]">
                {roast.price}
              </p>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </div>
  );
}
