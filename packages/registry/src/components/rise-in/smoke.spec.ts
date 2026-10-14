import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("rise-in", () => {
  test("renders its preview and the children end up visible", async ({ page }) => {
    await page.goto("/library/rise-in");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();

    const items = preview.locator("[data-slot='rise-in-item']");
    await expect(items.first()).toBeVisible();
    // Once the reveal finishes, clearProps hands styling back to the page.
    await expect(items.first()).toHaveCSS("opacity", "1");
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/rise-in");

    const duration = page.getByLabel("Duration");
    await duration.fill("1.5");

    await expect(page.getByTestId("code-block")).toContainText("duration={1.5}");
  });

  test("reduced motion still leaves the content visible", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/rise-in");

    const items = page.getByTestId("preview-stage").locator("[data-slot='rise-in-item']");
    await expect(items.first()).toBeVisible();
    await expect(items.first()).toHaveCSS("opacity", "1");
    await context.close();
  });
});
