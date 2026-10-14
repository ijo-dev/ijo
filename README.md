# Ijó

Free, open motion components for the web — React, Vue and plain HTML, built on GSAP
and engineered to stay fast on mid-range Android phones.

MIT licensed. No accounts, no paywall.

## Repository

```
apps/web            the site: library, component pages, docs
packages/registry   component source — the single source of truth
packages/tokens     generates tokens.css and theme.css from design/tokens.json
packages/mcp        MCP server for coding agents (Phase 4)
design/             the design system: tokens.json, DESIGN.md, reference styles
```

## Getting set up

Requires Node 20.11+ and pnpm 10.

```bash
pnpm install
pnpm build
pnpm --filter @ijo/web dev
```

The site runs at http://localhost:3100.

## Day to day

```bash
pnpm build       # tokens → registry → site, in that order
pnpm lint
pnpm typecheck
pnpm test        # Playwright, desktop and mobile, against a production build
```

`pnpm build` regenerates `packages/registry/src/generated/sources.ts`,
`packages/registry/registry.json` and `apps/web/public/r/*.json`. The first two are
committed; CI fails if they drift from the component source.

## Adding a component

Create `packages/registry/src/components/<slug>/` with:

| File | What it is |
| --- | --- |
| `component.tsx` | The React implementation. Animations inside `useGSAP` with a `scope` ref. |
| `component.vue` | The Vue variant: `onMounted` + `gsap.context()`, reverted on unmount. |
| `component.html` | A self-contained plain-HTML snippet. |
| `controls.ts` | The customize schema. Every key is a prop of the same name. |
| `meta.json` | Name, title, category, description, how it behaves, dependencies. |
| `demo.tsx` | The preview, set in the Bọ̀ Coffee demo world. |
| `README.md` | Description, behaviour, props, install, usage. |
| `smoke.spec.ts` | A Playwright smoke test, including reduced motion. |

Then export it from `packages/registry/src/index.ts` and run `pnpm build`. The page,
the card, the props table, the three code tabs and the shadcn registry item all
follow from those files.

Every component must honour `prefers-reduced-motion`, revert cleanly under React
StrictMode, animate `transform` and `opacity` only unless it documents why, and stay
under 3 KB gzipped. The build enforces the last one.

## Licences

Ijó is MIT. GSAP is free for commercial use under Webflow's standard licence, and we
never redistribute it. See [THIRD_PARTY.md](THIRD_PARTY.md) for the full picture, and
[DECISIONS.md](DECISIONS.md) for why things are the way they are.
