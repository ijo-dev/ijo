/**
 * Generates the two stylesheets every surface of Ijó shares, from design/tokens.json:
 *
 *   dist/tokens.css  plain :root custom properties — used by the HTML component
 *                    variants and by anything outside the Tailwind pipeline.
 *   dist/theme.css   the same values restated in Tailwind v4 @theme namespaces so
 *                    they become utilities (bg-surface-2, text-display-xl, ...).
 *
 * design/tokens.json is the single source of truth; neither file is edited by hand.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const out = resolve(here, "../dist");

const tokens = JSON.parse(await readFile(resolve(root, "design/tokens.json"), "utf8"));

/** Resolve `{grape-9}` style aliases to their literal value. */
const colors = new Map(tokens.color.tokens.map((t) => [t.name, t.value]));
const deref = (value, seen = new Set()) => {
  const match = /^\{(.+)\}$/.exec(value);
  if (!match) return value;
  const key = match[1];
  if (seen.has(key)) throw new Error(`Circular token alias: ${key}`);
  if (!colors.has(key)) throw new Error(`Unknown token alias: ${key}`);
  return deref(colors.get(key), seen.add(key));
};

const lines = (xs) => xs.filter(Boolean).join("\n");
const section = (title, body) => `\n  /* ${title} */\n${body}`;

const colorVars = tokens.color.tokens.map((t) => `  --${t.name}: ${deref(t.value)};`);
const spaceVars = tokens.spacing.tokens.map((t) => `  --${t.name}: ${t.value};`);
const radiusVars = tokens.radius.tokens.map((t) => `  --${t.name}: ${t.value};`);
const shadowVars = tokens.shadow.tokens.map((t) => `  --${t.name}: ${t.value};`);
const durationVars = tokens.duration.tokens.map((t) => `  --${t.name}: ${t.value};`);
const easingVars = tokens.easing.tokens.map((t) => `  --${t.name}: ${t.value};`);
const fontVars = Object.entries(tokens.type.families).map(([k, v]) => `  --font-${k}: ${v};`);

const typeStyles = tokens.type.groups.flatMap((g) =>
  g.styles.map((s) => ({ ...s, family: g.family }))
);

const banner = `/* Generated from design/tokens.json by packages/tokens — do not edit. */\n`;

await mkdir(out, { recursive: true });

await writeFile(
  resolve(out, "tokens.css"),
  `${banner}:root {${section("Colour", lines(colorVars))}
${section("Space", lines(spaceVars))}
${section("Radius", lines(radiusVars))}
${section("Edges and depth", lines(shadowVars))}
${section("Duration", lines(durationVars))}
${section("Easing", lines(easingVars))}
${section("Families", lines(fontVars))}
}
`
);

/* Tailwind v4 reads these namespaces and emits the matching utilities. */
const themeColors = tokens.color.tokens.map((t) => `  --color-${t.name}: ${deref(t.value)};`);
/* Tailwind derives its whole numeric spacing scale from this one step, so p-4
   is 16px (space-4) and p-6 is 24px (space-5). The named --space-* properties
   stay available in tokens.css for plain CSS and the HTML variants. */
const themeSpacing = [`  --spacing: 4px;`, ...tokens.spacing.tokens.map((t) => `  --${t.name}: ${t.value};`)];
const themeRadius = tokens.radius.tokens.map(
  (t) => `  --radius-${t.name.replace(/^radius-/, "")}: ${t.value};`
);
const themeShadow = tokens.shadow.tokens.map(
  (t) => `  --shadow-${t.name.replace(/^shadow-/, "")}: ${t.value};`
);
const themeEase = tokens.easing.tokens.map(
  (t) => `  --ease-${t.name.replace(/^ease-/, "")}: ${t.value};`
);
const themeFonts = Object.entries(tokens.type.families).map(([k, v]) => `  --font-${k}: ${v};`);
const themeText = typeStyles.flatMap((s) =>
  [
    `  --text-${s.name}: ${s.fontSize};`,
    `  --text-${s.name}--line-height: ${s.lineHeight};`,
    s.fontWeight ? `  --text-${s.name}--font-weight: ${s.fontWeight};` : null,
    s.letterSpacing ? `  --text-${s.name}--letter-spacing: ${s.letterSpacing};` : null,
  ].filter(Boolean)
);

await writeFile(
  resolve(out, "theme.css"),
  `${banner}@theme {${section("Colour", lines(themeColors))}
${section("Space — 4px grid", lines(themeSpacing))}
${section("Radius", lines(themeRadius))}
${section("Edges and depth", lines(themeShadow))}
${section("Easing", lines(themeEase))}
${section("Families", lines(themeFonts))}
${section("Type scale", lines(themeText))}
}
`
);

console.log(
  `tokens: ${tokens.color.tokens.length} colours, ${typeStyles.length} type styles → dist/`
);
