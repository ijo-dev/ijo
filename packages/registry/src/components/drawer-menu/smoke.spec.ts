import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("drawer-menu", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/drawer-menu");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    await preview.getByRole("button", { name: "Menu" }).click();
    const dialog = preview.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Brew guides" })).toBeVisible();
    // Escape closes it and hands focus back to the button.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(preview.getByRole("button", { name: "Menu" })).toBeFocused();
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/drawer-menu");

    await page.getByLabel("Stagger", { exact: true }).fill("0.1");

    await expect(page.getByTestId("code-block")).toContainText("stagger={0.1}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/drawer-menu");

    const preview = page.getByTestId("preview-stage");
    await preview.getByRole("button", { name: "Menu" }).click();
    await expect(preview.getByRole("dialog", { name: "Menu" })).toBeVisible();
    await context.close();
  });
});
