/** One place for the facts the pages and the registry URLs both need. */
export const SITE = {
  name: "Ijó",
  // Resolved in next.config.ts, so it is the same on the server and the client.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  tagline: "Motion components for the web, free and open.",
  description:
    "A free, MIT-licensed library of GSAP motion components for React, Vue and plain HTML, built to stay fast on mid-range Android phones.",
  repo: "https://github.com/ijo-dev/ijo",
} as const;

export const registryUrl = (name: string) => `${SITE.url}/r/${name}.json`;
