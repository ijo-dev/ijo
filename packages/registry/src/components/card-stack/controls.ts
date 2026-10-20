import type { Controls } from "../../types";

/** Every key here is a prop on CardStack. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "Time from the top card lifting to the pile settling. About 0.7s lets the eye follow the card to the back.",
    min: 0.3,
    max: 1.5,
    step: 0.05,
    default: 0.7,
    unit: "s",
  },
  offset: {
    kind: "range",
    label: "Offset",
    help: "How far each card below peeks out. 10–16px makes the pile read as a pile; 0 hides the cards beneath entirely.",
    min: 0,
    max: 32,
    step: 1,
    default: 14,
    unit: "px",
  },
  rotation: {
    kind: "range",
    label: "Tilt",
    help: "How far the cards below are turned, alternating sides, like a hand-stacked pile. 0 keeps it tidy and square.",
    min: 0,
    max: 12,
    step: 0.5,
    default: 4,
    unit: "°",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "How the pile settles after the top card leaves. back.out adds a small bounce as each card lands.",
    options: [
      { value: "power3.out", label: "power3.out" },
      { value: "back.out(1.6)", label: "back.out(1.6)" },
      { value: "expo.out", label: "expo.out" },
      { value: "elastic.out(1, 0.6)", label: "elastic.out(1, 0.6)" },
    ],
    default: "power3.out",
  },
} as const satisfies Controls;
