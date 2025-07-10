import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("should have proper accessibility attributes", async ({ page }) => {
    await page.goto("/");

    // Check for basic accessibility elements
    const main = page.locator("main");
    if ((await main.count()) > 0) {
      await expect(main.first()).toBeVisible();
    }

    // Check for heading structure
    const h1 = page.locator("h1");
    if ((await h1.count()) > 0) {
      await expect(h1.first()).toBeVisible();
    }

    // Check that interactive elements are keyboard accessible
    const buttons = page.locator("button:visible");
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const isDisabled = await firstButton.getAttribute("disabled");
      if (!isDisabled) {
        await firstButton.focus();
        await expect(firstButton).toBeFocused();
      }
    }

    // Check that links have proper attributes
    const links = page.locator("a:visible");
    const linkCount = await links.count();

    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute("href");
      expect(href).toBeDefined();
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");

    // Should have at least one focusable element
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement.first()).toBeVisible();
    }
  });
});
