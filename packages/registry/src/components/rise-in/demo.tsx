"use client";

import { RiseIn, RiseInItem } from "./component";
import type { RiseInProps } from "./component";

/**
 * The preview shown on the library card and the component page.
 *
 * Every demo in Ijó is set in the same fictional place — Bọ̀ Coffee, a roaster
 * in Lagos — so the library reads as one product rather than a pile of samples.
 */
export function RiseInDemo(props: Omit<RiseInProps, "children">) {
  return (
    <RiseIn {...props} className="flex w-full max-w-[380px] flex-col gap-3">
      <RiseInItem>
        <p className="font-mono text-[12px] uppercase tracking-[0.02em] text-[var(--text-faint)]">
          This week&rsquo;s roast
        </p>
      </RiseInItem>
      <RiseInItem>
        <h3 className="text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-[var(--text)]">
          Ìjẹ̀bú dark roast
        </h3>
      </RiseInItem>
      <RiseInItem>
        <p className="text-[16px] leading-6 text-[var(--text-muted)]">
          Cocoa and burnt sugar, roasted in Yaba every Tuesday morning.
        </p>
      </RiseInItem>
      <RiseInItem>
        <p className="font-mono text-[20px] font-medium tabular-nums text-[var(--grape-11)]">
          ₦7,200
          <span className="ml-2 font-sans text-[14px] font-normal text-[var(--text-faint)]">
            250g bag
          </span>
        </p>
      </RiseInItem>
    </RiseIn>
  );
}
