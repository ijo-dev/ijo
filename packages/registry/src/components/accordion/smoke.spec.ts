import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("accordion", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/accordion");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    const item = preview.locator("[data-slot='accordion-item']").nth(1);
    await item.getByText("Can I get it ground?").click();
    await expect(item).toHaveAttribute("data-state", "open");
    await expect(item.getByText("whole bean", { exact: false })).toBeVisible();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/accordion");

    await page.getByLabel("Duration", { exact: true }).fill("0.8");

    await expect(page.getByTestId("code-block")).toContainText("duration={0.8}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/accordion");

    const item = page.getByTestId("preview-stage").locator("[data-slot='accordion-item']").nth(1);
    await item.getByText("Can I get it ground?").click();
    await expect(item).toHaveJSProperty("open", true);
    await context.close();
  });
});
