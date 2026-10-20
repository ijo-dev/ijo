import { expect, test } from "@playwright/test";

test("home page leads with the hero and the library", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Motion for every site");
  await expect(page.getByRole("link", { name: "Browse components" }).first()).toBeVisible();
});

test("library search narrows the grid and says so when nothing matches", async ({ page }) => {
  await page.goto("/library");
  const search = page.getByLabel("Filter components");

  await search.fill("rise");
  await expect(page.getByRole("heading", { name: "Rise In" })).toBeVisible();

  await search.fill("zzzz");
  await expect(page.getByText("Nothing matches")).toBeVisible();
});

test("a component page carries its props table and install command", async ({ page }) => {
  await page.goto("/library/rise-in");
  await expect(page.getByRole("heading", { name: "Rise In", level: 1 })).toBeVisible();
  await expect(page.getByRole("cell", { name: "duration", exact: true })).toBeVisible();
  await expect(page.getByText("npx shadcn@latest add")).toBeVisible();
});

test("the code block switches framework", async ({ page }) => {
  await page.goto("/library/rise-in");
  const block = page.getByTestId("code-block");

  await expect(block).toContainText("import { RiseIn");
  await block.getByRole("tab", { name: "Vue" }).click();
  await expect(block).toContainText("<template>");
  await block.getByRole("tab", { name: "HTML" }).click();
  await expect(block).toContainText('data-slot="rise-in"');
});

test("the registry serves an item the shadcn CLI can read", async ({ request }) => {
  const response = await request.get("/r/rise-in.json");
  expect(response.ok()).toBeTruthy();

  const item = await response.json();
  expect(item.name).toBe("rise-in");
  expect(item.files[0].content).toContain("export function RiseIn");
});

test("every page is reachable from the header", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Library", "Docs", "Changelog"]) {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/");
  }
});

test("no component page is wider than the screen", async ({ page }) => {
  await page.goto("/library");
  const slugs = await page
    .locator("main a[href^='/library/']")
    .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute("href")))]);
  expect(slugs.length).toBeGreaterThan(1);

  for (const href of ["/", "/library", ...slugs]) {
    await page.goto(href!);
    // Let lazily mounted demos appear before measuring.
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${href} scrolls sideways by ${overflow}px`).toBeLessThanOrEqual(0);
  }
});

test("⌘K opens search, filters the library and opens a result", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");

  const dialog = page.getByRole("dialog", { name: "Search components" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search components" })).toBeFocused();

  await page.keyboard.type("card stack");
  await expect(dialog.getByText("1 matching component")).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/library\/card-stack$/);
  await expect(dialog).toBeHidden();
});

test("the search button opens search and Escape closes it", async ({ page }) => {
  await page.goto("/library");
  const button = page.getByRole("button", { name: "Search components" });
  await button.click();

  const dialog = page.getByRole("dialog", { name: "Search components" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});
