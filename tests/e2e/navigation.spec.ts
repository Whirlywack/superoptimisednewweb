import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to key pages", async ({ page }) => {
    await page.goto("/");

    // Test navigation to about page if it exists
    const aboutLink = page.locator('a[href*="/about"], a:has-text("About")').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/about");
    }

    // Test navigation to blog/journey if it exists
    await page.goto("/");
    const journeyLink = page.locator('a[href*="/journey"], a:has-text("Journey")').first();
    if (await journeyLink.isVisible()) {
      await journeyLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/journey");
    }

    // Test back to home
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should handle 404 gracefully", async ({ page }) => {
    const response = await page.goto("/non-existent-page");

    // Should either be 404 or redirect to home/404 page
    if (response) {
      expect([200, 404]).toContain(response.status());
    }

    // Page should still render something
    await expect(page.locator("body")).toBeVisible();
  });
});
