import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("card-stack", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/card-stack");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    await preview.getByRole("button", { name: "Next card" }).click();
    await expect(preview.getByRole("status")).toHaveText("Card 2 of 4");
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/card-stack");

    await page.getByLabel("Offset", { exact: true }).fill("20");

    await expect(page.getByTestId("code-block")).toContainText("offset={20}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/card-stack");

    const preview = page.getByTestId("preview-stage");
    await preview.getByRole("button", { name: "Next card" }).click();
    await expect(preview.getByRole("status")).toHaveText("Card 2 of 4");
    await context.close();
  });
});
