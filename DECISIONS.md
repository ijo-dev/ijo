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
