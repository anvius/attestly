import { describe, expect, it } from "bun:test";
import { Content } from "../../../certification/domain/content";
import { Certificate } from "../../../certification/domain/certificate";
import type { CertificateRepository } from "../../../certification/application/interfaces/certificate-repository";
import type { ExternalTimeEvidenceProvider } from "../../../certification/application/interfaces/external-time-evidence-provider";
import type { HashProvider } from "../../../certification/application/interfaces/hash-provider";
import { CertifyContentUseCase } from "../../../certification/application/certify-content-use-case";
import { GetCertificateUseCase } from "../../../certification/application/get-certificate-use-case";

class InMemoryCertificateRepository implements CertificateRepository {
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

class FakeHashProvider implements HashProvider {
  async calculateHash(content: Content): Promise<string> {
    const raw = content.asString();
    if (raw === "a") {
      return "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }
    return "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  }
}

class FakeEvidenceProvider implements ExternalTimeEvidenceProvider {
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

describe("CertifyContentUseCase", () => {
  it("creates and persists a certificate", async () => {
    const repository = new InMemoryCertificateRepository();
    const hashProvider = new FakeHashProvider();
    const evidenceProvider = new FakeEvidenceProvider();
    const useCase = new CertifyContentUseCase(repository, hashProvider, evidenceProvider);

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

    const fromRepo = await repository.findById(certificate.id);
    expect(fromRepo?.id).toBe(certificate.id);
  });
});

describe("GetCertificateUseCase", () => {
  it("returns null for unknown id", async () => {
    const useCase = new GetCertificateUseCase(new InMemoryCertificateRepository());
    const result = await useCase.execute({ id: "missing" });

    expect(result).toBeNull();
  });
});
