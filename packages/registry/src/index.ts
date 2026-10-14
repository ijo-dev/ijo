import { RiseIn, RiseInItem } from "./components/rise-in/component";
import { RiseInDemo } from "./components/rise-in/demo";
import { controls as riseInControls } from "./components/rise-in/controls";
import riseInMeta from "./components/rise-in/meta.json";
import { sources } from "./generated/sources";
import type { Category, Meta, RegistryEntry } from "./types";

export * from "./types";

/**
 * Every component in the library, in the order the site shows them.
 * Source text comes from ./generated/sources.ts, which the registry build
 * writes from the real files on disk — so the code tabs can never drift
 * from what `npx shadcn add` installs.
 */
export const registry: RegistryEntry[] = [
  {
    meta: { ...(riseInMeta as Meta), sizeGzip: sources["rise-in"].sizeGzip },
    controls: riseInControls,
    source: sources["rise-in"].source,
  },
];

/** The live preview for each component, keyed by slug. The customize panel
 *  passes its current values straight through as props. */
export const demos = {
  "rise-in": RiseInDemo,
} as const;

export const byName = (name: string) => registry.find((entry) => entry.meta.name === name);

export const categories = (): Category[] => {
  const used = new Set(registry.map((entry) => entry.meta.category));
  return [...used].sort();
};

export { RiseIn, RiseInItem, RiseInDemo };
