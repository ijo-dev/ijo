import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("text-reveal", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/text-reveal");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    const text = preview.locator("[data-slot='text-reveal']");
    await expect(text).toContainText("in your cup by Thursday");
    await expect(text).toBeVisible();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/text-reveal");

    await page.getByLabel("Duration", { exact: true }).fill("1.5");

    await expect(page.getByTestId("code-block")).toContainText("duration={1.5}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/text-reveal");

    const text = page.getByTestId("preview-stage").locator("[data-slot='text-reveal']");
    await expect(text).toBeVisible();
    await expect(text).toHaveCSS("opacity", "1");
    await context.close();
  });
});
