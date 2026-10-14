# Third-party code and licenses

Everything Ijó ships is written from scratch. This file records what we depend on,
what we reused, and anything in a licence that could affect a free component library.

## Dependencies

| Package | Licence | How we use it |
| --- | --- | --- |
| `gsap`, `@gsap/react` | GSAP Standard "No Charge" License (Webflow) | Imported by every component. Never vendored or redistributed — the user installs it. |
| `next`, `react`, `react-dom` | MIT | The site. |
| `tailwindcss`, `@tailwindcss/postcss` | MIT | Styling, driven by `design/tokens.json`. |
| `lucide-react` | ISC | Icons, 1.5px stroke, `currentColor`. |
| `shadcn` | MIT | Builds `apps/web/public/r/*.json` from `packages/registry/registry.json`. |
| `@shikijs/rehype`, `shiki` | MIT | Build-time syntax highlighting in the docs. No highlighter ships to the browser. |
| `@next/mdx`, `@mdx-js/*`, `remark-gfm` | MIT | Docs pages. |
| `@playwright/test` | Apache-2.0 | Tests. |
| `turbo` | MIT | Task runner. |

## Reused source

| Source | Licence | What we took |
| --- | --- | --- |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | MIT | The official GSAP agent skills, copied verbatim into `.claude/skills/`. Guidance for writing the components; none of it ships. |

Nothing else has been copied. In particular:

- **Annnimate** — studied only as a user, through its public pages. No code, markup,
  copy, component names, thumbnails or page layouts were taken. Our component names,
  prop names, demo content and visual design are our own.
- **RareUI** — MIT **plus Commons Clause**, which forbids redistribution and porting
  to other frameworks. We took no code. We did borrow the *idea* of its component-page
  ordering and of `data-slot` styling hooks, both of which are common patterns (shadcn
  and Radix use `data-slot` too). Ideas are not covered by copyright; its code is, and
  we have none of it.
- **Beautiful UI** — MIT. We have not adapted any of its files yet. If we ever do,
  the file and its attribution go in the table above before the code lands.
- **React Bits / Vue Bits** — not used, and not read while writing components.

## GSAP licence: what to watch

The GSAP Standard License (effective 30 April 2025) makes all of GSAP, including the
formerly members-only plugins, free for commercial use. Three clauses matter to us:

1. **Prohibited Uses.** The licence forbids using GSAP in "tools that allow users to
   build visual animations without code" that compete with Webflow's visual animation
   builder. Ijó is a code library: the customize panel changes the props of a component
   you then copy as source, and there is no canvas, no timeline editor and no way to
   produce an animation without code. We read that as a Permitted Use, and the licence
   FAQ explicitly encourages visual tools that do not compete with Webflow's builder.
   **Before the Phase 2 launch we should email GSAP and get that in writing**, because
   the line is drawn by them, not by us, and a written answer costs nothing.
2. **No redistribution of GSAP itself.** We must never vendor GSAP source into a
   registry item or a bundled build. Components import it; the user installs it. The
   HTML variants load it from a CDN and say so.
3. **Amendments.** Webflow may revise the licence at any time, and use of later
   versions means accepting the revision. Versions released before a revision stay
   under the terms in force then. We therefore pin an exact GSAP version in every
   component's dependency list rather than a range.

Nothing in the licence restricts us from being free, open source, or MIT-licensed.
