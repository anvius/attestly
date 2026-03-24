import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { buildContactController } from "../../../contact/infrastructure/controllers/contact-controller";

describe("Contact controller", () => {
  it("returns random captcha config", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildContactController({
        contactRequestUseCase: {
          execute: async () => undefined
        } as never
      })
    );

    const response = await app.request("http://localhost/api/contact/config");
    expect(response.status).toBe(200);

    const body = (await response.json()) as { captcha: { firstOperand: number; secondOperand: number } };
    // Captcha is now random: operands in range 2..12
    expect(body.captcha.firstOperand).toBeGreaterThanOrEqual(2);
    expect(body.captcha.firstOperand).toBeLessThanOrEqual(12);
    expect(body.captcha.secondOperand).toBeGreaterThanOrEqual(2);
    expect(body.captcha.secondOperand).toBeLessThanOrEqual(12);
  });

  it("accepts valid contact request", async () => {
    const app = new Hono();
    const controller = buildContactController({
      contactRequestUseCase: {
        execute: async () => undefined
      } as never
    });
    app.route("/api", controller);

    // Get config first to get valid token
    const configRes = await app.request("http://localhost/api/contact/config");
    const configBody = (await configRes.json()) as { captcha: { firstOperand: number; secondOperand: number; token: string } };

    const response = await app.request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Mensaje de contacto de prueba",
        captchaToken: configBody.captcha.token,
        captchaAnswer: configBody.captcha.firstOperand + configBody.captcha.secondOperand,
        honeypot: ""
      })
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});
