import type { Controls } from "../../types";

/** Every key here is a prop on ImageReveal. */
export const controls = {
  duration: {
    kind: "range",
    label: "Duration",
    help: "How long the mask takes to open. Large hero images can take 1.5s; thumbnails in a grid want 0.6s or less.",
    min: 0.3,
    max: 2.5,
    step: 0.05,
    default: 1.2,
    unit: "s",
  },
  direction: {
    kind: "select",
    label: "Direction",
    help: "Which way the mask opens. Up mirrors text rising into place; left and right suit images in a row read left to right.",
    options: [
      { value: "up", label: "up" },
      { value: "down", label: "down" },
      { value: "left", label: "left" },
      { value: "right", label: "right" },
    ],
    default: "up",
  },
  zoom: {
    kind: "range",
    label: "Zoom",
    help: "How far the image is enlarged before it settles. 1.2 adds depth; 1 turns the zoom off entirely.",
    min: 1,
    max: 1.6,
    step: 0.05,
    default: 1.25,
    unit: "×",
  },
  ease: {
    kind: "select",
    label: "Ease",
    help: "expo.inOut starts and ends gently with a fast middle, like a curtain pulled. power3.out opens fast and slows.",
    options: [
      { value: "expo.inOut", label: "expo.inOut" },
      { value: "power3.out", label: "power3.out" },
      { value: "power4.inOut", label: "power4.inOut" },
      { value: "none", label: "linear" },
    ],
    default: "expo.inOut",
  },
} as const satisfies Controls;
