import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { CertificateFactory } from "../../../certification/domain/services/certificate-factory";
import { Content } from "../../../certification/domain/content";
import { buildCertifyController } from "../../../certification/infrastructure/controllers/certify-controller";
import { buildGetCertificateController } from "../../../certification/infrastructure/controllers/get-certificate-controller";

describe("Controllers", () => {
  it("certify controller returns 201", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildCertifyController({
        certifyContentUseCase: {
          execute: async () =>
            CertificateFactory.create(
              "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              Content.fromFile(new TextEncoder().encode("from-controller"), "text/plain", "from-controller.txt"),
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
      new File([new TextEncoder().encode("from-controller")], "from-controller.txt", {
        type: "text/plain"
      })
    );

    const response = await app.request("http://localhost/api/certify", {
      method: "POST",
      body: formData
    });

    expect(response.status).toBe(201);
  });

  it("get controller returns 404 when missing", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildGetCertificateController({
        getCertificateUseCase: {
          execute: async () => null
        } as never
      })
    );

    const response = await app.request("http://localhost/api/cert/missing");
    expect(response.status).toBe(404);
  });
});
