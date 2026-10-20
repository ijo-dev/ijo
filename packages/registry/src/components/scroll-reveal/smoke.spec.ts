import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("scroll-reveal", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/scroll-reveal");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    // The first roast is already inside the list's viewport, so it reveals straight away.
    const items = preview.locator("[data-slot='scroll-reveal-item']");
    await expect(items.first()).toHaveCSS("opacity", "1");

    // The last roast is below the box's fold: hidden until the box scrolls to it.
    await expect(items.last()).toHaveCSS("opacity", "0");
    await preview.locator(".overflow-y-auto").evaluate((box) => box.scrollTo(0, box.scrollHeight));
    await expect(items.last()).toHaveCSS("opacity", "1");
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/scroll-reveal");

    await page.getByLabel("Distance", { exact: true }).fill("60");

    await expect(page.getByTestId("code-block")).toContainText("distance={60}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/scroll-reveal");

    const items = page.getByTestId("preview-stage").locator("[data-slot='scroll-reveal-item']");
    await expect(items.first()).toHaveCSS("opacity", "1");
    await expect(items.last()).toHaveCSS("opacity", "1");
    await context.close();
  });
});
