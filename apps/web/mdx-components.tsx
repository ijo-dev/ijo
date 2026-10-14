import type { MDXComponents } from "mdx/types";

/** Required by @next/mdx. Docs prose styling lives in the .prose-docs utility. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-h1 font-semibold tracking-[-0.025em] text-text" {...props} />
    ),
    ...components,
  };
}
