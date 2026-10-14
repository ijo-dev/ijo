import type { MDXComponents } from "mdx/types";
import { InstallCommand } from "@/components/site/install-command";

/** Required by @next/mdx. Docs prose styling lives in the .prose-docs utility. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Available in every docs page without an import.
    InstallCommand,
    h1: (props) => (
      <h1 className="text-h1 font-semibold tracking-[-0.025em] text-text" {...props} />
    ),
    ...components,
  };
}
