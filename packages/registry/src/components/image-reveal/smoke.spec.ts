import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("image-reveal", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/image-reveal");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    const frame = preview.locator("[data-slot='image-reveal']");
    // Below the box's fold the frame is still masked...
    await expect(frame).not.toHaveCSS("clip-path", /inset\(0%|none/);
    // ...and scrolling it into view opens the mask fully.
    await preview.locator(".overflow-y-auto").evaluate((box) => box.scrollTo(0, box.scrollHeight));
    await expect(frame).toHaveCSS("clip-path", /inset\(0(%|px)?( 0(%|px)?)*\)|none/);
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
