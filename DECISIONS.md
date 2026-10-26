# Decisions

Each entry: what we decided, why, and when. Newest last.

## 2026-10-14 — Project name stays "Ijó"

Yoruba for "dance". Short, says what the library does, and roots it in West Africa
without being decorative about it. `ijo.dev`, `ijo.design` and `getijo.com` were all
unregistered when we checked.

## 2026-10-14 — Packages publish under the `@ijo` npm scope

The bare name `ijo` is already taken on npm by an unrelated package. A scope keeps
`@ijo/registry`, `@ijo/mcp`, `@ijo/vue` and `@ijo/html` tidy and reserves the family
in one go. Needs the free `ijo` npm organisation created before the first publish.

## 2026-10-14 — MIT, plain

No Commons Clause, no attribution requirement. The point of the project is that a
studio in Lagos or Nairobi can use this without a conversation about money or credit.
The cost is that anyone may fork or resell it; we accept that.

## 2026-10-14 — Vercel, with everything statically generated

Zero-config for the App Router and a free tier that covers us. Every route is
prerendered (`generateStaticParams` for component pages), so nothing depends on a
Vercel runtime feature and moving to Cloudflare Pages later is a config change, not
a rewrite. Preview videos go to Cloudflare R2 when Phase 2 adds them.

## 2026-10-14 — GitHub org `ijo-dev`, repo `ijo`

An org from day one reads as a project rather than a personal side repo, and
maintainers can be added later without transferring and breaking URLs.

## 2026-10-14 — `design/tokens.json` is the only place a colour or size is written

`packages/tokens` generates two stylesheets from it: `tokens.css` (plain `:root`
custom properties, for the HTML component variants and anything outside Tailwind)
and `theme.css` (the same values in Tailwind v4 `@theme` namespaces, so they become
utilities). Neither file is edited by hand. Tailwind's numeric spacing scale is
derived from a single `--spacing: 4px`, so `p-4` is 16px (`space-4`) and `p-6` is
24px (`space-5`); the named `--space-*` properties remain for plain CSS.

## 2026-10-14 — The registry is the single source of truth, and the code tabs read it

`packages/registry/scripts/build.mjs` reads each component folder and writes
`src/generated/sources.ts` (the real file text for the React/Vue/HTML tabs, plus the
gzipped size) and `registry.json`, which `shadcn build` turns into
`apps/web/public/r/<name>.json`. CI fails if the generated files differ from what is
committed, so the code a visitor copies cannot drift from what `npx shadcn add`
installs. The build also fails if a component exceeds the 3 KB gzipped budget.

## 2026-10-14 — The customize panel is generated from a `controls` schema

Each component ships `controls.ts` where every key is a prop of the same name. The
panel, the props table and the live code snippet are all built from that one object,
so a new component needs no bespoke page code. The snippet generator is generic
across React, Vue and HTML.

## 2026-10-14 — `rise-in` is the Phase 1 placeholder

A real, shippable component (mount-time reveal with stagger) chosen to prove the
whole pipeline: source → controls → page → three code tabs → `npx shadcn add`. It
deliberately does not duplicate anything on the Phase 2 list, though Phase 2's
"Scroll Reveal Stagger" will share its internals once ScrollTrigger lands.

## 2026-10-14 — Library cards render a still first frame, not an AVIF poster, for now

The brief calls for AVIF posters and ≤300 KB preview videos. We have no video
pipeline yet, and shipping placeholder art would be worse than none. Until Phase 2
builds the pipeline, a card renders its real demo with the animation at rest and
plays it on hover, focus, or on first scroll into view on touch screens. Nothing
plays off-screen either way.

## 2026-10-14 — Tests run against a production build on their own port

Playwright builds the site and starts it on 3101 rather than reusing a dev server.
The dev client's HMR socket makes hydration unreliable under automation, and
production is what we ship.

## 2026-10-14 — The public origin is resolved from the deploy, not hardcoded

`next.config.ts` resolves `NEXT_PUBLIC_SITE_URL`, falling back to Vercel's own
production URL and then to `http://localhost:3100`. Nothing prints `https://ijo.dev`
until that domain is registered and the environment variable is set, so the install
command a visitor copies always points at a host that actually serves the registry.

## 2026-10-14 — The domain is deferred; we stay on the Vercel URL for now

`ijo.dev` is unregistered but sits in the registry's premium tier: $97.68 a year,
and premium renewals stay premium — against $12.87 for a standard `.dev`. Every
short `ijo.*` is priced the same way (`ijo.design` $109.69, `ijo.pro` $108.60).

We are not paying that before the library has anything in it. The site stays on its
Vercel production URL through Phase 2 and we decide again before launch, with
Porkbun as the registrar when we do — it sells premium `.dev`, includes WHOIS
privacy, and quoted these prices.

Nothing is blocked by this. `next.config.ts` resolves the origin at build time and
`packages/registry/scripts/build.mjs` does the same for `registry.json`, so adopting
a domain later means registering it, adding it to the Vercel project, and setting
`NEXT_PUBLIC_SITE_URL` — no code change. The two places that cannot be resolved at
build time, because they are plain Markdown read on GitHub, are each component's
`README.md` install line and this file.

The cost of waiting is that any install command published in the meantime carries
the Vercel host, so hold off on publicising the registry URL until the domain is
settled.

## 2026-10-20 — Phase 2: twelve components, set in one demo world

Text Reveal, Word Roller, Scramble Text, Magnetic Button, Jiggly Button, Scroll Reveal
Stagger, Pinned Horizontal Scroll, Image Reveal Mask, Marquee, Accordion, Card Stack and
Drawer Menu. Every demo is Bọ̀ Coffee in Lagos, as the taste rules ask. The largest is
Drawer Menu at about 2.2 KB gzipped, well inside the 3 KB budget.

## 2026-10-20 — A component may take its children without an Item wrapper

`Meta.item` names the wrapper the snippet builder puts around each child. It defaults to
`${export}Item`; `null` means the children go straight inside, which is what a button,
a single heading or a single image wants.

## 2026-10-20 — Scroll components take the scrolling element, not a ref to it

`scroller` on ScrollReveal, PinnedScroll and ImageReveal is `HTMLElement | null`. React
attaches a parent's refs only after its children's layout effects have run, so a
`RefObject` handed down from the parent is still empty when the child builds its
ScrollTrigger, and the trigger silently falls back to the page. An element kept in state
by a callback ref re-renders the child once it exists. `null` means "asked for, not
mounted yet" and sets nothing up; leaving the prop out means the page.

## 2026-10-20 — Height and clip-path are animated where the effect needs them

Accordion animates `height`, because the content below has to move to make room.
Image Reveal Mask animates `clip-path`, because the frame has to keep its size while
only its visible area grows. Both are documented on their pages; every other component
animates `transform` and `opacity` only.

## 2026-10-20 — Pull requests until CI can run locally

This session's network blocks the npm registry, so nothing can be installed or built
locally. Work goes to a branch, a pull request runs the full CI (build, lint, typecheck,
Playwright on desktop and a Pixel 5), and only a green run is merged to `main`.

## 2026-10-20 — The site is set in JetBrains Mono; demos keep Schibsted Grotesk

Asked for after studying ThreeUI, whose chrome is all monospace. Mono gives the site a
firmer, more technical frame. The demos show a fictional brand, so inside the preview
stage the type switches back to Schibsted Grotesk and they still read as real products.
Ligatures are off in interface text. Search moved to a ⌘K window with still previews,
loaded only on first open so no page pays for it up front.

## 2026-10-26 — Search is a compact grouped list

Studied ElevenLabs, Vercel, Supabase and Mintlify on Mobbin. Real command menus are
narrow lists, not preview grids. Search is now a 620px list grouped by category, with
filter chips (Tab cycles them), highlighted matches, docs pages and an empty state. No
live previews inside, so it opens instantly on slow data.

## 2026-10-26 — Darker canvas

Asked for after studying Fey: the canvas was a grey-purple (#17161b) that dulled the
purple. It is now near-black with a faint violet tint (#0b0a0e), and each surface steps
up by a small amount. Contrast went up everywhere (text-faint now passes on surface-4).
