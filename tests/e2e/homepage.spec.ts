import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Superoptimised/);

    // Check for key elements on the homepage
    await expect(page.locator("body")).toBeVisible();

    // Verify no console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState("networkidle");

    // Allow for some common warnings but fail on actual errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("Warning") &&
        !error.includes("favicon") &&
        !error.includes("DevTools") &&
        !error.includes("WebSocket connection") &&
        !error.includes("ERR_CONNECTION_REFUSED")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should be responsive", async ({ page }) => {
    await page.goto("/");

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("body")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("body")).toBeVisible();
  });
});
