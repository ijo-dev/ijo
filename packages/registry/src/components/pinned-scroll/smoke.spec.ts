import { expect, test } from "@playwright/test";

/** Smoke test: the component page renders, previews and keeps its controls honest. */
test.describe("pinned-scroll", () => {
  test("renders its preview and behaves", async ({ page }) => {
    await page.goto("/library/pinned-scroll");

    const preview = page.getByTestId("preview-stage");
    await expect(preview).toBeVisible();
    await expect(preview.locator("[data-slot='pinned-scroll-item']").first()).toBeVisible();

    // Scrolling the demo's own box down must slide the row sideways.
    const track = preview.locator("[data-slot='pinned-scroll-track']");
    await preview.locator(".overflow-y-auto").evaluate((box) => box.scrollTo(0, 400));
    await expect
      .poll(() => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41))
      .toBeLessThan(-50);
  });

  test("moving a control updates the generated snippet", async ({ page }) => {
    await page.goto("/library/pinned-scroll");

    await page.getByLabel("Scroll length", { exact: true }).fill("2");

    await expect(page.getByTestId("code-block")).toContainText("length={2}");
  });

  test("reduced motion still leaves the content usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/library/pinned-scroll");

    // Nothing pins: the row is an ordinary sideways-scrolling strip.
    const row = page.getByTestId("preview-stage").locator("[data-slot='pinned-scroll']");
    await expect(row).toHaveCSS("overflow-x", "auto");
    await context.close();
  });
});
