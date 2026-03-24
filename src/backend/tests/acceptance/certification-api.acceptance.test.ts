import { describe, expect, it } from "bun:test";
import { createServerApp } from "../../shared/http/server";

describe("Certification API acceptance", () => {
  it("certifies text and retrieves the certificate", async () => {
    process.env.DB_PATH = ":memory:";
    const app = createServerApp();

    const createFormData = new FormData();
    createFormData.append("text", "acceptance-content");

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
});
