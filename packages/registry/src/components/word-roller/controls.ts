import type { Controls } from "../../types";

/** Every key here is a prop on WordRoller. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long one word takes to roll out as the next rolls in. Under 0.4s it reads as a flick; past 1s it drags.",
    min: 0.2,
    max: 1.5,
    step: 0.05,
    default: 0.6,
    unit: "s",
  },
  hold: {
    kind: "range",
    label: "Hold",
    help: "How long each word stays put. Give readers at least a second to take a word in before it moves.",
    min: 0.5,
    max: 4,
    step: 0.1,
    default: 1.6,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "power3.inOut eases out of one word and into the next. back.inOut adds a small overshoot, like a mechanical counter.",
    options: [
      { value: "power3.inOut", label: "power3.inOut" },
      { value: "expo.inOut", label: "expo.inOut" },
      { value: "back.inOut(1.4)", label: "back.inOut(1.4)" },
      { value: "none", label: "linear" },
    ],
    default: "power3.inOut",
  },
  direction: {
    kind: "select",
    label: "Direction",
    help: "Up feels like progress and suits most lists. Down reads as counting back, so save it for countdowns.",
    options: [
      { value: "up", label: "up" },
      { value: "down", label: "down" },
    ],
    default: "up",
  },
} as const satisfies Controls;
