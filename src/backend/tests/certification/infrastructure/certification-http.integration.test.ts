import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { createCertificate } from "../../../certification/domain/create-certificate";
import { Content } from "../../../certification/domain/content";
import { createCertifyContentEndpoint } from "../../../certification/infrastructure/certify-content-http";
import { createGetCertificateEndpoint } from "../../../certification/infrastructure/get-certificate-http";

describe("Certification HTTP endpoints", () => {
  it("certify endpoint returns 201", async () => {
    const app = new Hono();
    app.route(
      "/api",
      createCertifyContentEndpoint({
        certifyContent: {
          execute: async () =>
            createCertificate(
              "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              Content.fromFile(new TextEncoder().encode("from-endpoint"), "text/plain", "from-endpoint.txt"),
              new Date("2026-03-18T12:00:00.000Z"),
              {
                chainIndex: 0,
                previousCertificateDigest:
                  "0000000000000000000000000000000000000000000000000000000000000000",
                cubepathUnixTimeCheckedAt: null,
                cubepathUnixTimeSourceHash: null,
                cubepathStatusCheckedAt: null,
                cubepathStatusSourceHash: null
              }
            )
        } as never
      })
    );

    const formData = new FormData();
    formData.append(
      "file",
      new File([new TextEncoder().encode("from-endpoint")], "from-endpoint.txt", {
        type: "text/plain"
      })
    );

    const response = await app.request("http://localhost/api/certify", {
      method: "POST",
      body: formData
    });

    expect(response.status).toBe(201);
  });

  it("get certificate endpoint returns 404 when missing", async () => {
    const app = new Hono();
    app.route(
      "/api",
      createGetCertificateEndpoint({
        getCertificate: {
          execute: async () => null
        } as never
      })
    );

    const response = await app.request("http://localhost/api/cert/missing");
    expect(response.status).toBe(404);
  });
});
