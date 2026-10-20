import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("image-reveal", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/image-reveal");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    await expect(preview.getByRole("img", { name: /bag of Ìjẹ̀bú dark roast/ })).toBeVisible();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/image-reveal");

    await page.getByLabel("Zoom", { exact: true }).fill("1.5");

    await expect(page.getByTestId("code-block")).toContainText("zoom={1.5}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/image-reveal");

    await expect(
      page.getByTestId("preview-stage").getByRole("img", { name: /bag of Ìjẹ̀bú dark roast/ }),
    ).toBeVisible();
    await context.close();
  });
});
