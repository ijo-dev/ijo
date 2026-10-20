# Accordion

Sections that open and close smoothly, built on the browser's own `<details>` element.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

Each `AccordionItem` is a native `<details>` element with your `<summary>` as its
heading, so it opens with the keyboard, works before JavaScript has loaded, and is
found by in-page search.

When the summary is clicked or activated with Enter or Space, the item's height
animates from its current size to its open or closed size over `duration`. Clicking
again mid-animation reverses smoothly from wherever it is. With `single` on, opening
one section closes any other that is open. Each item carries `data-state="open"` or
`"closed"`, so you can rotate an icon or restyle the heading from CSS alone.

Under `prefers-reduced-motion: reduce` sections open and close instantly.

## Props

| Prop       | Type      | Default          | When you'd use it                                        |
| ---------- | --------- | ---------------- | -------------------------------------------------------- |
| `duration` | `number`  | `0.45`           | About 0.4s feels responsive; long answers can take 0.6s. |
| `ease`     | `string`  | `"power3.inOut"` | `expo.out` snaps open and settles, which feels quicker.  |
| `single`   | `boolean` | `false`          | One open at a time. Good for long FAQs on a phone.       |

`AccordionItem` takes `defaultOpen` to start a section open.

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/accordion.json
```

## Usage

```tsx
import { Accordion, AccordionItem } from "@/components/ijo/accordion";

<Accordion single>
  <AccordionItem defaultOpen>
    <summary>Do you deliver outside Lagos?</summary>
    <p>Yes, to every state, in 2–4 working days.</p>
  </AccordionItem>
</Accordion>;
```

## Accessibility and performance

`<details>` and `<summary>` give you the disclosure role, the expanded state and
keyboard support for free. Height is animated deliberately, because the content below
must move to make room; a transform can't do that. It is one element and one property
for under half a second, and the inline height is cleared afterwards so the section can
still grow with its content.
