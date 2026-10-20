# Jiggly Button

A button that squashes and wobbles back into shape, like jelly, when you hover or press it.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

On hover, press, or both (`trigger`), the button squashes wider and shorter in a tenth
of a second, then springs back over `duration` with an elastic ease, wobbling a few
times before it settles. `intensity` sets how far it squashes.

A new wobble replaces one already running rather than adding to it, so pressing
repeatedly never leaves the button stretched. Scaling happens around the centre and
doesn't move the hit area. It is a real `<button>`: your own `onClick`,
`onPointerEnter`, `onPointerDown` and every other prop still work.

Under `prefers-reduced-motion: reduce` it never moves.

## Props

| Prop        | Type                           | Default                   | When you'd use it                                                    |
| ----------- | ------------------------------ | ------------------------- | -------------------------------------------------------------------- |
| `intensity` | `number`                       | `0.5`                     | 0.5 is playful; 1 is cartoonish, for games or kids' products.        |
| `duration`  | `number`                       | `0.8`                     | Under 0.5s reads as a twitch; over 1.2s keeps wobbling too long.     |
| `ease`      | `string`                       | `"elastic.out(1.2, 0.3)"` | The second elastic number is the period: smaller means more wobbles. |
| `trigger`   | `"hover" \| "press" \| "both"` | `"both"`                  | Press-only keeps it as click feedback, calmer in a busy layout.      |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/jiggly-button.json
```

## Usage

```tsx
import { JigglyButton } from "@/components/ijo/jiggly-button";

<JigglyButton trigger="press" onClick={addToCart}>
  Add to cart
</JigglyButton>;
```

## Accessibility and performance

Only `transform` changes. Pair the wobble with a real result (a cart count, a toast)
so it confirms something rather than decorating. A keyboard press with Enter or Space
wobbles it too, since it has no pointer event of its own.
