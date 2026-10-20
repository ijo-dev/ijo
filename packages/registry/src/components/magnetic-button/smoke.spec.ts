import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("magnetic-button", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/magnetic-button");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    const button = preview.getByRole("button", { name: "Order a bag" });
    await expect(button).toBeVisible();
    await button.click();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/magnetic-button");

    await page.getByLabel("Strength", { exact: true }).fill("0.6");

    await expect(page.getByTestId("code-block")).toContainText("strength={0.6}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/magnetic-button");

    await expect(
      page.getByTestId("preview-stage").getByRole("button", { name: "Order a bag" }),
    ).toBeVisible();
    await context.close();
  });
});
