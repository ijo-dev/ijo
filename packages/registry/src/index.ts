import { RiseIn, RiseInItem } from "./components/rise-in/component";
import { RiseInDemo } from "./components/rise-in/demo";
import { controls as riseInControls } from "./components/rise-in/controls";
import riseInMeta from "./components/rise-in/meta.json";
import { TextReveal } from "./components/text-reveal/component";
import { TextRevealDemo } from "./components/text-reveal/demo";
import { controls as textRevealControls } from "./components/text-reveal/controls";
import textRevealMeta from "./components/text-reveal/meta.json";
import { WordRoller, WordRollerItem } from "./components/word-roller/component";
import { WordRollerDemo } from "./components/word-roller/demo";
import { controls as wordRollerControls } from "./components/word-roller/controls";
import wordRollerMeta from "./components/word-roller/meta.json";
import { ScrambleText } from "./components/scramble-text/component";
import { ScrambleTextDemo } from "./components/scramble-text/demo";
import { controls as scrambleTextControls } from "./components/scramble-text/controls";
import scrambleTextMeta from "./components/scramble-text/meta.json";
import { MagneticButton } from "./components/magnetic-button/component";
import { MagneticButtonDemo } from "./components/magnetic-button/demo";
import { controls as magneticButtonControls } from "./components/magnetic-button/controls";
import magneticButtonMeta from "./components/magnetic-button/meta.json";
import { JigglyButton } from "./components/jiggly-button/component";
import { JigglyButtonDemo } from "./components/jiggly-button/demo";
import { controls as jigglyButtonControls } from "./components/jiggly-button/controls";
import jigglyButtonMeta from "./components/jiggly-button/meta.json";
import { ScrollReveal, ScrollRevealItem } from "./components/scroll-reveal/component";
import { ScrollRevealDemo } from "./components/scroll-reveal/demo";
import { controls as scrollRevealControls } from "./components/scroll-reveal/controls";
import scrollRevealMeta from "./components/scroll-reveal/meta.json";
import { PinnedScroll, PinnedScrollItem } from "./components/pinned-scroll/component";
import { PinnedScrollDemo } from "./components/pinned-scroll/demo";
import { controls as pinnedScrollControls } from "./components/pinned-scroll/controls";
import pinnedScrollMeta from "./components/pinned-scroll/meta.json";
import { ImageReveal } from "./components/image-reveal/component";
import { ImageRevealDemo } from "./components/image-reveal/demo";
import { controls as imageRevealControls } from "./components/image-reveal/controls";
import imageRevealMeta from "./components/image-reveal/meta.json";
import { Marquee, MarqueeItem } from "./components/marquee/component";
import { MarqueeDemo } from "./components/marquee/demo";
import { controls as marqueeControls } from "./components/marquee/controls";
import marqueeMeta from "./components/marquee/meta.json";
import { Accordion, AccordionItem } from "./components/accordion/component";
import { AccordionDemo } from "./components/accordion/demo";
import { controls as accordionControls } from "./components/accordion/controls";
import accordionMeta from "./components/accordion/meta.json";
import { CardStack, CardStackItem } from "./components/card-stack/component";
import { CardStackDemo } from "./components/card-stack/demo";
import { controls as cardStackControls } from "./components/card-stack/controls";
import cardStackMeta from "./components/card-stack/meta.json";
import { DrawerMenu, DrawerMenuItem } from "./components/drawer-menu/component";
import { DrawerMenuDemo } from "./components/drawer-menu/demo";
import { controls as drawerMenuControls } from "./components/drawer-menu/controls";
import drawerMenuMeta from "./components/drawer-menu/meta.json";
import { sources } from "./generated/sources";
import type { Category, Meta, RegistryEntry } from "./types";

export * from "./types";

/**
 * Every component in the library, in the order the site shows them.
 * Source text comes from ./generated/sources.ts, which the registry build
 * writes from the real files on disk — so the code tabs can never drift
 * from what `npx shadcn add` installs.
 */
export const registry: RegistryEntry[] = [
  {
    meta: { ...(riseInMeta as Meta), sizeGzip: sources["rise-in"].sizeGzip },
    controls: riseInControls,
    source: sources["rise-in"].source,
  },
  {
    meta: { ...(textRevealMeta as Meta), sizeGzip: sources["text-reveal"].sizeGzip },
    controls: textRevealControls,
    source: sources["text-reveal"].source,
  },
  {
    meta: { ...(wordRollerMeta as Meta), sizeGzip: sources["word-roller"].sizeGzip },
    controls: wordRollerControls,
    source: sources["word-roller"].source,
  },
  {
    meta: { ...(scrambleTextMeta as Meta), sizeGzip: sources["scramble-text"].sizeGzip },
    controls: scrambleTextControls,
    source: sources["scramble-text"].source,
  },
  {
    meta: { ...(magneticButtonMeta as Meta), sizeGzip: sources["magnetic-button"].sizeGzip },
    controls: magneticButtonControls,
    source: sources["magnetic-button"].source,
  },
  {
    meta: { ...(jigglyButtonMeta as Meta), sizeGzip: sources["jiggly-button"].sizeGzip },
    controls: jigglyButtonControls,
    source: sources["jiggly-button"].source,
  },
  {
    meta: { ...(scrollRevealMeta as Meta), sizeGzip: sources["scroll-reveal"].sizeGzip },
    controls: scrollRevealControls,
    source: sources["scroll-reveal"].source,
  },
  {
    meta: { ...(pinnedScrollMeta as Meta), sizeGzip: sources["pinned-scroll"].sizeGzip },
    controls: pinnedScrollControls,
    source: sources["pinned-scroll"].source,
  },
  {
    meta: { ...(imageRevealMeta as Meta), sizeGzip: sources["image-reveal"].sizeGzip },
    controls: imageRevealControls,
    source: sources["image-reveal"].source,
  },
  {
    meta: { ...(marqueeMeta as Meta), sizeGzip: sources["marquee"].sizeGzip },
    controls: marqueeControls,
    source: sources["marquee"].source,
  },
  {
    meta: { ...(accordionMeta as Meta), sizeGzip: sources["accordion"].sizeGzip },
    controls: accordionControls,
    source: sources["accordion"].source,
  },
  {
    meta: { ...(cardStackMeta as Meta), sizeGzip: sources["card-stack"].sizeGzip },
    controls: cardStackControls,
    source: sources["card-stack"].source,
  },
  {
    meta: { ...(drawerMenuMeta as Meta), sizeGzip: sources["drawer-menu"].sizeGzip },
    controls: drawerMenuControls,
    source: sources["drawer-menu"].source,
  },
];

/** The live preview for each component, keyed by slug. The customize panel
 *  passes its current values straight through as props. */
export const demos = {
  "rise-in": RiseInDemo,
  "text-reveal": TextRevealDemo,
  "word-roller": WordRollerDemo,
  "scramble-text": ScrambleTextDemo,
  "magnetic-button": MagneticButtonDemo,
  "jiggly-button": JigglyButtonDemo,
  "scroll-reveal": ScrollRevealDemo,
  "pinned-scroll": PinnedScrollDemo,
  "image-reveal": ImageRevealDemo,
  marquee: MarqueeDemo,
  accordion: AccordionDemo,
  "card-stack": CardStackDemo,
  "drawer-menu": DrawerMenuDemo,
} as const;

export const byName = (name: string) => registry.find((entry) => entry.meta.name === name);

export const categories = (): Category[] => {
  const used = new Set(registry.map((entry) => entry.meta.category));
  return [...used].sort();
};

export {
  RiseIn,
  RiseInItem,
  RiseInDemo,
  TextReveal,
  TextRevealDemo,
  WordRoller,
  WordRollerItem,
  WordRollerDemo,
  ScrambleText,
  ScrambleTextDemo,
  MagneticButton,
  MagneticButtonDemo,
  JigglyButton,
  JigglyButtonDemo,
  ScrollReveal,
  ScrollRevealItem,
  ScrollRevealDemo,
  PinnedScroll,
  PinnedScrollItem,
  PinnedScrollDemo,
  ImageReveal,
  ImageRevealDemo,
  Marquee,
  MarqueeItem,
  MarqueeDemo,
  Accordion,
  AccordionItem,
  AccordionDemo,
  CardStack,
  CardStackItem,
  CardStackDemo,
  DrawerMenu,
  DrawerMenuItem,
  DrawerMenuDemo,
};
