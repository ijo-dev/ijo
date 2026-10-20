"use client";

import { DrawerMenu, DrawerMenuItem, type DrawerMenuProps } from "./component";

const LINKS = ["Shop", "Our roasts", "Brew guides", "Subscriptions", "Visit the roastery"];

/**
 * Bọ̀ Coffee's mobile header. The frame has a transform, which makes it the
 * drawer's containing block, so the drawer opens inside the demo instead of over the page.
 */
export function DrawerMenuDemo(props: Omit<DrawerMenuProps, "children">) {
  return (
    <div className="relative h-[320px] w-full max-w-[420px] overflow-hidden rounded-[14px] bg-[var(--surface-1)] [transform:translateZ(0)]">
      <header className="flex items-center justify-between px-4 py-3 shadow-[0_1px_0_rgb(255_255_255/0.08)]">
        <span className="text-[16px] font-semibold text-[var(--text)]">Bọ̀ Coffee</span>
        <DrawerMenu
          {...props}
          triggerClassName="h-9 rounded-[8px] bg-[var(--surface-3)] px-3 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--surface-4)]"
          panelClassName="flex flex-col gap-1 bg-[var(--surface-4)] p-4 [&_[data-slot=drawer-menu-close]]:mb-4 [&_[data-slot=drawer-menu-close]]:self-end [&_[data-slot=drawer-menu-close]]:rounded-[6px] [&_[data-slot=drawer-menu-close]]:px-2 [&_[data-slot=drawer-menu-close]]:py-1 [&_[data-slot=drawer-menu-close]]:text-[13px] [&_[data-slot=drawer-menu-close]]:text-[var(--text-muted)]"
        >
          {LINKS.map((link) => (
            <DrawerMenuItem key={link}>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="block rounded-[8px] px-2 py-2 text-[20px] font-semibold tracking-[-0.01em] text-[var(--text)] hover:bg-[var(--surface-5)]"
              >
                {link}
              </a>
            </DrawerMenuItem>
          ))}
        </DrawerMenu>
      </header>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-[22px] font-semibold text-[var(--text)]">This week&rsquo;s roast</h3>
        <p className="text-[14px] text-[var(--text-muted)]">Ìjẹ̀bú dark roast · ₦7,200</p>
        <p className="pt-6 text-[12px] text-[var(--text-faint)]">Press Menu to open the drawer</p>
      </div>
    </div>
  );
}
