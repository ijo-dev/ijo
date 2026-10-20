# Scroll Reveal Stagger

Reveals items as they scroll into view, in small staggered groups.

## Dependencies

`gsap` and its `ScrollTrigger` plugin (free, included in the `gsap` package), and
`@gsap/react` for the React variant.

## How it behaves

Each child wrapped in `ScrollRevealItem` starts transparent and `distance` pixels
below its place. When its top reaches `start` in the viewport it rises and fades in.

Items that cross the line together, such as a row of cards, are batched into one
reveal staggered by `stagger`, so a fast scroll down a long list never queues a slow
parade. With `once` off, items hide again when you scroll back above them and replay
on the way down. Pass `scroller` when the list lives inside its own scrolling box
rather than the page. Every trigger is killed on unmount or when a prop changes.

Under `prefers-reduced-motion: reduce` nothing is hidden or moved.

## Props

| Prop       | Type                     | Default        | When you'd use it                                                          |
| ---------- | ------------------------ | -------------- | -------------------------------------------------------------------------- |
| `duration` | `number`                 | `0.7`          | Keep under a second for lists, so readers aren't waiting to scroll on.     |
| `distance` | `number`                 | `32`           | 24–40px reads as settling; more feels like flying in.                      |
| `stagger`  | `number`                 | `0.08`         | The gap between items arriving together. Only applies within a batch.      |
| `ease`     | `string`                 | `"power3.out"` | `expo.out` lands faster for text; `back.out` overshoots for playful cards. |
| `start`    | `string`                 | `"top 85%"`    | How far in an item's top must reach. Lower on screen appears sooner.       |
| `once`     | `boolean`                | `true`         | Off replays items each time you scroll down past them.                     |
| `scroller` | `RefObject<HTMLElement>` | the page       | The box that scrolls, when the list isn't on the page itself.              |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/scroll-reveal.json
```

## Usage

```tsx
import { ScrollReveal, ScrollRevealItem } from "@/components/ijo/scroll-reveal";

<ScrollReveal stagger={0.08}>
  {roasts.map((roast) => (
    <ScrollRevealItem key={roast.id}>
      <RoastCard roast={roast} />
    </ScrollRevealItem>
  ))}
</ScrollReveal>;
```

## Accessibility and performance

Animates `transform` and `opacity` only. Hidden items are still in the document, so
screen readers and in-page search find them before they are revealed. One
ScrollTrigger per batch rather than per tween keeps long lists cheap on a phone.
