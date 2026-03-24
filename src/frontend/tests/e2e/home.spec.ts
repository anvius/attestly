import { test, expect } from "@playwright/test";

test("full certification flow from file", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-header a.brand")).toBeVisible();

  const evidenceFile = {
    name: "e2e-evidence.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("contenido de prueba e2e")
  };

  await page.locator("#certificate-file").setInputFiles(evidenceFile);
  await page.locator("#certificate-file").dispatchEvent("input");
  await page.locator("#certificate-file").dispatchEvent("change");

  await expect(page.getByRole("button", { name: /Certificar Archivo|Certify File/ })).toBeEnabled();
  await page.getByRole("button", { name: /Certificar Archivo|Certify File/ }).click();

  await expect(page).toHaveURL(/\/cert\//);
  await expect(page.getByText(/Certificado de Existencia|Proof of Existence Certificate/)).toBeVisible();
  await expect(page.getByTestId("cert-hash")).toBeVisible();
});

test("home renders main hero copy", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Protege la Integridad de tus Archivos|Protect the Integrity of your Files/ })).toBeVisible();
});
