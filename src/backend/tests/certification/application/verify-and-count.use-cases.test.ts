import { describe, expect, it } from "bun:test";
import { VerifyHashUseCase } from "../../../certification/application/verify-hash-use-case";
import { CountCertificatesUseCase } from "../../../certification/application/count-certificates-use-case";
import type { CertificateRepository } from "../../../certification/application/interfaces/certificate-repository";
import type { Certificate } from "../../../certification/domain/certificate";

function createFakeRepository(
  overrides: Partial<CertificateRepository> = {}
): CertificateRepository {
  return {
    save: async () => {},
    findById: async () => null,
    findByHash: async () => null,
    findLatest: async () => null,
    count: async () => 0,
    ...overrides
  };
}

describe("VerifyHashUseCase", () => {
  it("returns null for invalid hash format", async () => {
    const repo = createFakeRepository();
    const useCase = new VerifyHashUseCase(repo);

    const result = await useCase.execute({ hash: "not-a-valid-hash" });
    expect(result).toBeNull();
  });

  it("returns null for hash too short", async () => {
    const repo = createFakeRepository();
    const useCase = new VerifyHashUseCase(repo);

    const result = await useCase.execute({ hash: "aabbcc" });
    expect(result).toBeNull();
  });

  it("delegates to repository for valid hash", async () => {
    const fakeCert = { id: "cert-1", hash: "a".repeat(64) } as Certificate;
    const repo = createFakeRepository({
      findByHash: async (hash) => (hash === "a".repeat(64) ? fakeCert : null)
    });
    const useCase = new VerifyHashUseCase(repo);

    const result = await useCase.execute({ hash: "a".repeat(64) });
    expect(result).not.toBeNull();
    expect(result?.id).toBe("cert-1");
  });

  it("returns null when hash not found", async () => {
    const repo = createFakeRepository({
      findByHash: async () => null
    });
    const useCase = new VerifyHashUseCase(repo);

    const result = await useCase.execute({ hash: "b".repeat(64) });
    expect(result).toBeNull();
  });
});

describe("CountCertificatesUseCase", () => {
  it("returns count from repository", async () => {
    const repo = createFakeRepository({ count: async () => 42 });
    const useCase = new CountCertificatesUseCase(repo);

    const result = await useCase.execute();
    expect(result).toBe(42);
  });

  it("returns zero when no certificates", async () => {
    const repo = createFakeRepository({ count: async () => 0 });
    const useCase = new CountCertificatesUseCase(repo);

    const result = await useCase.execute();
    expect(result).toBe(0);
  });
});
