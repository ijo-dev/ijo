# Build brief: Ijó — a free, open motion-component library for Africa

> Paste this into Claude Code at the root of an empty repo (or save it as `CLAUDE.md`). Work through it phase by phase; stop at the end of each phase, show me what you built, and wait for my go-ahead.

## 1. What we're building and why

Ijó (working name, Yoruba for "dance") is a free, open-source library of production-quality web animation components for React, Vue and plain HTML, plus the website that showcases them.

It is inspired by **Annnimate** (annnimate.com), a paid library (from €87/quarter) of 118 GSAP components with live previews, a "customize" panel, copy-paste code in three frameworks, and an MCP server for AI coding agents. That price is out of reach for most developers and studios in Africa. Our version is free, MIT-licensed, and engineered for low-bandwidth, mid-range Android phones.

We match the **product experience** (what a user can do), not Annnimate's code, visuals, copy or component names.

## 2. Clean-room rules (non-negotiable)

- Do **not** copy, download, decompile or paraphrase Annnimate's source code, videos, thumbnails, text, component names or page layouts. Study only its public, user-visible behaviour and write everything from scratch.
- Open-source code may be used only when its license allows it. Before reusing any file, record the source and license in `THIRD_PARTY.md`:
  - **GSAP** (incl. ScrollTrigger, SplitText, Flip, MorphSVG, Draggable): free for commercial use since April 2025. Read `gsap.com/standard-license` and flag to me anything that could affect a free component library before Phase 2 ships.
  - **Magic UI, shadcn/ui, Radix**: MIT, reusable with attribution.
  - **React Bits / Vue Bits**: check the current LICENSE; if it restricts redistribution as a competing library, use it as reference only, never as source.
- Every component we ship is our own implementation.

## 3. The product (feature parity target)

1. **Library page**: grid of components with poster, name, category, gzipped size, "New" badge; filters (Buttons, Text, Scroll, UI, Menus, Sections, Backgrounds, Shaders) and search.
2. **Component page**: a live, interactive preview; a **customize panel** of sliders/selects where every control maps 1:1 to a prop (duration, ease, distance, stagger, autoplay…); a code block with **React / Vue / HTML** tabs that updates as the sliders move; a copy button; an install command; a props table; notes on accessibility and performance.
3. **Distribution**: `npx shadcn add https://ijo.dev/r/<name>.json` (a shadcn-compatible registry built with `shadcn build`), plus plain copy-paste.
4. **MCP server** so Claude Code, Cursor and other agents can search the library and pull a component's real source.
5. **Docs**: getting started (Next.js App Router, Vite, Nuxt, plain HTML), GSAP basics, easing, ScrollTrigger, reduced motion, performance.
6. **Showcase** of sites built with Ijó, and a **changelog** ("a new component every week").
7. No accounts, no paywall. Optional: newsletter, GitHub Sponsors / Paystack donation link.
8. **"Copy prompt" button** on every component (idea from 21st.dev): a ready-made prompt that tells an AI agent exactly how to install and wire the component into the user's project, next to the normal code copy.

## 4. Stack

- **Monorepo** (pnpm workspaces + Turborepo): `apps/web` (site), `packages/registry` (component source, the single source of truth), `packages/mcp` (MCP server), `packages/vue` and `packages/html` (generated or hand-ported variants).
- **Site**: Next.js (App Router) + TypeScript, Tailwind v4 with our design tokens, MDX for docs, Shiki for highlighting (build-time, no client highlighter).
- **Motion**: `gsap` + `@gsap/react` (`useGSAP`) for React, `onMounted` + `gsap.context()` for Vue, Lenis only where a component needs smooth scroll.
- **Hosting (free tiers)**: Vercel or Cloudflare Pages for the site; Cloudflare R2 for preview videos.
- Before writing GSAP code, install the official GSAP agent skills (`greensock/gsap-skills`: gsap-core, gsap-react, gsap-scrolltrigger, gsap-plugins) and follow them.

## 5. Component quality bar (every component, no exceptions)

- Animations created inside `useGSAP` / `gsap.context()` with a `scope` ref and fully reverted on unmount. No leaks under React StrictMode; safe with SSR (no GSAP calls on the server).
- Honours `prefers-reduced-motion`: a reduced variant (fade or instant), never a broken layout.
- Every timing, ease and distance is a typed prop with a sensible default; those props drive the customize panel automatically (define a `controls` schema next to each component).
- Animates `transform` and `opacity` only, unless the effect requires otherwise (document why).
- Keyboard and screen-reader usable where interactive; visible focus ring.
- Size budget: under 3 KB gzipped excluding GSAP; size shown on the card.
- Each component folder: `component.tsx`, `component.vue`, `component.html`, `controls.ts`, `meta.json` (name, category, tags, plugins used, size), `README.md`, and a Playwright smoke test.

## 6. Built for African networks and devices

- Target: Lighthouse mobile ≥ 90 on a throttled "Slow 4G" Moto G-class profile.
- Library cards show an **AVIF poster**; the preview video loads only on hover or when 50% in view, and never when `Save-Data` or `prefers-reduced-data` is on.
- Videos ≤ 300 KB, 480p, WebM + MP4. Fonts: two families, latin subset, `font-display: swap`.
- Live previews mount lazily (`IntersectionObserver`) and pause off-screen.
- Static generation for every page; no client JS beyond what the page needs.

## 7. Design

Use the **Ijó design system** (dark-only, purple-led): `design/tokens.json` (every token with its usage), `design/DESIGN.md` (the rules) and `design/reference-components.css` (reference styles for Button, Badge, Input, SectionHeader, ComponentCard, CodeBlock, ControlSlider). Load its tokens into Tailwind v4 `@theme` and CSS variables; do not invent colours or sizes.

- Canvas `#17161b`, a soft purple-charcoal (not black); surfaces step up lighter for elevation (`surface-1` `#1c1b20` → `surface-5` `#33313a`); no shadows for ordinary depth.
- Edges are 1px light rings (`box-shadow: 0 0 0 1px rgba(255,255,255,.08)`), not borders. Form fields use the `#767482` control border (3:1).
- Primary `#7a40da` (hover `#8755e6`) with white text, one primary CTA per view; purple text/links/focus ring `#c3aeff`; deep plum `#3d206f` for large brand blocks; warm accent `#ffa460`, max one per view. Callouts and diff lines use 14% tints of the signal colours.
- Text `#f3f3f6` / muted `#bebcc5` / faint `#93909c`.
- Type: Schibsted Grotesk (400/500/600) and JetBrains Mono. App UI at 14px, docs prose at 16px. 4px spacing grid; radii 4 / 6 / 8 / 14 / 22 / full (8px is the default).
- Layout: fixed left sidebar of plain text links + a main column of numbered demo sections (see Taste rules).
- Feel: simple, clean, quiet, the component demos are the colour. No gradients, no emoji, no glows except on the primary CTA hover.

### Taste rules: no AI slop

These come from studying Beautiful UI, AICSS, RareUI and 21st.dev. Follow them in every component and page.

- **One demo world.** All previews share one believable fictional brand (e.g. "Bọ̀ Coffee, Lagos": real-sounding product names, prices in ₦, real-length text). Never "Lorem ipsum", "John Doe", "Acme" or "Feature 1/2/3".
- **Show states, not just the happy path.** Each component's preview includes its loading, empty, error, hover, focus and reduced-motion states where they apply.
- **Motion must explain something.** Every animation answers "what changed, and where did it go?" No motion that only decorates.
- **Banned looks:** glassmorphism and "liquid glass" buttons, neumorphism, glowing gradient borders, blue-to-purple gradients, floating blurred blobs, sparkle/emoji decoration, rounded cards with a coloured left border, fake stats ("10x faster", "99.9%").
- **Restraint test:** if removing an effect doesn't make the component worse, remove it.
- **Real copy:** buttons say what they do ("Copy code", not "Get started 🚀"); sentence case; no hype words ("revolutionary", "next-gen", "seamless").
- **Page format** (from Beautiful UI): the library and home page show components as numbered sections (01, 02, …), each with a title, one plain sentence, and the live demo right there, not behind a click. Variants switch with a small segmented control at the bottom of the demo stage.
- **Component page format** (from RareUI): in this order: one-sentence description → dependencies list → "How it behaves" (a short paragraph on the interaction, including edge cases like clamping) → props table where every description says *when you'd use it*, not just its type → install command (npm/pnpm/yarn/bun tabs) → usage example. Every inner part carries a `data-slot` attribute and state attributes (`data-open`, `data-disabled`) so people can restyle with CSS alone.
- **Hover-to-play** library cards: a still poster by default, the motion plays on hover/focus or when scrolled into view on touch screens.
- **Fast first paint.** If the page shows a blur or blank screen while heavy demos load (21st.dev's home page did on our test), it's too heavy for African mobile data. Render text and posters first; demos hydrate after.

### What to reuse from those sites

| Site | What it is | Use it for | Don't |
|---|---|---|---|
| beautifului.dev | 21 MIT-licensed AI-app components by Turbo | Presentation format and demo-world idea; MIT code can be adapted with credit in `THIRD_PARTY.md` | Copy their ice-cream demo content or visual identity |
| aicss.dev | AI-agent chat UI; free parts MIT, Pro parts paid | Free MIT components only, as reference for a later "AI UI" category | Recreate or reverse-engineer Pro components |
| rareui.com | ~25 Motion-based React components, 1.7k GitHub stars; **MIT + Commons Clause**: no redistribution or porting to other frameworks, visible credit required | Its component-page structure, `data-slot` styling hooks, shadcn + MCP install flow, and funding model (Carbon ads) | Copy or port any of its code; its license forbids it |
| 21st.dev | Huge community registry, mixed quality, per-author terms | "Copy prompt" feature; their registry guides | Copy any component without checking its author's license |

## 8. Phases (stop after each)

1. **Foundation**: monorepo, design tokens, site shell (home, library grid, component page template, docs layout), the registry build, CI (lint, typecheck, Playwright). *Done when* the site deploys and one placeholder component flows from `packages/registry` to its page and to `npx shadcn add`.
2. **First 12 components**, across categories: Text Reveal (SplitText), Word Roller, Scramble Text, Magnetic Button, Jiggly Button, Scroll Reveal Stagger, Pinned Horizontal Scroll, Image Reveal Mask, Marquee, Accordion, Drawer Menu, Card Stack. *Done when* each meets section 5 and its customize panel works.
3. **Vue + HTML variants** for all 12, generated from shared logic where possible, and verified in a Nuxt and a plain-HTML test app.
4. **MCP server** (`search_components`, `get_component`, `list_categories`), published to npm, with setup docs for Claude Code and Cursor.
5. **Polish and launch**: docs, showcase, changelog, SEO/OG images, analytics (privacy-friendly, e.g. Plausible or Umami), README, CONTRIBUTING, license audit.

## 9. How to work

- Ask me before any choice that's expensive to undo (repo structure, licensing, public package names).
- Keep a running `DECISIONS.md` (decision, reason, date).
- After each component, run its tests and show me a screenshot or short GIF of the preview at 375px and 1440px.
- Commit small and often with clear messages.
