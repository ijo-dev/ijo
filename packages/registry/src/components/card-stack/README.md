# Card Stack

A pile of cards: the top one lifts away and slides to the back, and the rest move up.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

The `CardStackItem` children are stacked in one grid cell. Each card below sits
`offset` pixels lower, slightly smaller, and tilted by `rotation` degrees to
alternating sides; cards past the third fade out so the pile stays tidy.

Clicking the top card (anywhere but a link or button on it) or pressing the next
button lifts the top card away, drops it to the back, and moves every other card up
one place, staggered so the pile settles naturally. A click while a move is in progress
is ignored, so the order can never scramble.

Only the top card is exposed: the rest are `inert` and hidden from screen readers, and a
status message announces which card is now on top.

Under `prefers-reduced-motion: reduce` the top card fades out and the next fades in,
with no travel.

## Props

| Prop              | Type     | Default        | When you'd use it                                    |
| ----------------- | -------- | -------------- | ---------------------------------------------------- |
| `duration`        | `number` | `0.7`          | About 0.7s lets the eye follow the card to the back. |
| `offset`          | `number` | `14`           | 10–16px reads as a pile; 0 hides the cards beneath.  |
| `rotation`        | `number` | `4`            | A hand-stacked look. 0 keeps it square.              |
| `ease`            | `string` | `"power3.out"` | `back.out` adds a small bounce as each card lands.   |
| `nextLabel`       | `string` | `"Next card"`  | The button text.                                     |
| `buttonClassName` | `string` | —              | Styles for the next button.                          |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/card-stack.json
```

## Usage

```tsx
import { CardStack, CardStackItem } from "@/components/ijo/card-stack";

<CardStack offset={14} rotation={4}>
  {roasts.map((roast) => (
    <CardStackItem key={roast.id} className="h-48 w-64 rounded-xl bg-neutral-800 p-5">
      <h3>{roast.name}</h3>
    </CardStackItem>
  ))}
</CardStack>;
```

## Accessibility and performance

The next button is a real button, so the deck works from the keyboard; the click on the
card itself is a shortcut for pointer users. Only `transform`, `opacity` and `z-index`
change. Give every card the same size, or the pile's outline jumps as cards rotate
through.
