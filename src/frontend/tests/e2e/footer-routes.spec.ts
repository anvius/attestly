import { test, expect } from "@playwright/test";

test("footer routes resolve", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Privacidad|Privacy/ })).toBeVisible();

  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: /Condiciones de Uso|Terms of Use/ })).toBeVisible();

  await page.goto("/help");
  await expect(page.getByRole("heading", { name: /Ayuda|Help/ })).toBeVisible();

  await page.goto("/faq");
  await expect(page.getByRole("heading", { name: "FAQ" })).toBeVisible();

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /Sobre Doccum|About Doccum/ })).toBeVisible();
});
