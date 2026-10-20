# Marquee

An endless strip of logos, words or cards that slides past at a steady pace.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

The strip renders your `MarqueeItem` children twice, side by side, and slides the pair
by exactly one copy's width over `duration`, then repeats, so the join is invisible.
`gap` spaces the items and the seam alike.

The second copy is hidden from screen readers and from keyboard focus, so everything is
announced and tabbable once. With `pauseOnHover` on, the strip eases to a stop while the
pointer is over it or focus is inside it, and eases back up afterwards. It pauses itself
while scrolled out of view, so it costs nothing off screen. If the items are narrower
than the strip, repeat them until they overflow, or you will see the loop restart.

Under `prefers-reduced-motion: reduce` the strip stays still.

## Props

| Prop           | Type                | Default  | When you'd use it                                              |
| -------------- | ------------------- | -------- | -------------------------------------------------------------- |
| `duration`     | `number`            | `24`     | Seconds per loop. Logos read at 20–30s; text needs longer.     |
| `direction`    | `"left" \| "right"` | `"left"` | Use right for a second strip beneath, so the two counter-move. |
| `gap`          | `number`            | `32`     | Space between items, including the seam where the loop joins.  |
| `pauseOnHover` | `boolean`           | `true`   | Leave on if anything in the strip is a link.                   |
| `autoplay`     | `boolean`           | `true`   | Turn off to keep the strip still.                              |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/marquee.json
```

## Usage

```tsx
import { Marquee, MarqueeItem } from "@/components/ijo/marquee";

<Marquee duration={24}>
  {stockists.map((name) => (
    <MarqueeItem key={name}>{name}</MarqueeItem>
  ))}
</Marquee>;
```

## Accessibility and performance

One `transform` tween drives the whole strip. Moving content that runs longer than five
seconds needs a way to stop it (WCAG 2.2.2): hover and focus pause it here, and the
reduced-motion preference stops it entirely. If the strip carries information people
must read, add a visible pause button that sets `autoplay={false}`.
