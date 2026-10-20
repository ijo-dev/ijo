"use client";

import { TextReveal, type TextRevealProps } from "./component";

/** Bọ̀ Coffee's promise, set as a hero line. */
export function TextRevealDemo(props: Omit<TextRevealProps, "children">) {
  return (
    <div className="flex w-full max-w-[460px] flex-col gap-3">
      <p className="font-mono text-[12px] uppercase tracking-[0.02em] text-[var(--text-faint)]">
        Bọ̀ Coffee · Lagos
      </p>
      <TextReveal
        {...props}
        as="h2"
        className="text-[32px] font-semibold leading-[38px] tracking-[-0.025em] text-[var(--text)]"
      >
        Roasted in Yaba on Tuesday, in your cup by Thursday.
      </TextReveal>
    </div>
  );
}
