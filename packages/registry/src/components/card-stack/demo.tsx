"use client";

import { CardStack, CardStackItem, type CardStackProps } from "./component";

const ROASTS = [
  {
    name: "Ìjẹ̀bú dark roast",
    notes: "Cocoa, burnt sugar, a long finish",
    price: "₦7,200",
    tone: "bg-[var(--grape-5)]",
  },
  {
    name: "Ọ̀yọ́ medium roast",
    notes: "Toffee and orange peel",
    price: "₦6,800",
    tone: "bg-[var(--grape-4)]",
  },
  {
    name: "Èkó espresso blend",
    notes: "Dark chocolate, hazelnut",
    price: "₦7,500",
    tone: "bg-[var(--grape-6)]",
  },
  {
    name: "Ìbàdàn light roast",
    notes: "Hibiscus and honey",
    price: "₦7,000",
    tone: "bg-[var(--grape-3)]",
  },
];

/** Bọ̀ Coffee's roasts as a deck to flick through. */
export function CardStackDemo(props: Omit<CardStackProps, "children">) {
  return (
    <CardStack
      {...props}
      className="flex w-full max-w-[300px] flex-col items-center gap-4"
      buttonClassName="h-9 rounded-[8px] bg-[var(--surface-3)] px-4 text-[14px] font-medium text-[var(--text)] shadow-[0_0_0_1px_rgb(255_255_255/0.1)] hover:bg-[var(--surface-4)]"
    >
      {ROASTS.map((roast) => (
        <CardStackItem
          key={roast.name}
          className={`flex h-[180px] w-[260px] cursor-pointer flex-col justify-between rounded-[14px] p-5 ${roast.tone} shadow-[0_0_0_1px_rgb(255_255_255/0.13),0_8px_28px_rgb(0_0_0/0.34)]`}
        >
          <div>
            <h3 className="text-[20px] font-semibold text-[var(--text)]">{roast.name}</h3>
            <p className="text-[14px] text-[var(--grape-12)]">{roast.notes}</p>
          </div>
          <p className="font-mono text-[18px] tabular-nums text-[var(--grape-11)]">{roast.price}</p>
        </CardStackItem>
      ))}
    </CardStack>
  );
}
