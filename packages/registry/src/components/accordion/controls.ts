import type { Controls } from "../../types";

/** Every key here is a prop on Accordion. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long a section takes to open or close. Around 0.4s feels responsive; long answers can take 0.6s so the eye can follow.",
    min: 0.15,
    max: 1.2,
    step: 0.05,
    default: 0.45,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "power3.inOut starts and stops gently. expo.out snaps open and settles, which feels quicker at the same duration.",
    options: [
      { value: "power3.inOut", label: "power3.inOut" },
      { value: "expo.out", label: "expo.out" },
      { value: "power2.out", label: "power2.out" },
      { value: "back.out(1.2)", label: "back.out(1.2)" },
    ],
    default: "power3.inOut",
  },
  single: {
    kind: "switch",
    label: "One open at a time",
    help: "Close the open section when another opens. Good for long FAQs on a phone; leave off when people compare answers.",
    default: false,
  },
} as const satisfies Controls;
