# Rise In

Lifts a stack of elements into place, one after another, as the page settles.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

Each direct child wrapped in `RiseInItem` starts `distance` pixels below its resting
place at zero opacity and travels up to it over `duration`, offset from the child
before it by `stagger`. The group reads as one gesture rather than a row of separate
arrivals.

Animations are created inside `useGSAP` with the wrapper as `scope`, so React
StrictMode's double mount and any unmount revert cleanly, and nothing runs on the
server. `clearProps` hands the inline styles back once the reveal finishes, so your
own CSS owns the element afterwards. With no wrapped children the component renders
its wrapper and does nothing.

Under `prefers-reduced-motion: reduce`, travel and stagger both drop to zero and the
children cross-fade over 0.2s. The finished layout is identical either way.

## Props

| Prop | Type | Default | When you'd use it |
| --- | --- | --- | --- |
| `duration` | `number` | `0.9` | Raise it for large hero text, lower it for list rows that shouldn't hold the reader up. |
| `distance` | `number` | `24` | How far a child starts below its place. Keep it under the line height, or the reveal reads as a jump rather than a settle. |
| `stagger` | `number` | `0.06` | The gap between children. Around 0.06s reads as one gesture; past 0.2s the items feel unrelated. |
| `ease` | `string` | `"expo.out"` | `expo.out` arrives fast and settles, which suits text; `power2.out` is gentler for images and cards. |
| `delay` | `number` | `0` | A pause before the first child moves, to let a page transition or image finish first. |
| `staggered` | `boolean` | `true` | Turn off to reveal every child at once, when the group is one idea such as a price and its currency. |

## Install

```bash
npx shadcn@latest add https://ijo.dev/r/rise-in.json
```

## Usage

```tsx
import { RiseIn, RiseInItem } from "@/components/ijo/rise-in";

<RiseIn duration={0.9} stagger={0.06}>
  <RiseInItem><h1>Ìjẹ̀bú dark roast</h1></RiseInItem>
  <RiseInItem><p>₦7,200 a bag</p></RiseInItem>
</RiseIn>;
```

## Accessibility and performance

Animates `transform` and `opacity` only, so every frame stays off the layout and
paint path. The wrapper adds no semantics: heading levels, landmarks and reading
order are whatever you put inside it. Nothing here is focusable, so there is no
focus order to manage.
