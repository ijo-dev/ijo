"use client";

import { MagneticButton, type MagneticButtonProps } from "./component";

/** The checkout call to action on Bọ̀ Coffee's product page. */
export function MagneticButtonDemo(props: Omit<MagneticButtonProps, "children">) {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <p className="text-[14px] text-[var(--text-muted)]">Ìjẹ̀bú dark roast · 250g · ₦7,200</p>
      <MagneticButton
        {...props}
        className="h-12 rounded-full bg-[var(--primary)] px-7 text-[15px] font-medium text-[var(--on-primary)] transition-colors duration-100 hover:bg-[var(--primary-hover)]"
      >
        Order a bag
      </MagneticButton>
      <p className="text-[12px] text-[var(--text-faint)]">Move your pointer around the button</p>
    </div>
  );
}
