import type { ControlValues, Meta, Controls } from "@ijo/registry";

export const FRAMEWORKS = ["react", "vue", "html"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_LABEL: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  html: "HTML",
};

/** Only show a prop when it differs from its default, the way a person would write it. */
const changed = (controls: Controls, values: ControlValues) =>
  Object.entries(values).filter(([key, value]) => controls[key]?.default !== value);

const jsxValue = (value: ControlValues[string]) =>
  typeof value === "string" ? `"${value}"` : `{${value}}`;

const vueValue = (key: string, value: ControlValues[string]) =>
  typeof value === "string" ? `${key}="${value}"` : `:${key}="${value}"`;

const jsValue = (value: ControlValues[string]) =>
  typeof value === "string" ? `"${value}"` : String(value);

/**
 * Builds the usage snippet shown under the preview, from whatever the customize
 * panel currently holds. It is generic over every component: the props come from
 * the controls schema, so a new component needs no snippet code of its own.
 */
export function buildSnippet(
  meta: Meta,
  controls: Controls,
  values: ControlValues,
  framework: Framework,
  children: string[],
): string {
  const props = changed(controls, values);
  // Most components wrap each child in an Item; some (a button) take children as-is.
  const item = meta.item === undefined ? `${meta.export}Item` : meta.item;
  const wrap = (line: string, tag: string) => (tag ? `<${tag}>${line}</${tag}>` : line);
  const slot = item ? `div data-slot="${meta.name}-item"` : "";
  const wrapSlot = (line: string) => (item ? `<${slot}>${line}</div>` : line);

  if (framework === "react") {
    const attrs = props.map(([key, value]) => ` ${key}=${jsxValue(value)}`).join("");
    const body = children.map((line) => `  ${wrap(line, item ?? "")}`).join("\n");
    const names = item ? `${meta.export}, ${item}` : meta.export;
    return [
      `import { ${names} } from "@/components/ijo/${meta.name}";`,
      ``,
      `<${meta.export}${attrs}>`,
      body,
      `</${meta.export}>;`,
    ].join("\n");
  }

  if (framework === "vue") {
    const attrs = props.map(([key, value]) => ` ${vueValue(key, value)}`).join("");
    const body = children.map((line) => `    ${wrapSlot(line)}`).join("\n");
    return [
      `<script setup lang="ts">`,
      `import ${meta.export} from "@/components/ijo/${meta.name}.vue";`,
      `</script>`,
      ``,
      `<template>`,
      `  <${meta.export}${attrs}>`,
      body,
      `  </${meta.export}>`,
      `</template>`,
    ].join("\n");
  }

  const options = Object.keys(controls)
    .map((key) => `  ${key}: ${jsValue(values[key] as ControlValues[string])},`)
    .join("\n");
  const body = children.map((line) => `  ${wrapSlot(line)}`).join("\n");
  return [
    `<div data-slot="${meta.name}" id="${meta.name}">`,
    body,
    `</div>`,
    ``,
    `<script type="module">`,
    `import { ${meta.export.toLowerCase()} } from "./${meta.name}.js";`,
    ``,
    `${meta.export.toLowerCase()}(document.querySelector("#${meta.name}"), {`,
    options,
    `});`,
    `</script>`,
  ].join("\n");
}

/**
 * The "copy prompt" text: everything an agent needs to install and wire the
 * component into the project it is already looking at.
 */
export function buildPrompt(meta: Meta, snippet: string, siteUrl: string): string {
  return [
    `Add the "${meta.title}" motion component from the Ijó library to this project.`,
    ``,
    `1. Install it with the shadcn CLI:`,
    `   npx shadcn@latest add ${siteUrl}/r/${meta.name}.json`,
    `2. Make sure these packages are installed: ${meta.dependencies.join(", ")}.`,
    `3. ${meta.description}`,
    ``,
    `How it behaves: ${meta.behaviour}`,
    ``,
    `Use it like this, then adapt the children to the content already on the page:`,
    ``,
    snippet,
    ``,
    `Keep the prop values above — they were chosen in the Ijó customize panel.`,
    `Do not remove the reduced-motion handling inside the component.`,
  ].join("\n");
}
