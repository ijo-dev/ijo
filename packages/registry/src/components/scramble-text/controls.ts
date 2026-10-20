import type { Controls } from "../../types";

/** Every key here is a prop on ScrambleText. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "Time from the first scrambled frame to the settled text. Short lines want about 1s; longer ones need more, or the letters settle in a rush.",
    min: 0.4,
    max: 3,
    step: 0.1,
    default: 1.2,
    unit: "s",
  },
  chars: {
    kind: "select",
    label: "Characters",
    help: "What the scramble draws from. Capitals and digits suit codes and labels; symbols read as a terminal; lower case is softest.",
    options: [
      { value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", label: "A–Z and 0–9" },
      { value: "upperCase", label: "A–Z" },
      { value: "lowerCase", label: "a–z" },
      { value: "0123456789", label: "0–9" },
      { value: "!<>-_\\/[]{}=+*^?#", label: "symbols" },
    ],
    default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  },
  revealDelay: {
    kind: "range",
    label: "Reveal delay",
    help: "Seconds of pure noise before the first real letter appears. A little builds anticipation; too much hides the message.",
    min: 0,
    max: 1.5,
    step: 0.05,
    default: 0.3,
    unit: "s",
  },
  speed: {
    kind: "range",
    label: "Shuffle speed",
    help: "How often the random letters change. Lower is calmer and easier on the eye; 1 and above flickers.",
    min: 0.1,
    max: 2,
    step: 0.1,
    default: 0.6,
  },
  replayOnHover: {
    kind: "switch",
    label: "Replay on hover",
    help: "Scramble again when the pointer enters or the element is focused. Good for buttons and nav labels.",
    default: false,
  },
} as const satisfies Controls;
