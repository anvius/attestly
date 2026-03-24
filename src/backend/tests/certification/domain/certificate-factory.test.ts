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
    );

    expect(certificate.id.length).toBeGreaterThan(10);
    expect(certificate.hash).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(certificate.timestamp.toISOString()).toBe("2026-03-18T20:00:00.000Z");
    expect(certificate.fileName).toBeNull();
    expect(certificate.contentType).toBe("text/plain");
    expect(certificate.originalContentPreview).toBe("hello from doccum");
  });

  it("creates certificate from file content", () => {
    const content = Content.fromFile(new TextEncoder().encode("binary"), "text/plain", "proof.txt");

    const certificate = CertificateFactory.create(
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      content,
      new Date("2026-03-18T21:00:00.000Z"),
    );

    expect(certificate.fileName).toBe("proof.txt");
    expect(certificate.originalContentPreview).toBe("proof.txt");
  });

  it("returns immutable certificate", () => {
    const certificate = CertificateFactory.create(
      "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      Content.fromText("immutable"),
      new Date("2026-03-18T22:00:00.000Z"),
    );

    expect(Object.isFrozen(certificate)).toBe(true);
  });
});
