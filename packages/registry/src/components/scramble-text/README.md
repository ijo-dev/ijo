# Scramble Text

Shuffles a line of text through random characters until it settles on the real words.

## Dependencies

`gsap` and its `ScrambleTextPlugin` (free, included in the `gsap` package), and
`@gsap/react` for the React variant.

## How it behaves

On mount the visible text turns to random characters drawn from `chars`, then settles
letter by letter, left to right, until it reads the real text after `duration`
seconds. The text keeps its length throughout, so the line never reflows.

A visually hidden copy of the real text sits alongside, so screen readers announce the
words once and never the noise. With `replayOnHover` on, entering with the pointer or
focusing the element scrambles it again; a request made while a scramble is running is
ignored. Children must be a plain string.

Under `prefers-reduced-motion: reduce` nothing scrambles and the text fades in over
0.2s; hover replays are skipped.

## Props

| Prop            | Type      | Default    | When you'd use it                                                                     |
| --------------- | --------- | ---------- | ------------------------------------------------------------------------------------- |
| `duration`      | `number`  | `1.2`      | Short lines want about 1s; longer ones need more, or letters settle in a rush.        |
| `chars`         | `string`  | `"A–Z0–9"` | Capitals and digits suit codes; symbols read as a terminal; `"lowerCase"` is softest. |
| `revealDelay`   | `number`  | `0.3`      | Seconds of pure noise before the first real letter.                                   |
| `speed`         | `number`  | `0.6`      | How often random letters change. 1 and above flickers.                                |
| `replayOnHover` | `boolean` | `false`    | Scramble again on hover or focus. Good for buttons and nav labels.                    |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/scramble-text.json
```

## Usage

```tsx
import { ScrambleText } from "@/components/ijo/scramble-text";

<ScrambleText duration={1.2}>ORDER BC-2047 CONFIRMED</ScrambleText>;
```

## Accessibility and performance

The scramble changes text content, which is cheap for one line but does cause the line
to repaint each frame; keep it to labels and short headlines rather than paragraphs.
Use a monospaced font so the width holds perfectly still while letters change.
