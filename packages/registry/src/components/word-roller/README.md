# Word Roller

Rolls one word in a sentence through a list of alternatives, like a split-flap sign.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

Wrap each alternative in `WordRollerItem`. All of them sit in the same grid cell, so
the slot is as wide as the longest word and the sentence around it never shifts.

The first word shows straight away. After `hold` seconds it rolls out as the next
rolls in, and the list loops for as long as the component is mounted. Only the first
word is exposed to screen readers, so the sentence reads once rather than as a list.
With fewer than two words it renders the word and does nothing. Set `autoplay` to
`false` to keep it still.

Under `prefers-reduced-motion: reduce` the words cross-fade in place over 0.2s with no
travel.

## Props

| Prop        | Type             | Default          | When you'd use it                                               |
| ----------- | ---------------- | ---------------- | --------------------------------------------------------------- |
| `duration`  | `number`         | `0.6`            | Roll time. Under 0.4s reads as a flick; past 1s it drags.       |
| `hold`      | `number`         | `1.6`            | How long each word stays. Give readers at least a second.       |
| `ease`      | `string`         | `"power3.inOut"` | `back.inOut` adds a small overshoot, like a mechanical counter. |
| `direction` | `"up" \| "down"` | `"up"`           | Up feels like progress; down reads as counting back.            |
| `autoplay`  | `boolean`        | `true`           | Turn off to show the first word and stay still.                 |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/word-roller.json
```

## Usage

```tsx
import { WordRoller, WordRollerItem } from "@/components/ijo/word-roller";

<h2>
  Coffee for{" "}
  <WordRoller hold={1.6}>
    <WordRollerItem>slow mornings</WordRollerItem>
    <WordRollerItem>long deadlines</WordRollerItem>
  </WordRoller>
</h2>;
```

## Accessibility and performance

Animates `transform` only (or `opacity` under reduced motion). The words loop
indefinitely, so keep the hold long enough to read, and consider pausing it with
`autoplay={false}` once the visitor has scrolled past.
