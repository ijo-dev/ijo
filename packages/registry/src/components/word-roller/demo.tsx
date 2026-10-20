"use client";

import { WordRoller, WordRollerItem, type WordRollerProps } from "./component";

/** Bọ̀ Coffee's homepage line, with the occasion rolling. */
export function WordRollerDemo({ duration, ...props }: Omit<WordRollerProps, "children">) {
  return (
    <h2 className="max-w-[460px] text-[32px] font-semibold leading-[40px] tracking-[-0.025em] text-[var(--text)]">
      Coffee for{" "}
      <WordRoller
        {...props}
        duration={duration}
        // A library card's still poster (duration 0) shows the first word only.
        autoplay={duration !== 0}
        className="text-[var(--grape-11)]"
      >
        <WordRollerItem>slow mornings</WordRollerItem>
        <WordRollerItem>long deadlines</WordRollerItem>
        <WordRollerItem>Sunday visitors</WordRollerItem>
        <WordRollerItem>the drive to Ikeja</WordRollerItem>
      </WordRoller>
    </h2>
  );
}
