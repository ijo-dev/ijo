"use client";

import { useState } from "react";
import { JigglyButton, type JigglyButtonProps } from "./component";

/** Bọ̀ Coffee's add-to-cart, with a running count so the press has a result. */
export function JigglyButtonDemo(props: Omit<JigglyButtonProps, "children">) {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <JigglyButton
        {...props}
        onClick={() => setCount((n) => n + 1)}
        className="h-12 rounded-[14px] bg-[var(--primary)] px-7 text-[15px] font-semibold text-[var(--on-primary)]"
      >
        Add to cart
      </JigglyButton>
      <p className="text-[13px] tabular-nums text-[var(--text-muted)]" aria-live="polite">
        {count === 0
          ? "Your cart is empty"
          : `${count} × Ìjẹ̀bú dark roast · ₦${(count * 7200).toLocaleString("en-NG")}`}
      </p>
    </div>
  );
}
