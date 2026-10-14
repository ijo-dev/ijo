import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/**
 * The public origin, resolved once so the server, the client bundle and the
 * install commands can never disagree.
 *
 * Set NEXT_PUBLIC_SITE_URL once a real domain points here. Until then a Vercel
 * deploy uses its own production URL, so `npx shadcn add <url>` actually works
 * rather than pointing at a domain nobody owns yet.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3100");

const config: NextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
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
