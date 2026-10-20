"use client";

import { ScrambleText, type ScrambleTextProps } from "./component";

/** An order confirmation from the Bọ̀ Coffee checkout. */
export function ScrambleTextDemo(props: Omit<ScrambleTextProps, "children">) {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2 rounded-[14px] bg-[var(--surface-3)] p-5">
      <p className="text-[13px] text-[var(--text-faint)]">Thursday delivery · Yaba to Lekki</p>
      <ScrambleText
        {...props}
        className="font-mono text-[20px] font-medium tracking-[0.02em] text-[var(--grape-11)]"
      >
        ORDER BC-2047 CONFIRMED
      </ScrambleText>
      <p className="text-[14px] text-[var(--text-muted)]">
        2 × Ìjẹ̀bú dark roast, whole bean · ₦14,400
      </p>
    </div>
  );
}
