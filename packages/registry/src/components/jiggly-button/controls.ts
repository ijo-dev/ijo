import type { Controls } from "../../types";

/** Every key here is a prop on JigglyButton. */
export const controls = {
  intensity: {
    kind: "range",
    label: "Intensity",
    help: "How hard the button squashes. Around 0.5 reads as playful; 1 is cartoonish and suits games or kids' products.",
    min: 0.1,
    max: 1,
    step: 0.05,
    default: 0.5,
  },
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long the wobble takes to settle. Under 0.5s it reads as a twitch; over 1.2s it keeps wobbling after the eye has moved on.",
    min: 0.3,
    max: 2,
    step: 0.05,
    default: 0.8,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "The elastic settings decide how many wobbles you see. The second number is the period: smaller means more, faster wobbles.",
    options: [
      { value: "elastic.out(1.2, 0.3)", label: "elastic.out(1.2, 0.3)" },
      { value: "elastic.out(1, 0.5)", label: "elastic.out(1, 0.5)" },
      { value: "elastic.out(1.6, 0.25)", label: "elastic.out(1.6, 0.25)" },
      { value: "back.out(3)", label: "back.out(3)" },
    ],
    default: "elastic.out(1.2, 0.3)",
  },
  trigger: {
    kind: "select",
    label: "Trigger",
    help: "Press-only keeps the wobble as feedback for the click itself, which is calmer in a busy layout.",
    options: [
      { value: "both", label: "hover and press" },
      { value: "hover", label: "hover" },
      { value: "press", label: "press" },
    ],
    default: "both",
  },
} as const satisfies Controls;
