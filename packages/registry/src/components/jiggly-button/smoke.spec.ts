import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("jiggly-button", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/jiggly-button");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    await preview.getByRole("button", { name: "Add to cart" }).click();
    // The press is a real click: the demo's cart count goes up.
    await expect(preview.getByText("1 × Ìjẹ̀bú dark roast")).toBeVisible();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/jiggly-button");

    await page.getByLabel("Intensity", { exact: true }).fill("0.8");

    await expect(page.getByTestId("code-block")).toContainText("intensity={0.8}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/jiggly-button");

    await page.getByTestId("preview-stage").getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByTestId("preview-stage").getByText("1 × Ìjẹ̀bú dark roast")).toBeVisible();
    await context.close();
  });
});
