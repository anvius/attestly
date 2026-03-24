import { describe, expect, it } from "bun:test";
import { createServerApp } from "../../shared/http/server";

describe("Certification API acceptance", () => {
  it("certifies one file and retrieves the certificate", async () => {
    process.env.DB_PATH = ":memory:";
    process.env.DISABLE_SMTP = "1";
    const app = createServerApp();

    const createFormData = new FormData();
    createFormData.append(
      "file",
      new File([new TextEncoder().encode("acceptance-content")], "evidence.txt", {
        type: "text/plain"
      })
    );

    const certifyResponse = await app.request("http://localhost/api/certify", {
      method: "POST",
      body: createFormData
    });

    expect(certifyResponse.status).toBe(201);
    const created = (await certifyResponse.json()) as { id: string; hash: string };
    expect(created.id.length).toBeGreaterThan(10);
    expect(created.hash.length).toBe(64);

    const fetchResponse = await app.request(`http://localhost/api/cert/${created.id}`);
    expect(fetchResponse.status).toBe(200);

    const loaded = (await fetchResponse.json()) as { id: string; hash: string };
    expect(loaded.id).toBe(created.id);
    expect(loaded.hash).toBe(created.hash);
  });

  it("rejects files that exceed max upload size", async () => {
    process.env.DB_PATH = ":memory:";
    process.env.DISABLE_SMTP = "1";
    const app = createServerApp();

    const tooLarge = new Uint8Array(26 * 1024 * 1024);
    const createFormData = new FormData();
    createFormData.append(
      "file",
      new File([tooLarge], "too-large.bin", {
        type: "application/octet-stream"
      })
    );

    const response = await app.request("http://localhost/api/certify", {
      method: "POST",
      body: createFormData
    });

    expect(response.status).toBe(400);
  });

  it("accepts valid contact request", async () => {
    process.env.DB_PATH = ":memory:";
    process.env.DISABLE_SMTP = "1";
    const app = createServerApp();

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
        message: "Necesito ayuda con una certificacion",
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
