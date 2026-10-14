import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const config: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // The registry ships TypeScript source; Next compiles it with the app.
  transpilePackages: ["@ijo/registry"],
  experimental: {
    // Keeps the shipped client bundle to what each page actually imports.
    optimizePackageImports: ["lucide-react"],
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack needs plugins named as strings so loader options stay serializable.
    remarkPlugins: [["remark-gfm", {}]],
    // Highlighting happens at build time, so no highlighter reaches the browser.
    rehypePlugins: [["@shikijs/rehype", { theme: "vesper", defaultLanguage: "text" }]],
  },
});

export default withMDX(config);
