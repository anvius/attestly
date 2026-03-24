import { test, expect } from "@playwright/test";

test("full certification flow from text", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("DocCum")).toBeVisible();

  await page.getByLabel("Pega aqui el contenido a certificar").fill("contenido de prueba e2e");
  await page.getByRole("button", { name: "Certificar Contenido" }).click();

  await expect(page).toHaveURL(/\/cert\//);
  await expect(page.getByText("Certificado de Existencia")).toBeVisible();
  await expect(page.getByTestId("cert-hash")).toBeVisible();
});
