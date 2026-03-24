import { describe, expect, it } from "bun:test";
import { Content } from "../../../certification/domain/content";
import { Certificate } from "../../../certification/domain/certificate";
import type { CertificateStore } from "../../../certification/domain/certificate-store";
import type { TimeEvidenceCollector } from "../../../certification/domain/time-evidence-collector";
import type { HashCalculator } from "../../../certification/domain/hash-calculator";
import { CertifyContent } from "../../../certification/application/certify-content";
import { GetCertificate } from "../../../certification/application/get-certificate";

class InMemoryCertificateStore implements CertificateStore {
  private readonly records = new Map<string, Certificate>();

  async save(certificate: Certificate): Promise<void> {
    this.records.set(certificate.id, certificate);
  }

  async findById(id: string): Promise<Certificate | null> {
    return this.records.get(id) ?? null;
  }

  async findLatest(): Promise<Certificate | null> {
    const values = [...this.records.values()].sort((a, b) => b.chainIndex - a.chainIndex);
    return values[0] ?? null;
  }
}

class FakeHashCalculator implements HashCalculator {
  async calculateHash(content: Content): Promise<string> {
    const raw = content.asString();
    if (raw === "a") {
      return "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }
    return "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  }
}

class FakeEvidenceCollector implements TimeEvidenceCollector {
  async collectEvidence() {
    return {
      cubepathUnixTimeCheckedAt: new Date("2026-03-18T10:00:05.000Z"),
      cubepathUnixTimeSourceHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      cubepathStatusCheckedAt: new Date("2026-03-18T10:00:06.000Z"),
      cubepathStatusSourceHash:
        "2222222222222222222222222222222222222222222222222222222222222222"
    };
  }
}

describe("CertifyContent", () => {
  it("creates and persists a certificate", async () => {
    const store = new InMemoryCertificateStore();
    const hashCalculator = new FakeHashCalculator();
    const evidenceCollector = new FakeEvidenceCollector();
    const useCase = new CertifyContent(store, hashCalculator, evidenceCollector);

    const certificate = await useCase.execute({
      content: Content.fromText("a"),
      timestamp: new Date("2026-03-18T10:00:00.000Z")
    });

    expect(certificate.hash).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(certificate.timestamp.toISOString()).toBe("2026-03-18T10:00:00.000Z");
    expect(certificate.chainIndex).toBe(0);
    expect(certificate.previousCertificateDigest).toBe(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );
    expect(certificate.cubepathUnixTimeSourceHash).not.toBeNull();

    const fromStore = await store.findById(certificate.id);
    expect(fromStore?.id).toBe(certificate.id);
  });
});

describe("GetCertificate", () => {
  it("returns null for unknown id", async () => {
    const useCase = new GetCertificate(new InMemoryCertificateStore());
    const result = await useCase.execute({ id: "missing" });

    expect(result).toBeNull();
  });
});
