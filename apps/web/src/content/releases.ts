/**
 * Everything that shipped, newest first. The changelog reads this; add a release
 * at the top. `components` are registry names shown as live previews; `visual`
 * picks a custom illustration for releases that are about the site itself.
 */
export type Release = {
  /** ISO date, e.g. "2026-10-26". */
  date: string;
  title: string;
  /** One or two plain sentences: what changed for the reader. */
  summary: string;
  changes: string[];
  /** Up to three registry names to preview. */
  components?: string[];
  /** Further components to link to, by name, without a preview. */
  more?: string[];
  visual?: "canvas";
};

export const releases: Release[] = [
  {
    date: "2026-10-26",
    title: "What do you want to animate?",
    summary:
      "The home page now opens with a prompt box. Describe the motion in your own words and Ijó finds the component, shows it live and writes the prompt for your AI agent.",
    components: ["card-stack"],
    changes: [
      "Matching runs in your browser from each component's name, tags and everyday phrases. No AI, nothing sent, and it answers at once on slow data.",
      "The answer shows which of your words found it, with Copy prompt for Claude Code, Cursor or any agent.",
      "Examples roll through the empty box one at a time, and Try this example fills one in.",
      "Phones get a floating dock at the bottom for Home, Library, Search, Docs and Changelog.",
      "Clicking outside search now closes it, and the page behind dims properly.",
    ],
  },
  {
    date: "2026-10-26",
    title: "A darker canvas, a faster search",
    summary:
      "The site now sits on a near-black canvas, so the purple and the demos carry the colour. Search, the library and this changelog were redesigned.",
    visual: "canvas",
    changes: [
      "The canvas is #0b0a0e, down from #17161b. Every surface steps up from there, and text contrast went up across the site.",
      "Search is a compact list grouped by category, with filters you can step through with Tab, highlighted matches and the docs pages.",
      "Search no longer loads live previews, so it opens at once on a slow connection.",
      "The library has a featured component, tabs with counts and quieter cards.",
      "This changelog became a timeline you scroll back through.",
    ],
  },
  {
    date: "2026-10-20",
    title: "JetBrains Mono and ⌘K",
    summary:
      "The site is set in JetBrains Mono for a firmer, more technical frame, and search opens from anywhere.",
    changes: [
      "Press ⌘K, Ctrl+K or / on any page to search.",
      "Demos keep Schibsted Grotesk, so they still read like real products.",
      "Phones tint their browser bar to match the canvas.",
    ],
  },
  {
    date: "2026-10-20",
    title: "Twelve new components",
    summary:
      "Text, buttons, scroll, menus and UI. Each one is under 3 KB gzipped, respects reduced motion, and comes with React, Vue and HTML code.",
    components: ["text-reveal", "card-stack", "magnetic-button"],
    more: [
      "word-roller",
      "scramble-text",
      "jiggly-button",
      "scroll-reveal",
      "pinned-scroll",
      "image-reveal",
      "marquee",
      "accordion",
      "drawer-menu",
    ],
    changes: [
      "Every prop drives the customise panel, the props table and the code you copy.",
      "Scroll components can follow a scrolling box, not only the page.",
      "Each component has a smoke test on a desktop and a phone screen.",
    ],
  },
  {
    date: "2026-10-14",
    title: "The first component",
    summary: "The library, the site and the install flow, with Rise In as the first component.",
    components: ["rise-in"],
    changes: [
      "Install any component with one npx shadcn add command, or copy the code.",
      "Design tokens drive the site and the Tailwind theme.",
      "Checks run on every change: lint, types, a build and browser tests.",
    ],
  },
];
