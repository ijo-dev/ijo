import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("word-roller", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/word-roller");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    await expect(preview.locator("[data-slot='word-roller-item']").first()).toBeVisible();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/word-roller");

    await page.getByLabel("Hold", { exact: true }).fill("2");

    await expect(page.getByTestId("code-block")).toContainText("hold={2}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/word-roller");

    await expect(page.getByTestId("preview-stage").getByText("slow mornings")).toBeVisible();
    await context.close();
  });
});
