import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { buildContactController } from "../../../contact/infrastructure/controllers/contact-controller";

describe("Contact controller", () => {
  it("returns captcha config", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildContactController({
        contactRequestUseCase: {
          execute: async () => undefined
        } as never,
        captchaFirstOperand: 7,
        captchaSecondOperand: 5
      })
    );

    const response = await app.request("http://localhost/api/contact/config");
    expect(response.status).toBe(200);

    const body = (await response.json()) as { captcha: { firstOperand: number; secondOperand: number } };
    expect(body.captcha.firstOperand).toBe(7);
    expect(body.captcha.secondOperand).toBe(5);
  });

  it("accepts valid contact request", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildContactController({
        contactRequestUseCase: {
          execute: async () => undefined
        } as never,
        captchaFirstOperand: 7,
        captchaSecondOperand: 5
      })
    );

    const response = await app.request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Mensaje de contacto de prueba",
        captchaAnswer: 12,
        honeypot: ""
      })
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});
