import { describe, expect, it } from "bun:test";
import { Content } from "../../../certification/domain/content";
import { CertificateFactory } from "../../../certification/domain/services/certificate-factory";

describe("CertificateFactory", () => {
  it("creates certificate from text content", () => {
    const content = Content.fromText("hello from doccum");
    const timestamp = new Date("2026-03-18T20:00:00.000Z");

    const certificate = CertificateFactory.create(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      content,
      timestamp,
      {
        chainIndex: 0,
        previousCertificateDigest:
          "0000000000000000000000000000000000000000000000000000000000000000",
        cubepathUnixTimeCheckedAt: new Date("2026-03-18T20:00:02.000Z"),
        cubepathUnixTimeSourceHash:
          "1111111111111111111111111111111111111111111111111111111111111111",
        cubepathStatusCheckedAt: new Date("2026-03-18T20:00:03.000Z"),
        cubepathStatusSourceHash:
          "2222222222222222222222222222222222222222222222222222222222222222"
      }
    );

    expect(certificate.id.length).toBeGreaterThan(10);
    expect(certificate.hash).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(certificate.timestamp.toISOString()).toBe("2026-03-18T20:00:00.000Z");
    expect(certificate.fileName).toBeNull();
    expect(certificate.contentType).toBe("text/plain");
    expect(certificate.originalContentPreview).toBe("text input (17 bytes)");
    expect(certificate.chainIndex).toBe(0);
    expect(certificate.certificateDigest.length).toBe(64);
    expect(certificate.storesFileName).toBe(false);
    expect(certificate.storesOriginalContent).toBe(false);
  });

  it("creates certificate from file content", () => {
    const content = Content.fromFile(new TextEncoder().encode("binary"), "text/plain", "proof.txt");

    const certificate = CertificateFactory.create(
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      content,
      new Date("2026-03-18T21:00:00.000Z"),
      {
        chainIndex: 1,
        previousCertificateDigest:
          "3333333333333333333333333333333333333333333333333333333333333333",
        cubepathUnixTimeCheckedAt: null,
        cubepathUnixTimeSourceHash: null,
        cubepathStatusCheckedAt: null,
        cubepathStatusSourceHash: null
      }
    );

    expect(certificate.fileName).toBeNull();
    expect(certificate.originalContentPreview).toContain("document:");
    expect(certificate.originalContentPreview).toContain("proof…");
    expect(certificate.originalContentPreview).toContain("text/plain");
    expect(certificate.originalContentPreview).toContain("bytes");
  });

  it("returns immutable certificate", () => {
    const certificate = CertificateFactory.create(
      "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      Content.fromText("immutable"),
      new Date("2026-03-18T22:00:00.000Z"),
      {
        chainIndex: 2,
        previousCertificateDigest:
          "4444444444444444444444444444444444444444444444444444444444444444",
        cubepathUnixTimeCheckedAt: null,
        cubepathUnixTimeSourceHash: null,
        cubepathStatusCheckedAt: null,
        cubepathStatusSourceHash: null
      }
    );

    expect(Object.isFrozen(certificate)).toBe(true);
  });
});
