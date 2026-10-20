import type { Controls } from "../../types";

/** Every key here is a prop on ScrollReveal. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long each item takes to arrive. Keep it under a second for lists, or readers wait on the animation to scroll on.",
    min: 0.2,
    max: 1.5,
    step: 0.05,
    default: 0.7,
    unit: "s",
  },
  distance: {
    kind: "range",
    label: "Distance",
    help: "How far below its place each item starts. 24–40px reads as settling; much more feels like items flying in.",
    min: 0,
    max: 120,
    step: 4,
    default: 32,
    unit: "px",
  },
  stagger: {
    kind: "range",
    label: "Stagger",
    help: "The gap between items that arrive together. It only applies within a batch, so a fast scroll never builds a queue.",
    min: 0,
    max: 0.3,
    step: 0.01,
    default: 0.08,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "power3.out settles softly. expo.out lands faster and suits text; back.out overshoots a touch, for playful cards.",
    options: [
      { value: "power3.out", label: "power3.out" },
      { value: "expo.out", label: "expo.out" },
      { value: "power1.out", label: "power1.out" },
      { value: "back.out(1.4)", label: "back.out(1.4)" },
    ],
    default: "power3.out",
  },
  start: {
    kind: "select",
    label: "Start",
    help: "How far into the viewport an item's top must reach before it reveals. Lower on screen means items appear sooner.",
    options: [
      { value: "top 95%", label: "as it peeks in" },
      { value: "top 85%", label: "a little way in" },
      { value: "top 70%", label: "well into view" },
    ],
    default: "top 85%",
  },
  once: {
    kind: "switch",
    label: "Reveal once",
    help: "Off hides items again when you scroll back above them, so they replay on the way down. Once is calmer for reading.",
    default: true,
  },
} as const satisfies Controls;
