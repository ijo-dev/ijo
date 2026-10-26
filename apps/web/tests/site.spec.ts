import { expect, test } from "@playwright/test";

test("home page leads with the hero and the library", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What do you want to animate?",
  );
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

test("every page is reachable from the main navigation", async ({ page }) => {
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

test("search filters by category with Tab and suggests words when nothing matches", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog", { name: "Search components" });
  await expect(page.getByRole("combobox", { name: "Search components" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Text", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(dialog.getByText("4 matching components")).toBeVisible();

  // The filter row keeps its full height even when the list below is long.
  const all = dialog.getByRole("button", { name: "All", exact: true });
  expect((await all.boundingBox())?.height).toBeGreaterThanOrEqual(27);

  await page.keyboard.type("zzzz");
  await expect(dialog.getByText("No results for “zzzz”")).toBeVisible();
  await dialog.getByRole("button", { name: "scroll", exact: true }).click();
  await expect(dialog.getByText("3 matching components")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search components" })).toBeFocused();
});

test("the search button opens search and Escape closes it", async ({ page }) => {
  await page.goto("/library");
  const button = page.getByRole("button", { name: "Search components" }).first();
  await button.click();

  const dialog = page.getByRole("dialog", { name: "Search components" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});

test("the changelog lists releases newest first and moves the ruler as you scroll", async ({
  page,
}) => {
  await page.goto("/changelog");
  const releases = page.locator("[data-entry]");
  await expect(releases.first()).toContainText("What do you want to animate?");
  const head = page.locator("[data-playhead]").first();
  const before = await head.evaluate((el) => el.style.getPropertyValue("--p"));
  await releases.last().scrollIntoViewIfNeeded();
  await expect
    .poll(() => head.evaluate((el) => Number(el.style.getPropertyValue("--p"))))
    .toBeGreaterThan(Number(before) + 0.5);
});

test("the prompt box finds a component and offers a prompt", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe the animation you want").fill("pricing cards that pile up");
  const answer = page.getByRole("region", { name: "Best match: Card Stack" });
  await expect(answer).toBeVisible();
  await expect(answer.getByRole("button", { name: "Copy prompt" })).toBeVisible();

  await page.getByLabel("Describe the animation you want").fill("zzzz");
  await expect(page.getByText("Nothing in the library fits")).toBeVisible();
});

test("clicking outside search closes it", async ({ page }) => {
  await page.goto("/changelog");
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog", { name: "Search components" });
  await expect(page.getByRole("combobox", { name: "Search components" })).toBeFocused();
  const size = page.viewportSize()!;
  await page.mouse.click(8, size.height - 8);
  await expect(dialog).toBeHidden();
});

test("on a phone the dock navigates and opens search", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The dock is for phones");
  await page.goto("/");
  const dock = page.locator("nav", { has: page.getByRole("link", { name: "Changelog" }) }).last();
  await dock.getByRole("link", { name: "Library" }).click();
  await expect(page).toHaveURL(/\/library$/);
  await expect(dock.getByRole("link", { name: "Library" })).toHaveAttribute("aria-current", "page");
  await dock.getByRole("button", { name: "Search components" }).click();
  await expect(page.getByRole("dialog", { name: "Search components" })).toBeVisible();
});

test("screenshots of the home prompt box", async ({ page }, info) => {
  const dir = `screenshots/${info.project.name}`;
  await page.goto("/");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/home-empty.png` });
  await page.getByLabel("Describe the animation you want").fill("pricing cards that pile up");
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/home-answer.png`, fullPage: false });
  await page.getByRole("region", { name: /Best match/ }).screenshot({ path: `${dir}/answer.png` });
});

test("screenshot of the changelog", async ({ page }, info) => {
  await page.goto("/changelog");
  await page.waitForTimeout(600);
  await page.screenshot({ path: `screenshots/${info.project.name}/changelog.png` });
});

test("dragging the changelog ruler travels through time", async ({ page }, info) => {
  await page.goto("/changelog");
  const ruler = page
    .getByRole("slider", { name: "Travel through releases" })
    .locator("visible=true");
  const box = (await ruler.boundingBox())!;
  const last = await ruler.getAttribute("aria-valuemax");
  const vertical = box.height > box.width;

  await page.mouse.move(box.x + 4, box.y + 4);
  await page.mouse.down();
  await page.mouse.move(
    vertical ? box.x + 4 : box.x + box.width - 2,
    vertical ? box.y + box.height - 2 : box.y + 4,
    { steps: 12 },
  );
  await page.mouse.up();
  await expect(ruler).toHaveAttribute("aria-valuenow", last!);
  await page.screenshot({ path: `screenshots/${info.project.name}/changelog-scrubbed.png` });

  await ruler.focus();
  await page.keyboard.press("Home");
  await expect(ruler).toHaveAttribute("aria-valuenow", "1");
});
