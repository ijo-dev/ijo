# Magnetic Button

A button that leans toward the pointer while it hovers, then springs back when it leaves.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

While the pointer moves over the button, the button eases toward it by `strength`
times the pointer's distance from its centre, and the label travels a little further
by `depth`, which reads as depth. When the pointer leaves, both spring back over
`duration` with the chosen `ease`.

Movement uses `gsap.quickTo`, so a fast pointer costs one tween per axis rather than
one per event. The effect only switches on where there is a precise pointer that can
hover, so on phones and tablets it is an ordinary button. Every other prop, including
`onClick` and `disabled`, passes straight through to the `<button>`.

Under `prefers-reduced-motion: reduce` it never moves.

## Props

| Prop       | Type     | Default                 | When you'd use it                                                  |
| ---------- | -------- | ----------------------- | ------------------------------------------------------------------ |
| `strength` | `number` | `0.35`                  | About 0.3 is a gentle pull; past 0.6 the button chases the cursor. |
| `depth`    | `number` | `0.5`                   | Extra travel for the label. 0 moves label and button together.     |
| `duration` | `number` | `0.9`                   | The spring home. Elastic eases need about 0.8s to settle.          |
| `ease`     | `string` | `"elastic.out(1, 0.4)"` | `power3.out` returns without overshoot, for quieter interfaces.    |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/magnetic-button.json
```

## Usage

```tsx
import { MagneticButton } from "@/components/ijo/magnetic-button";

<MagneticButton strength={0.35} onClick={addToCart}>
  Order a bag
</MagneticButton>;
```

## Accessibility and performance

A real `<button>`, so keyboard, focus and screen readers work as normal; keyboard
users simply don't see the pull. Only `transform` changes. Keep `strength` moderate:
the further the button moves, the further a click target drifts from where the eye
expects it.
