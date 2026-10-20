import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("marquee", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/marquee");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    const copies = preview.locator("[data-slot='marquee-copy']");
    await expect(copies).toHaveCount(2);
    // The duplicate copy is hidden from assistive tech.
    await expect(copies.nth(1)).toHaveAttribute("aria-hidden", "true");
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/marquee");

    await page.getByLabel("Duration", { exact: true }).fill("30");

    await expect(page.getByTestId("code-block")).toContainText("duration={30}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/marquee");

    await expect(page.getByTestId("preview-stage").getByText("Yaba").first()).toBeVisible();
    await context.close();
  });
});
