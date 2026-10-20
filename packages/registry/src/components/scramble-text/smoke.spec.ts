import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("scramble-text", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/scramble-text");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    // The scramble settles on the real text.
    await expect(preview.locator("[data-slot='scramble-text-visual']")).toHaveText(
      "ORDER BC-2047 CONFIRMED",
    );
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/scramble-text");

    await page.getByLabel("Duration", { exact: true }).fill("2");

    await expect(page.getByTestId("code-block")).toContainText("duration={2}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/scramble-text");

    await expect(
      page.getByTestId("preview-stage").locator("[data-slot='scramble-text-visual']"),
    ).toHaveText("ORDER BC-2047 CONFIRMED");
    await context.close();
  });
});
