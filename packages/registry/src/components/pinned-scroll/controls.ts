import type { Controls } from "../../types";

/** Every key here is a prop on PinnedScroll. */
export const controls = {
  scrub: {
    kind: "range",
    label: "Scrub smoothing",
    help: "Seconds the row takes to catch up with the scrollbar. 0 locks it to the scrollbar exactly; around 0.5 smooths out a jerky mouse wheel.",
    min: 0,
    max: 2,
    step: 0.1,
    default: 0.6,
    unit: "s",
  },
  length: {
    kind: "range",
    label: "Scroll length",
    help: "How much scrolling it takes to cross the row, relative to its width. Raise it when panels carry text people need to read.",
    min: 0.5,
    max: 3,
    step: 0.1,
    default: 1,
    unit: "×",
  },
  snap: {
    kind: "switch",
    label: "Snap to panels",
    help: "Settle on the nearest panel when scrolling stops, so no panel is left half off screen. Best for galleries and step-by-step guides.",
    default: false,
  },
} as const satisfies Controls;
