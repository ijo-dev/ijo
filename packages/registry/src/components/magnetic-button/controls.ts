import type { Controls } from "../../types";

/** Every key here is a prop on MagneticButton. */
export const controls = {
  strength: {
    kind: "range",
    label: "Strength",
    help: "How far the button follows the pointer. Around 0.3 feels like a gentle pull; past 0.6 the button chases the cursor and becomes hard to click.",
    min: 0,
    max: 1,
    step: 0.05,
    default: 0.35,
  },
  depth: {
    kind: "range",
    label: "Label depth",
    help: "How much further the label moves than the button, which reads as depth. Set 0 to move them together.",
    min: 0,
    max: 1.5,
    step: 0.05,
    default: 0.5,
  },
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long the spring home takes after the pointer leaves. Elastic eases need about 0.8s to finish wobbling.",
    min: 0.2,
    max: 2,
    step: 0.05,
    default: 0.9,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "elastic.out gives the springy settle; power3.out returns without overshoot, for quieter interfaces.",
    options: [
      { value: "elastic.out(1, 0.4)", label: "elastic.out(1, 0.4)" },
      { value: "elastic.out(1, 0.6)", label: "elastic.out(1, 0.6)" },
      { value: "back.out(2)", label: "back.out(2)" },
      { value: "power3.out", label: "power3.out" },
    ],
    default: "elastic.out(1, 0.4)",
  },
} as const satisfies Controls;
