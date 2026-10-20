import type { Controls } from "../../types";

/** Every key here is a prop on Marquee. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "Seconds for one full loop. Logos read well at 20–30s; text needs longer, or people chase it to read.",
    min: 4,
    max: 60,
    step: 1,
    default: 24,
    unit: "s",
  },
  direction: {
    kind: "select",
    label: "Direction",
    help: "Left reads naturally in left-to-right languages. Use right for a second strip running beneath, so the two counter-move.",
    options: [
      { value: "left", label: "left" },
      { value: "right", label: "right" },
    ],
    default: "left",
  },
  gap: {
    kind: "range",
    label: "Gap",
    help: "Space between items, including the seam where the loop joins, so the join is invisible.",
    min: 0,
    max: 96,
    step: 4,
    default: 32,
    unit: "px",
  },
  pauseOnHover: {
    kind: "switch",
    label: "Pause on hover",
    help: "Ease to a stop under the pointer or keyboard focus, so items can be read and clicked. Leave on if anything in the strip is a link.",
    default: true,
  },
} as const satisfies Controls;
