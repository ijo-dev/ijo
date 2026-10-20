# Pinned Horizontal Scroll

Pins a section in place and turns vertical scrolling into a sideways walk through a row
of panels.

## Dependencies

`gsap` and its `ScrollTrigger` plugin (free, included in the `gsap` package), and
`@gsap/react` for the React variant.

## How it behaves

When the top of the section reaches the top of the viewport it pins there, and further
scrolling moves the row of `PinnedScrollItem` panels sideways until the last panel's
edge meets the section's edge. Then the section unpins and the page carries on.

The scroll distance is the row's overflow times `length`, re-measured when the window
resizes, so the last panel always lands exactly at the edge. `scrub` smooths the row's
movement behind the scrollbar; `snap` settles it on the nearest panel when scrolling
stops. Pass `scroller` when the section lives inside its own scrolling box. If the
panels fit without overflowing, nothing pins.

Under `prefers-reduced-motion: reduce` nothing is pinned or scroll-driven: the row is an
ordinary sideways strip that people swipe or scroll themselves.

## Props

| Prop       | Type                     | Default  | When you'd use it                                                        |
| ---------- | ------------------------ | -------- | ------------------------------------------------------------------------ |
| `scrub`    | `number`                 | `0.6`    | 0 locks the row to the scrollbar; about 0.5 smooths a jerky wheel.       |
| `length`   | `number`                 | `1`      | Raise it when panels carry text people need time to read.                |
| `snap`     | `boolean`                | `false`  | Settle on the nearest panel. Best for galleries and step-by-step guides. |
| `scroller` | `RefObject<HTMLElement>` | the page | The box that scrolls, when the section isn't on the page itself.         |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/pinned-scroll.json
```

## Usage

```tsx
import { PinnedScroll, PinnedScrollItem } from "@/components/ijo/pinned-scroll";

<PinnedScroll className="h-screen" snap>
  {guides.map((guide) => (
    <PinnedScrollItem key={guide.name} className="h-full w-[80vw]">
      <BrewGuide guide={guide} />
    </PinnedScrollItem>
  ))}
</PinnedScroll>;
```

## Accessibility and performance

One `transform` tween, scrubbed by one ScrollTrigger. Hijacking scroll direction is
disorienting for some people, which is why reduced motion turns it into a plain
scrollable strip rather than a faster version of the same thing. Keep the panel count
modest: every panel is a viewport's worth of scrolling.
