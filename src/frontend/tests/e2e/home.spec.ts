import { test, expect } from "@playwright/test";

test("home renders hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("DocCum")).toBeVisible();
});
