# Image Reveal Mask

Uncovers an image with a sliding mask as it scrolls into view, while the image settles
from a slight zoom.

## Dependencies

`gsap` and its `ScrollTrigger` plugin (free, included in the `gsap` package), and
`@gsap/react` for the React variant.

## How it behaves

The frame starts fully masked. When its top reaches `start` in the viewport, the mask
opens in `direction` over `duration` while the image eases down from `zoom` to its
natural size, so the picture seems to arrive from slightly closer.

The mask is a `clip-path` inset rather than a transform, because the frame has to keep
its size in the layout while only its visible area grows; the zoom is a transform. It
plays once and then leaves the image as authored. The frame clips its contents, so
give the child a width and height (for example `width: 100%` and `object-fit: cover`).
Pass `scroller` when the image lives inside its own scrolling box.

Under `prefers-reduced-motion: reduce` there is no mask or zoom; the image fades in
over 0.3s.

## Props

| Prop        | Type                                  | Default        | When you'd use it                                                    |
| ----------- | ------------------------------------- | -------------- | -------------------------------------------------------------------- |
| `duration`  | `number`                              | `1.2`          | Hero images can take 1.5s; thumbnails in a grid want 0.6s or less.   |
| `direction` | `"up" \| "down" \| "left" \| "right"` | `"up"`         | Up mirrors rising text; left and right suit images in a row.         |
| `zoom`      | `number`                              | `1.25`         | 1.2 adds depth; 1 turns the zoom off.                                |
| `ease`      | `string`                              | `"expo.inOut"` | `expo.inOut` is a curtain pulled; `power3.out` opens fast and slows. |
| `start`     | `string`                              | `"top 85%"`    | How far into the viewport the image's top must reach first.          |
| `scroller`  | `RefObject<HTMLElement>`              | the page       | The box that scrolls, when the image isn't on the page itself.       |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/image-reveal.json
```

## Usage

```tsx
import { ImageReveal } from "@/components/ijo/image-reveal";

<ImageReveal direction="up" className="aspect-[3/2] w-full">
  <img src="/roastery.avif" alt="The roastery in Yaba" className="h-full w-full object-cover" />
</ImageReveal>;
```

## Accessibility and performance

The image is in the document from the start, with its `alt` text, so nothing is hidden
from screen readers. `clip-path` inset animations are composited in current Chrome and
Safari; on older Android WebViews they repaint, which is why the reveal plays once
rather than on every scroll. Serve the image itself small (AVIF, sized to its slot) —
the mask can't make a heavy download feel fast.
