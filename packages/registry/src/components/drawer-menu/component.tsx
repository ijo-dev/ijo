"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type DrawerMenuProps = {
  /** The links, each wrapped in DrawerMenuItem. */
  children: React.ReactNode;
  /** The trigger button's text, also the menu's accessible name. */
  label?: string;
  /** The close button's text. */
  closeLabel?: string;
  /** Seconds the drawer takes to slide in. Closing plays the same motion backwards. */
  duration?: number;
  /** Which edge the drawer slides from. */
  side?: "left" | "right";
  /** Seconds between one link arriving and the next. */
  stagger?: number;
  /** A GSAP ease name, e.g. "expo.out". */
  ease?: string;
  className?: string;
  /** Classes for the drawer itself: background, padding, width. */
  panelClassName?: string;
  /** Classes for the trigger button. */
  triggerClassName?: string;
};

const FOCUSABLE =
  "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])";

/**
 * A menu button that slides a drawer in from the side, its links following one after another.
 *
 * Escape, the backdrop and the close button all close it; focus moves into the drawer on
 * open, stays there, and returns to the button on close. Under
 * `prefers-reduced-motion: reduce` the drawer fades in place.
 */
export function DrawerMenu({
  children,
  label = "Menu",
  closeLabel = "Close",
  duration = 0.55,
  side = "right",
  stagger = 0.05,
  ease = "expo.out",
  className,
  panelClassName,
  triggerClassName,
}: DrawerMenuProps) {
  const id = useId();
  const scope = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const isOpen = useRef(open);

  useGSAP(
    () => {
      gsap.matchMedia().add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduced = context.conditions?.reduced ?? false;
          const offset = side === "right" ? 1 : -1;
          const tl = gsap
            .timeline({ paused: true })
            .set("[data-slot='drawer-menu-layer']", { visibility: "visible" })
            .fromTo(
              "[data-slot='drawer-menu-overlay']",
              { opacity: 0 },
              { opacity: 1, duration: 0.3 },
            )
            .fromTo(
              "[data-slot='drawer-menu-panel']",
              reduced ? { opacity: 0 } : { xPercent: 100 * offset },
              reduced ? { opacity: 1, duration: 0.2 } : { xPercent: 0, duration, ease },
              0,
            )
            .fromTo(
              "[data-slot='drawer-menu-item']",
              { opacity: 0, x: reduced ? 0 : 24 * offset },
              {
                opacity: 1,
                x: 0,
                duration: reduced ? 0.2 : duration * 0.8,
                ease,
                stagger: reduced ? 0 : stagger,
              },
              reduced ? 0 : duration * 0.3,
            );
          if (isOpen.current) tl.progress(1);
          timeline.current = tl;
          return () => {
            timeline.current = null;
          };
        },
        scope,
      );
    },
    { scope, dependencies: [duration, side, stagger, ease], revertOnUpdate: true },
  );

  useEffect(() => {
    isOpen.current = open;
    const tl = timeline.current;
    if (!tl) return;
    if (open) {
      tl.timeScale(1).play();
      // The drawer becomes visible on GSAP's next frame; focus it once it can take focus,
      // unless it has already been closed again by then.
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (isOpen.current) panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
        }),
      );
      // Escape closes it from anywhere, even before focus has moved into the drawer.
      const onEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
      document.addEventListener("keydown", onEscape);
      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("keydown", onEscape);
      };
    } else {
      // Close a little faster than it opened.
      tl.timeScale(1.6).reverse();
      if (panel.current?.contains(document.activeElement)) trigger.current?.focus();
    }
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !panel.current) return;
    // Keep focus inside the open drawer.
    const stops = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const [first, last] = [stops[0], stops[stops.length - 1]];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div ref={scope} data-slot="drawer-menu" className={className}>
      <button
        ref={trigger}
        type="button"
        data-slot="drawer-menu-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {label}
      </button>
      <div
        data-slot="drawer-menu-layer"
        data-open={open || undefined}
        onKeyDown={onKeyDown}
        style={{ position: "fixed", inset: 0, zIndex: 50, visibility: "hidden" }}
      >
        <div
          data-slot="drawer-menu-overlay"
          onClick={() => setOpen(false)}
          style={{ position: "absolute", inset: 0, background: "rgb(0 0 0 / 0.5)" }}
        />
        <div
          ref={panel}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          data-slot="drawer-menu-panel"
          className={panelClassName}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            ...(side === "right" ? { right: 0 } : { left: 0 }),
            width: "min(320px, 85%)",
            overflowY: "auto",
          }}
        >
          <button type="button" data-slot="drawer-menu-close" onClick={() => setOpen(false)}>
            {closeLabel}
          </button>
          <nav aria-label={label}>{children}</nav>
        </div>
      </div>
    </div>
  );
}

/** One entry in the drawer. Put a link inside. */
export function DrawerMenuItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="drawer-menu-item" className={className}>
      {children}
    </div>
  );
}
