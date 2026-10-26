import type { Meta } from "@ijo/registry";

/**
 * Plain-words matching for "What do you want to animate?". No AI and nothing is
 * sent anywhere: the request is scored against each component's title, tags,
 * description and a list of everyday phrases people use for the same effect.
 */

/** How people describe each effect when they don't know its name. */
const PHRASES: Record<string, string[]> = {
  "rise-in": [
    "fade in",
    "appear",
    "entrance",
    "intro",
    "page load",
    "one after another",
    "stack of",
    "hero content",
    "show up",
  ],
  "text-reveal": [
    "heading",
    "title",
    "headline",
    "slide up",
    "line by line",
    "letter by letter",
    "word by word",
    "hero text",
    "big text",
  ],
  "word-roller": [
    "rotating word",
    "changing word",
    "cycle",
    "swap word",
    "flip",
    "split flap",
    "alternating",
    "rotate",
    "one word changes",
    "keeps changing",
    "changing",
    "different words",
  ],
  "scramble-text": [
    "glitch",
    "hacker",
    "decode",
    "random characters",
    "matrix",
    "terminal",
    "shuffle",
    "order number",
    "confirmation code",
  ],
  "magnetic-button": [
    "magnet",
    "follow cursor",
    "follows the mouse",
    "follows the cursor",
    "follow the mouse",
    "pointer",
    "attract",
    "pull",
    "lean",
    "call to action",
    "cta",
  ],
  "jiggly-button": [
    "jelly",
    "wobble",
    "bounce",
    "squish",
    "squash",
    "playful",
    "fun button",
    "add to cart",
    "press",
  ],
  "scroll-reveal": [
    "on scroll",
    "as you scroll",
    "when scrolling",
    "list",
    "items",
    "products appear",
    "menu items",
    "grid appears",
  ],
  "pinned-scroll": [
    "horizontal",
    "sideways",
    "pin",
    "sticky",
    "steps",
    "timeline",
    "panels",
    "scroll sideways",
    "side scroll",
  ],
  "image-reveal": ["photo", "picture", "image", "wipe", "curtain", "uncover", "zoom", "hero image"],
  marquee: [
    "ticker",
    "logos",
    "infinite",
    "endless",
    "scrolling text",
    "banner",
    "clients",
    "partners",
    "strip",
    "news ticker",
    "forever",
    "scroll forever",
    "loop",
    "looping",
  ],
  accordion: [
    "faq",
    "questions",
    "expand",
    "collapse",
    "open and close",
    "show more",
    "dropdown",
    "details",
  ],
  "card-stack": [
    "pile",
    "deck",
    "stack",
    "swipe",
    "testimonials",
    "pricing cards",
    "cards on top",
    "shuffle cards",
  ],
  "drawer-menu": [
    "hamburger",
    "nav",
    "navigation",
    "sidebar",
    "mobile menu",
    "slide in menu",
    "off canvas",
    "side menu",
  ],
};

const STOP = new Set(
  "a an and the to of for on in at with that this my our your i we it is are be some like want make need from into as by or so when then just very".split(
    " ",
  ),
);

/** Lowercase, drop punctuation, and trim plural and -ing endings so "cards" meets "card". */
const stem = (word: string) =>
  word.length > 4 && word.endsWith("ing")
    ? word.slice(0, -3)
    : word.length > 3 && word.endsWith("s") && !word.endsWith("ss")
      ? word.slice(0, -1)
      : word;

const words = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((word) => word.length > 1 && !STOP.has(word))
    .map(stem);

export type Match = {
  meta: Meta;
  score: number;
  /** The words from the request that found this component, as typed. */
  because: string[];
};

export function match(request: string, items: Meta[]): Match[] {
  const text = ` ${request.toLowerCase().replace(/\s+/g, " ")} `;
  const asked = request
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((word) => word.length > 1 && !STOP.has(word));
  if (!asked.length) return [];

  return items
    .map((meta) => {
      const because = new Set<string>();
      let score = 0;
      // Whole phrases are the strongest signal: "logos", "mobile menu".
      for (const phrase of PHRASES[meta.name] ?? []) {
        if (text.includes(` ${phrase}`)) {
          score += phrase.includes(" ") ? 5 : 4;
          because.add(phrase);
        }
      }
      const weigh = (source: string, weight: number) => {
        const pool = new Set(words(source));
        for (const word of asked) {
          if (pool.has(stem(word))) {
            score += weight;
            because.add(word);
          }
        }
      };
      weigh(meta.title, 3);
      weigh(meta.tags.join(" "), 2);
      weigh(meta.category, 1);
      weigh(meta.description, 1);
      return { meta, score, because: [...because] };
    })
    .filter((result) => result.score >= 2)
    .sort((a, b) => b.score - a.score);
}

/** Ideas to try, shown under the box. Each one finds a different component. */
export const SUGGESTIONS = [
  "Pricing cards that pile up",
  "A headline that slides up line by line",
  "Logos that scroll forever",
  "A mobile menu that slides in",
  "A button that follows the cursor",
  "Products that appear as you scroll",
];
