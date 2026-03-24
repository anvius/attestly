import { beforeEach, describe, expect, it } from "bun:test";
import { Database } from "bun:sqlite";
import { Content } from "../../../certification/domain/content";
import { CertificateFactory } from "../../../certification/domain/services/certificate-factory";
import { SqliteCertificateRepository } from "../../../certification/infrastructure/repositories/sqlite-certificate-repository";

describe("SqliteCertificateRepository", () => {
  let db: Database;
  let repository: SqliteCertificateRepository;

  beforeEach(() => {
    db = new Database(":memory:");
    db.run(`
      CREATE TABLE certificates (
        id TEXT PRIMARY KEY,
        hash TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        file_name TEXT,
        content_type TEXT,
        original_content_preview TEXT
      )
    `);
    repository = new SqliteCertificateRepository(db);
  });

  it("saves and retrieves certificate", async () => {
    const certificate = CertificateFactory.create(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      Content.fromText("repo-test"),
      new Date("2026-03-18T11:00:00.000Z")
    );

    await repository.save(certificate);
    const loaded = await repository.findById(certificate.id);

    expect(loaded?.id).toBe(certificate.id);
    expect(loaded?.hash).toBe(certificate.hash);
  });
});
