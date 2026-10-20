# Text Reveal

Slides a heading or paragraph up from behind a mask, one line, word or letter at a time.

## Dependencies

`gsap` and its `SplitText` plugin (free, included in the `gsap` package), and
`@gsap/react` for the React variant.

## How it behaves

SplitText breaks the text into lines, words or letters and wraps each in a clipping
mask. Each unit rises from just below its mask into place, offset from the one before
by `stagger`.

When splitting by lines, the text is re-split whenever fonts finish loading or the
box changes width, so a line never breaks in the wrong place on a phone. Inline
markup such as `<em>` survives the split, and screen readers hear the original
sentence rather than the fragments. The split is undone when the component unmounts
or a prop changes, leaving your markup exactly as authored.

Under `prefers-reduced-motion: reduce` nothing is split and the whole block fades in
over 0.2s.

## Props

| Prop       | Type                            | Default      | When you'd use it                                                                            |
| ---------- | ------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `as`       | `string`                        | `"p"`        | Render the right element, so a heading stays a heading.                                      |
| `split`    | `"lines" \| "words" \| "chars"` | `"lines"`    | Lines for headings and paragraphs, words for short taglines, letters only for a word or two. |
| `duration` | `number`                        | `0.8`        | How long each unit takes to rise. Shorten it when splitting by letters.                      |
| `stagger`  | `number`                        | `0.08`       | The gap between units. Lines want about 0.08s; letters 0.02s or less.                        |
| `ease`     | `string`                        | `"expo.out"` | `expo.out` arrives fast and settles softly; `power3.out` is calmer.                          |
| `delay`    | `number`                        | `0`          | A pause before the first unit moves.                                                         |

## Install

```bash
npx shadcn@latest add https://ijo-flame.vercel.app/r/text-reveal.json
```

## Usage

```tsx
import { TextReveal } from "@/components/ijo/text-reveal";

<TextReveal as="h2" split="lines">
  Roasted in Yaba on Tuesday, in your cup by Thursday.
</TextReveal>;
```

## Accessibility and performance

Animates `transform` only; the masks clip with `overflow`, so nothing triggers layout
during the reveal. SplitText's default `aria` handling labels the element with its full
text and hides the fragments, so assistive tech reads one sentence, not a list of words.
