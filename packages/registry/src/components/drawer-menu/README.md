# Drawer Menu

A menu button that slides a drawer in from the side, its links following one after another.

## Dependencies

`gsap`, and `@gsap/react` for the React variant. No GSAP plugins.

## How it behaves

The trigger opens a drawer that slides in from `side` over `duration` while a backdrop
fades in, then the links in each `DrawerMenuItem` follow, offset by `stagger`. Closing
plays the same timeline backwards a little faster, so closing half-way through an open
reverses smoothly from where it is.

Escape, a click on the backdrop and the close button all close it. Focus moves into
the drawer on open, Tab and Shift+Tab stay inside while it's open, and focus returns
to the trigger on close. While closed, the drawer is hidden with `visibility`, so
nothing in it can be tabbed to or read out.

The drawer is `position: fixed` and covers the viewport. Put it inside an element with
a `transform` if you want it contained in a box. Style it with `panelClassName` and
`triggerClassName`, or target the `data-slot` attributes.

Under `prefers-reduced-motion: reduce` the drawer and its links fade in place.

## Props

| Prop               | Type                | Default      | When you'd use it                                                |
| ------------------ | ------------------- | ------------ | ---------------------------------------------------------------- |
| `duration`         | `number`            | `0.55`       | Navigation should feel quick: 0.4–0.6s.                          |
| `side`             | `"left" \| "right"` | `"right"`    | Match the edge your menu button sits on.                         |
| `stagger`          | `number`            | `0.05`       | Small values read as one sweep; past 0.1s the last link is late. |
| `ease`             | `string`            | `"expo.out"` | `expo.out` glides to a stop, like a drawer on runners.           |
| `label`            | `string`            | `"Menu"`     | The button text and the drawer's accessible name.                |
| `closeLabel`       | `string`            | `"Close"`    | The close button's text.                                         |
| `panelClassName`   | `string`            | —            | Background, padding and width of the drawer.                     |
| `triggerClassName` | `string`            | —            | Styles for the menu button.                                      |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/drawer-menu.json
```

## Usage

```tsx
import { DrawerMenu, DrawerMenuItem } from "@/components/ijo/drawer-menu";

<DrawerMenu side="right" panelClassName="bg-neutral-900 p-6">
  <DrawerMenuItem>
    <a href="/shop">Shop</a>
  </DrawerMenuItem>
  <DrawerMenuItem>
    <a href="/roasts">Our roasts</a>
  </DrawerMenuItem>
</DrawerMenu>;
```

## Accessibility and performance

The drawer is a labelled modal dialog with a focus trap, Escape to close and focus
return, and `aria-expanded` on the trigger. Only `transform` and `opacity` animate.
