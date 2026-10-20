import type { Controls } from "../../types";

/** Every key here is a prop on DrawerMenu. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long the drawer takes to slide in. Navigation should feel quick: 0.4–0.6s. Closing replays it backwards, a little faster.",
    min: 0.2,
    max: 1.2,
    step: 0.05,
    default: 0.55,
    unit: "s",
  },
  side: {
    kind: "select",
    label: "Side",
    help: "Match the edge the menu button sits on, so the drawer appears to come from it.",
    options: [
      { value: "right", label: "right" },
      { value: "left", label: "left" },
    ],
    default: "right",
  },
  stagger: {
    kind: "range",
    label: "Stagger",
    help: "The gap between links arriving. Small values read as one sweep; past 0.1s the last link arrives noticeably late.",
    min: 0,
    max: 0.15,
    step: 0.01,
    default: 0.05,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "expo.out shoots in and glides to a stop, like a drawer on runners. power3.out is softer.",
    options: [
      { value: "expo.out", label: "expo.out" },
      { value: "power3.out", label: "power3.out" },
      { value: "power4.inOut", label: "power4.inOut" },
      { value: "back.out(1.2)", label: "back.out(1.2)" },
    ],
    default: "expo.out",
  },
} as const satisfies Controls;
