/** Shared shapes for every component in the library. */

/**
 * One row of the customize panel. Each control maps 1:1 to a prop of the same
 * key, so the panel, the props table and the generated snippet all stay in step
 * without per-component wiring.
 */
export type Control =
  | {
      kind: "range";
      label: string;
      /** What this prop is for, in the props table and the panel tooltip. */
      help: string;
      min: number;
      max: number;
      step: number;
      default: number;
      /** Appended to the live value, e.g. "s" or "px". */
      unit?: string;
    }
  | {
      kind: "select";
      label: string;
      help: string;
      options: readonly { value: string; label: string }[];
      default: string;
    }
  | {
      kind: "switch";
      label: string;
      help: string;
      default: boolean;
    };

export type Controls = Record<string, Control>;

/** The value each control currently holds — the props passed to the preview. */
export type ControlValues = Record<string, number | string | boolean>;

export const defaultValues = (controls: Controls): ControlValues =>
  Object.fromEntries(Object.entries(controls).map(([key, c]) => [key, c.default]));

export const CATEGORIES = [
  "Buttons",
  "Text",
  "Scroll",
  "UI",
  "Menus",
  "Sections",
  "Backgrounds",
  "Shaders",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Meta = {
  /** URL slug and registry item name. */
  name: string;
  /** Human title shown on the card and page. */
  title: string;
  /** The React export, used to generate usage snippets. */
  export: string;
  category: Category;
  /** One sentence: what it does, not how. */
  description: string;
  /** A short paragraph on the interaction, including edge cases. */
  behaviour: string;
  /** The children the generated snippet shows, so the code matches the demo. */
  demoChildren: string[];
  tags: string[];
  /** GSAP plugins the component registers, for the dependency list. */
  plugins: string[];
  dependencies: string[];
  /** ISO date the component first shipped; drives the "New" badge. */
  added: string;
  /** Gzipped size of component.tsx in bytes, filled in by the registry build. */
  sizeGzip?: number;
};

export type RegistryEntry = {
  meta: Meta;
  controls: Controls;
  source: { react: string; vue: string; html: string };
};
