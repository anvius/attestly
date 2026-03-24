import { test, expect } from "@playwright/test";

test("contact form shows error when captcha is wrong", async ({ page }) => {
  await page.goto("/contact");

  await page.getByLabel(/Nombre completo|Full name/).fill("Ada Lovelace");
  await page.getByLabel(/Correo|Email/).fill("ada@example.com");
  await page.getByLabel(/Mensaje|Message/).fill("Necesito ayuda para validar una certificacion");
  await page.locator("#contact-captcha").fill("0");

  await page.getByRole("button", { name: /Enviar Mensaje|Send Message/ }).click();

  await expect(page).toHaveURL(/\/contact/);
});
