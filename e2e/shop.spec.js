import { test, expect } from "@playwright/test";
async function capture(page, info, name) {
  await page.screenshot({
    path: info.outputPath(`${name}.png`),
    fullPage: true,
    animations: "disabled",
  });
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test("catalogue filters, sorting and persistent favourites", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(10);
  await capture(page, info, "storefront");
  await noOverflow(page);
  await page.getByRole("searchbox", { name: "Search products" }).fill("mug");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Save The daily mug", exact: true })
    .click();
  await page.getByRole("link", { name: "Saved items (1)" }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await capture(page, info, "saved");
  await page.goto("/#/shop?collection=all");
  await page.getByRole("button", { name: "Workspace", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page
    .getByRole("combobox", { name: "Maximum price" })
    .selectOption("100000");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("nonexistent");
  await expect(page.getByText("Nothing here just yet.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(10);
  await page
    .getByRole("combobox", { name: "Sort products" })
    .selectOption("price-low");
  await expect(page.locator(".product-card").first()).toContainText(
    "Folio notebook",
  );
});

test("product, cart, refresh and demo checkout complete with no saved personal data", async ({
  page,
}, info) => {
  await page.goto("/#/product/arc-lamp");
  await expect(
    page.getByRole("heading", { name: "Arc desk lamp", exact: true }),
  ).toBeVisible();
  await capture(page, info, "product");
  await noOverflow(page);
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await page.getByRole("link", { name: "Shopping bag (1)" }).click();
  await expect(page.locator(".summary-total")).toContainText("₹2,648");
  await page.reload();
  await expect(page.locator(".summary-total")).toContainText("₹2,648");
  await page
    .getByRole("button", { name: "Increase Arc desk lamp quantity" })
    .click();
  await expect(page.locator(".summary-total")).toContainText("₹4,998");
  await expect(
    page.getByText("Your demo bag qualifies for free shipping."),
  ).toBeVisible();
  await capture(page, info, "cart");
  await noOverflow(page);
  await page.getByRole("link", { name: "Continue to demo checkout" }).click();
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByRole("button", { name: "Use sample details" }).click();
  await page.getByRole("textbox", { name: "PIN code" }).fill("000000");
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByRole("textbox", { name: "PIN code" }).fill("302001");
  await capture(page, info, "checkout");
  await noOverflow(page);
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page).toHaveURL(/order/);
  await expect(
    page.getByRole("heading", { name: /Your demo is complete/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Shopping bag (0)" }),
  ).toBeVisible();
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(stored).not.toContain("alex@example.com");
  expect(stored).not.toContain("Sample Lane");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Your demo is complete/ }),
  ).toBeVisible();
  await capture(page, info, "confirmation");
  await noOverflow(page);
});

test("bad persisted data, quantity limits, removal, missing pages and small screens", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "form-field-cart-v1",
      JSON.stringify([
        { id: "toString", quantity: 4 },
        { id: "daily-mug", quantity: 999 },
      ]),
    );
    localStorage.setItem("form-field-saved-v1", "broken");
  });
  await page.goto("/#/cart");
  await expect(
    page.getByRole("button", { name: "Increase The daily mug quantity" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Remove The daily mug" }).click();
  await expect(
    page.getByRole("heading", { name: "A little room in your bag." }),
  ).toBeVisible();
  await page.goto("/#/product/toString");
  await expect(
    page.getByRole("heading", { name: "That object isn't in our collection." }),
  ).toBeVisible();
  await page.goto("/#/missing");
  await expect(
    page.getByRole("heading", { name: "We took a wrong turn." }),
  ).toBeVisible();
  await page.goto("/#/about");
  await capture(page, info, "about");
  await noOverflow(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await noOverflow(page);
  await capture(page, info, "small-mobile");
});
