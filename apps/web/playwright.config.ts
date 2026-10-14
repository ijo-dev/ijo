import { defineConfig, devices } from "@playwright/test";

/* Tests always run against a fresh production build on their own port, never
   against a dev server: the dev client's HMR socket makes hydration unreliable
   under automation, and production is what we actually ship. */
const PORT = 3101;

export default defineConfig({
  // Component smoke tests live beside their source in packages/registry.
  testDir: "../..",
  testMatch: ["apps/web/tests/**/*.spec.ts", "packages/registry/src/components/**/*.spec.ts"],
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    // The device most of our readers are on.
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: `pnpm --filter @ijo/web build && pnpm --filter @ijo/web start --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    cwd: "../..",
  },
});
