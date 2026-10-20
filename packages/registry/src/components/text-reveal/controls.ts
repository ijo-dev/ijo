import type { Controls } from "../../types";

/** Every key here is a prop on TextReveal. */
export const controls = {
  split: {
    kind: "select",
    label: "Split by",
    help: "Lines suit headings and paragraphs; words feel livelier for short taglines; letters only for a word or two, or it drags.",
    options: [
      { value: "lines", label: "lines" },
      { value: "words", label: "words" },
      { value: "chars", label: "letters" },
    ],
    default: "lines",
  },
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long each line, word or letter takes to rise. Shorten it when splitting by letters, or the reveal crawls.",
    min: 0.2,
    max: 2,
    step: 0.05,
    default: 0.8,
    unit: "s",
  },
  stagger: {
    kind: "range",
    label: "Stagger",
    help: "The gap between one unit and the next. Lines want about 0.08s; letters want 0.02s or less.",
    min: 0,
    max: 0.3,
    step: 0.01,
    default: 0.08,
    unit: "s",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "expo.out arrives fast and settles softly, which reads well for type. power3.out is calmer.",
    options: [
      { value: "expo.out", label: "expo.out" },
      { value: "power3.out", label: "power3.out" },
      { value: "power2.inOut", label: "power2.inOut" },
      { value: "back.out(1.6)", label: "back.out(1.6)" },
    ],
    default: "expo.out",
  },
  delay: {
    kind: "range",
    label: "Delay",
    help: "A pause before the first unit moves, to let an image or page transition land first.",
    min: 0,
    max: 1,
    step: 0.05,
    default: 0,
    unit: "s",
  },
} as const satisfies Controls;
