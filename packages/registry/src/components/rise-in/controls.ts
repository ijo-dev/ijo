import type { Controls } from "../../types";

/**
 * Every key here is a prop on RiseIn. The customize panel, the props table and
 * the generated snippet are all built from this one object.
 */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long one child takes to arrive. Raise it for large hero text, lower it for list rows that shouldn't hold the reader up.",
    min: 0.2,
    max: 2,
    step: 0.05,
    default: 0.9,
    unit: "s",
  },
  distance: {
    kind: "range",
    label: "Distance",
    help: "How far below its resting place a child starts. Keep it under the line height of the text, or the reveal reads as a jump rather than a settle.",
    min: 0,
    max: 80,
    step: 2,
    default: 24,
    unit: "px",
  },
  stagger: {
    kind: "range",
    label: "Stagger",
    help: "The gap between one child starting and the next. Around 0.06s reads as a single gesture; past 0.2s the items feel unrelated.",
    min: 0,
    max: 0.4,
    step: 0.01,
    default: 0.06,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "The shape of the motion. expo.out arrives fast and settles, which suits text; power2.out is gentler for images and cards.",
    options: [
      { value: "expo.out", label: "expo.out" },
      { value: "power2.out", label: "power2.out" },
      { value: "power4.out", label: "power4.out" },
      { value: "back.out(1.4)", label: "back.out(1.4)" },
      { value: "circ.out", label: "circ.out" },
    ],
    default: "expo.out",
  },
  delay: {
    kind: "range",
    label: "Delay",
    help: "A pause before the first child moves. Use it to let a page transition or an image finish first.",
    min: 0,
    max: 1,
    step: 0.05,
    default: 0,
    unit: "s",
  },
  staggered: {
    kind: "switch",
    label: "Stagger children",
    help: "Off reveals every child at once. Use that when the group is one idea, such as a price and its currency.",
    default: true,
  },
} as const satisfies Controls;
