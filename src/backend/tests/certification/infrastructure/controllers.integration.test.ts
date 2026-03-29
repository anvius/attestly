import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { CertificateFactory } from "../../../certification/domain/services/certificate-factory";
import { Content } from "../../../certification/domain/content";
import { buildCertifyFileEndpoint } from "../../../certification/infrastructure/http/certify-file-endpoint";
import { buildGetCertificateEndpoint } from "../../../certification/infrastructure/http/get-certificate-endpoint";
import { buildVerifyFileEndpoint } from "../../../certification/infrastructure/http/verify-file-endpoint";
import { buildCountCertificatesEndpoint } from "../../../certification/infrastructure/http/count-certificates-endpoint";
import { buildCertifyTextEndpoint } from "../../../certification/infrastructure/http/certify-text-endpoint";

describe("Controllers", () => {
  it("certify controller returns 201", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildCertifyFileEndpoint({
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
      buildGetCertificateEndpoint({
        getCertificateUseCase: {
          execute: async () => null
        } as never
      })
    );

    const response = await app.request("http://localhost/api/cert/missing");
    expect(response.status).toBe(404);
  });

  it("verify controller returns verified=false for unknown file", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildVerifyFileEndpoint({
        verifyHashUseCase: {
          execute: async () => null
        } as never,
        hashProvider: {
          calculateHash: async () =>
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        } as never
      })
    );

    const formData = new FormData();
    formData.append(
      "file",
      new File([new TextEncoder().encode("unknown")], "unknown.txt", { type: "text/plain" })
    );

    const response = await app.request("http://localhost/api/verify", {
      method: "POST",
      body: formData
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { verified: boolean; hash: string };
    expect(body.verified).toBe(false);
    expect(body.hash).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  });

  it("count controller returns total", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildCountCertificatesEndpoint({
        countCertificatesUseCase: {
          execute: async () => 7
        } as never,
        certificateRepository: {
          findLatest: async () => null
        } as never
      })
    );

    const response = await app.request("http://localhost/api/certificates/count");
    expect(response.status).toBe(200);
    const body = (await response.json()) as { total: number };
    expect(body.total).toBe(7);
  });

  it("certify-text controller returns 201 for valid text", async () => {
    const fakeCert = CertificateFactory.create(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      Content.fromText("hello world"),
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
    );

    const app = new Hono();
    app.route(
      "/api",
      buildCertifyTextEndpoint({
        certifyContentUseCase: {
          execute: async () => fakeCert
        } as never
      })
    );

    const response = await app.request("http://localhost/api/certify-text", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "hello world" })
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as { id: string; hash: string };
    expect(body.id).toBe(fakeCert.id);
  });

  it("certify-text controller returns 400 for empty text", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildCertifyTextEndpoint({
        certifyContentUseCase: {
          execute: async () => null
        } as never
      })
    );

    const response = await app.request("http://localhost/api/certify-text", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "" })
    });

    expect(response.status).toBe(400);
  });

  it("latest controller returns 404 when no certificates", async () => {
    const app = new Hono();
    app.route(
      "/api",
      buildCountCertificatesEndpoint({
        countCertificatesUseCase: {
          execute: async () => 0
        } as never,
        certificateRepository: {
          findLatest: async () => null
        } as never
      })
    );

    const response = await app.request("http://localhost/api/certificates/latest");
    expect(response.status).toBe(404);
  });
});
