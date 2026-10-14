Ijó (Yoruba for "dance") is a free, open motion-component library for builders across Africa. The site is dark-first, quiet and fast: the components are the colour, the chrome stays out of the way. Purple is the brand; everything else is a tinted neutral.

## Principles

1. **The demo is the hero.** Every page leads with a live, interactive preview. Chrome (nav, cards, panels) uses neutrals so the motion reads first.
2. **Light on the wire.** Most visitors are on mobile data. Previews are AVIF posters until tapped or scrolled into view; no autoplay video over 300 KB; two font families, latin subset, `font-display: swap`.
3. **Calm by default, playful on purpose.** Site UI moves fast and small (`duration-fast`, `ease-out`). Big motion belongs to the components being showcased.
4. **Respect the reader.** Every animation honours `prefers-reduced-motion`; every colour pair here meets WCAG AA in the dark theme.

## Voice and copy

- Plain, direct, a little warm. Second person ("you"), sentence case everywhere, including buttons and headings.
- Lead with the outcome, not the tech: "Give any site award-level motion" beats "GSAP-powered animation framework".
- Name things by what they do: "Circular Slider", "Word Roller", "Ink Bloom".
- Free means free: never "free trial", never a card form. Say "Free, MIT licensed" once, near the top.
- No emoji in UI. Numbers as numerals ("118 components", "0.9s").

## Colour

- Canvas is `bg`, a soft purple-charcoal rather than black. Step up for elevation: `surface-1` bands → `surface-2` cards → `surface-3` raised/inputs → `surface-4` overlays → `surface-5` pressed. Lighter means higher; do not use shadows for ordinary depth.
- Text: `text` for headings and body, `text-muted` for secondary copy, `text-faint` only for captions on `bg` through `surface-3`.
- Purple: `primary` (grape-9) is the one solid call to action per view, with `on-primary` text. `primary-text` (grape-11) for links and purple icons. `grape-5` is the deep plum for large brand blocks (CTA band, hero stage) with `text` or `grape-12` on it. `grape-3`/`grape-7` for selected chips and filters.
- Edges: cards, demo stages, code blocks and panels get `ring-hairline` (a 1px light ring), not a border. `border` (3:1) is only for form-field outlines; `border-subtle` for dividers.
- Tints: callouts and diff lines sit on `success-tint`, `danger-tint`, `warning-tint` or `primary-tint` with the matching solid colour for text.
- Signals: `success`, `warning`, `danger`, `info` as text/icons on any surface, or as solid fills with `on-signal` text. Always pair a signal with a word or icon; success and danger are not distinguishable by lightness alone.
- `ember` is the warm counter-accent (a nod to West African ochre and kente oranges). One ember element per view at most: the "New" or "Free" badge.
- Never: blue-to-purple gradients, neon glows on text, pure black (#000) or pure white (#fff) grounds. The single permitted glow is `shadow-glow` on the primary CTA hover.

## Type

- One family does everything: Schibsted Grotesk (Google Fonts, weights 400/500/600). JetBrains Mono (400/500) for code and live values.
- Hero: `display-xl` (drop to `display` under 640px). Sections: `h1`. Cards: `h3`. Copy: `body-lg` for leads, `body` for prose, `small` for UI.
- `caption` is the only style that may be uppercase. `numeric` uses tabular figures (`font-variant-numeric: tabular-nums`) so slider values don't jitter.
- Line length: 60ch for leads, 70ch for prose.

## Space, radius, layout

- 4px grid. Page gutter `space-4` on mobile, `space-6` on desktop. Sections `space-8` (mobile) / `space-9` (desktop) top and bottom.
- Content max-width 1200px; docs prose 720px.
- Component grid: 1 column under 640px, 2 to 1024px, 3 above; gap `space-5`.
- Radii stay small and quiet: `radius-md` (8px) for controls, `radius-sm` for tabs and nav items, `radius-lg` (14px) for cards and stages, `radius-xl` only for modals and the home hero, `radius-full` for pills and thumbs.

## Page layout

- Library and docs: a fixed left sidebar (240px, `surface-1`) with the component list as plain text links (`small`, `text-muted`; active item on `surface-3`, `radius-sm`), and a scrolling main column.
- The main column is a stack of numbered sections: a `SectionHeader` line (number in `text-faint` mono, title in `text`, one-line description in `text-faint`), then the live demo on a `surface-2` stage with `ring-hairline` and `radius-lg`. Variant switches sit as a small segmented control centred at the bottom of the stage.
- App UI text runs at 14px (`small`); docs prose at 16px (`body`).

## Motion (for the site itself)

- Hover/press colour: `duration-instant`. Small UI: `duration-fast` + `ease-out`. Menus/tabs: `duration-base`. Modals and page transitions: `duration-slow`. Scroll reveals: `duration-reveal`, staggered 60ms, travel no more than 24px.
- Exits are faster than entrances. Never animate layout properties on the site chrome; transform and opacity only.
- Under `prefers-reduced-motion: reduce`: cross-fade only, no travel, no parallax, previews show their poster and a "Play" button.

## Focus and states

- Focus: 2px solid `focus-ring` with 2px offset on every interactive element, via `:focus-visible`. It reads at 8:1 or better on every surface.
- Hover lifts a surface one step (e.g. `surface-2` → `surface-3`). Pressed goes one further (`surface-5`). Disabled: 40% opacity, no pointer.

## Iconography

- Lucide (MIT), 1.5px stroke, 16px in UI and 20px in nav, `currentColor`. No filled or duotone icons, no emoji.
- No logo has been designed yet: set the wordmark "Ijó" in Schibsted Grotesk 600 until one exists.

## Components

Button, Badge, Input, SectionHeader, ComponentCard (the library tile), CodeBlock (React / Vue / HTML tabs with copy), ControlSlider (the live "customize" control). Each has a preview and a README with what it takes and when to use it.
